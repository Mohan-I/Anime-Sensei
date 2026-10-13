import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Suspense, useEffect } from "react";
import { Experience } from "../components/sensei/Experience";
import { SenseiChatUI } from "../components/sensei/SenseiChatUI";
import { ChatProvider, useChat } from "../hooks/useChat";

// Inner component so we can access the ChatProvider context
const SenseiScene = () => {
  const { greet } = useChat();

  // Fire the greeting once on mount
  useEffect(() => {
    greet();
  }, []);

  return (
    <>
      {/* Three.js loader progress bar */}
      <Loader
        containerStyles={{ background: "rgba(0,0,0,0.85)" }}
        innerStyles={{ background: "#5724ff" }}
        barStyles={{ background: "#edff66" }}
        dataStyles={{ color: "#edff66", fontFamily: "General Sans, sans-serif" }}
        dataInterpolation={(p) => `Loading Sensei… ${p.toFixed(0)}%`}
      />

      {/* Suppress leva debug panel in production */}
      <Leva hidden />

      {/* Overlaid chat UI (HTML, pointer-events managed inside) */}
      <SenseiChatUI />

      {/* Three.js canvas — fills the full page */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 1], fov: 30 }}
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
      >
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>
    </>
  );
};

const SenseiPage = () => (
  /* Isolate from the global layout: hide the global Navbar/Footer
     by giving this page its own stacking context that covers the viewport */
  <div
    className="fixed inset-0 z-40"
    style={{
      background:
        "linear-gradient(135deg, #0f0c29 0%, #1a0533 50%, #24243e 100%)",
    }}
  >
    <ChatProvider>
      <SenseiScene />
    </ChatProvider>

    {/* Subtle top gradient to hide the global Navbar behind it */}
    <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#0f0c29] to-transparent z-10" />

    {/* Back button */}
    <a
      href="/"
      className="pointer-events-auto absolute mt-28 top-5 sm:top-20 left-5 z-50 flex items-center gap-2
                 text-white/60 hover:text-white text-xs font-general uppercase tracking-widest
                 transition-colors duration-200"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </a>
  </div>
);

export default SenseiPage;
