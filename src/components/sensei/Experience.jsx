import {
  CameraControls,
  ContactShadows,
  Environment,
  Text,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { useChat } from "../../hooks/useChat";
import { Avatar } from "./Avatar";

// Animated loading dots displayed above the avatar while waiting for a response
const LoadingDots = (props) => {
  const { loading } = useChat();
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!loading) {
      setDots("");
      return;
    }
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 500);
    return () => clearInterval(interval);
  }, [loading]);

  if (!loading) return null;

  return (
    <group {...props}>
      <Text fontSize={0.15} anchorX="left" anchorY="bottom" color="#5724ff">
        {dots}
        <meshBasicMaterial attach="material" color="#5724ff" />
      </Text>
    </group>
  );
};

export const Experience = () => {
  const camRef = useRef();
  const { cameraZoomed } = useChat();

  // Initial camera position
  useEffect(() => {
    camRef.current?.setLookAt(0, 2, 5, 0, 1.5, 0);
  }, []);

  // Zoom in/out when user toggles
  useEffect(() => {
    if (cameraZoomed) {
      camRef.current?.setLookAt(0, 1.5, 1.5, 0, 1.5, 0, true);
    } else {
      camRef.current?.setLookAt(0, 2.2, 5, 0, 1.0, 0, true);
    }
  }, [cameraZoomed]);

  return (
    <>
      <CameraControls ref={camRef} />
      <Environment preset="sunset" />

      <Suspense fallback={null}>
        <LoadingDots position-y={1.75} position-x={-0.02} />
      </Suspense>

      <Avatar />
      <ContactShadows opacity={0.6} />
    </>
  );
};
