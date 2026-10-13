import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useChat } from "../../hooks/useChat";

// ── Facial expression morph-target maps ──────────────────────────────────────
const facialExpressions = {
  default: {},
  smile: {
    browInnerUp: 0.17,
    eyeSquintLeft: 0.4,
    eyeSquintRight: 0.44,
    noseSneerLeft: 0.17,
    noseSneerRight: 0.14,
    mouthPressLeft: 0.61,
    mouthPressRight: 0.41,
  },
  funnyFace: {
    jawLeft: 0.63,
    mouthPucker: 0.53,
    noseSneerLeft: 1,
    noseSneerRight: 0.39,
    mouthLeft: 1,
    eyeLookUpLeft: 1,
    eyeLookUpRight: 1,
    cheekPuff: 1,
    mouthDimpleLeft: 0.41,
    mouthRollLower: 0.32,
    mouthSmileLeft: 0.35,
    mouthSmileRight: 0.35,
  },
  sad: {
    mouthFrownLeft: 1,
    mouthFrownRight: 1,
    mouthShrugLower: 0.78,
    browInnerUp: 0.45,
    eyeSquintLeft: 0.72,
    eyeSquintRight: 0.75,
    eyeLookDownLeft: 0.5,
    eyeLookDownRight: 0.5,
    jawForward: 1,
  },
  surprised: {
    eyeWideLeft: 0.5,
    eyeWideRight: 0.5,
    jawOpen: 0.35,
    mouthFunnel: 1,
    browInnerUp: 1,
  },
  angry: {
    browDownLeft: 1,
    browDownRight: 1,
    eyeSquintLeft: 1,
    eyeSquintRight: 1,
    jawForward: 1,
    jawLeft: 1,
    mouthShrugLower: 1,
    noseSneerLeft: 1,
    noseSneerRight: 0.42,
    cheekSquintLeft: 1,
    cheekSquintRight: 1,
    mouthClose: 0.23,
    mouthFunnel: 0.63,
    mouthDimpleRight: 1,
  },
};

// Rhubarb phoneme → viseme
const corresponding = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};

export function Avatar(props) {
  const { nodes, materials, scene } = useGLTF("/models/64f1a714fe61576b46f27ca2.glb");
  const { animations }              = useGLTF("/models/animations.glb");

  const group                        = useRef();
  const { actions, mixer }           = useAnimations(animations, group);
  const { message, onMessagePlayed } = useChat();

  const [animation, setAnimation]           = useState("Idle");
  const [facialExpression, setFacialExpression] = useState("default");
  const [lipsync, setLipsync]               = useState(null);
  const [blink, setBlink]                   = useState(false);

  // Keep a stable ref to the currently-playing Audio so onended never goes stale
  const audioRef           = useRef(null);
  const onMessagePlayedRef = useRef(onMessagePlayed);
  useEffect(() => { onMessagePlayedRef.current = onMessagePlayed; }, [onMessagePlayed]);

  // ── React to incoming message ────────────────────────────────────────────
  useEffect(() => {
    // Stop any currently playing audio first
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (!message) {
      setAnimation("Idle");
      setFacialExpression("default");
      setLipsync(null);
      return;
    }

    setAnimation(message.animation      || "Talking_1");
    setFacialExpression(message.facialExpression || "default");
    setLipsync(message.lipsync          || null);

    if (message.audio) {
      const a = new Audio("data:audio/mp3;base64," + message.audio);
      audioRef.current = a;

      // onended uses ref so it always calls the latest version
      a.onended = () => onMessagePlayedRef.current();

      // play() returns a Promise — catch the autoplay-blocked error gracefully
      a.play().catch((err) => {
        console.warn("Audio autoplay blocked:", err.message);
        // Advance the queue anyway after the approximate message duration
        const fallbackMs = (message.text?.length ?? 80) * 60; // ~60 ms per char
        setTimeout(() => onMessagePlayedRef.current(), Math.max(fallbackMs, 2000));
      });
    } else {
      // No audio — advance after a reading-time estimate
      const delay = Math.max((message.text?.length ?? 80) * 60, 2000);
      const t = setTimeout(() => onMessagePlayedRef.current(), delay);
      return () => clearTimeout(t);
    }
  }, [message]);

  // ── Crossfade animations ─────────────────────────────────────────────────
  useEffect(() => {
    if (!actions[animation]) return;
    actions[animation]
      .reset()
      .fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5)
      .play();
    return () => { actions[animation]?.fadeOut(0.5); };
  }, [animation]);

  // ── Morph-target lerp helper ─────────────────────────────────────────────
  const lerpMorphTarget = (target, value, speed = 0.1) => {
    scene.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const idx = child.morphTargetDictionary[target];
        if (idx === undefined) return;
        child.morphTargetInfluences[idx] = THREE.MathUtils.lerp(
          child.morphTargetInfluences[idx],
          value,
          speed
        );
      }
    });
  };

  // ── Per-frame: expressions + lipsync ────────────────────────────────────
  useFrame(() => {
    // Expression morph targets
    if (nodes.EyeLeft?.morphTargetDictionary) {
      Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
        if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") return;
        const mapping = facialExpressions[facialExpression] ?? {};
        lerpMorphTarget(key, mapping[key] ?? 0, 0.1);
      });
    }

    // Blink
    lerpMorphTarget("eyeBlinkLeft",  blink ? 1 : 0, 0.5);
    lerpMorphTarget("eyeBlinkRight", blink ? 1 : 0, 0.5);

    // Lip sync — driven by the ref so it always reads the live audio position
    const applied = [];
    const audio   = audioRef.current;
    if (message && lipsync && audio) {
      const t = audio.currentTime;
      for (const cue of lipsync.mouthCues ?? []) {
        if (t >= cue.start && t <= cue.end) {
          const v = corresponding[cue.value];
          if (v) { applied.push(v); lerpMorphTarget(v, 1, 0.2); }
          break;
        }
      }
    }
    Object.values(corresponding).forEach((v) => {
      if (!applied.includes(v)) lerpMorphTarget(v, 0, 0.1);
    });
  });

  // ── Random blink ─────────────────────────────────────────────────────────
  useEffect(() => {
    let t;
    const next = () => {
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => { setBlink(false); next(); }, 200);
      }, THREE.MathUtils.randInt(1500, 5000));
    };
    next();
    return () => clearTimeout(t);
  }, []);

  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh geometry={nodes.Wolf3D_Body.geometry}           material={materials.Wolf3D_Body}       skeleton={nodes.Wolf3D_Body.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Bottom.geometry}  material={materials.Wolf3D_Outfit_Bottom} skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Footwear.geometry} material={materials.Wolf3D_Outfit_Footwear} skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Top.geometry}     material={materials.Wolf3D_Outfit_Top}  skeleton={nodes.Wolf3D_Outfit_Top.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Hair.geometry}           material={materials.Wolf3D_Hair}        skeleton={nodes.Wolf3D_Hair.skeleton} />
      <skinnedMesh name="EyeLeft"    geometry={nodes.EyeLeft.geometry}    material={materials.Wolf3D_Eye}   skeleton={nodes.EyeLeft.skeleton}    morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}    morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences} />
      <skinnedMesh name="EyeRight"   geometry={nodes.EyeRight.geometry}   material={materials.Wolf3D_Eye}   skeleton={nodes.EyeRight.skeleton}   morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}   morphTargetInfluences={nodes.EyeRight.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Head" geometry={nodes.Wolf3D_Head.geometry} material={materials.Wolf3D_Skin} skeleton={nodes.Wolf3D_Head.skeleton} morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Teeth" geometry={nodes.Wolf3D_Teeth.geometry} material={materials.Wolf3D_Teeth} skeleton={nodes.Wolf3D_Teeth.skeleton} morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences} />
    </group>
  );
}

useGLTF.preload("/models/64f1a714fe61576b46f27ca2.glb");
useGLTF.preload("/models/animations.glb");
