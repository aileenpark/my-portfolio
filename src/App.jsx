import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Works from "./components/Works.jsx";
import LiquidEther from "./components/LiquidEther.jsx";
import GlassCube from "./components/GlassCube.jsx";
import WebglFallback from "./components/WebglFallback.jsx";

export default function App() {
  const [webglFallback, setWebglFallback] = useState(false);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 1280;
  });
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }

    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth < 1280);
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    let gl = null;
    try {
      gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch (e) { }

    if (!gl) setWebglFallback(true);

    window.handleWebGLFallback = () => setWebglFallback(true);
    return () => {
      delete window.handleWebGLFallback;
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        background: "#ffffff",
      }}
    >
      <Header />
      <Hero />
      <Works />

      {/* WebGL layer — fixed so it stays behind the Hero as background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          visibility: webglFallback ? "hidden" : "visible",
          opacity: webglFallback ? 0 : 1,
          pointerEvents: "none",
          width: "100vw",
          height: "100vh",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "0",
            zIndex: 0,
            pointerEvents: "all",
          }}
        >
          <LiquidEther
            colors={["#a855f7", "#ec4899", "#f9a8d4"]}
            mouseForce={isMobileOrTablet ? 15 : 22}
            cursorSize={isMobileOrTablet ? 80 : 150}
            autoDemo={true}
            autoSpeed={isMobileOrTablet ? 0.35 : 0.42}
            autoIntensity={isMobileOrTablet ? 2.0 : 2.5}
            autoRampDuration={1.1}
            autoResumeDelay={isMobile ? 0 : 1000}
            resolution={isMobileOrTablet ? 0.25 : 0.55}
            iterationsPoisson={isMobileOrTablet ? 12 : 32}
            iterationsViscous={isMobileOrTablet ? 12 : 32}
            BFECC={!isMobileOrTablet}
            style={{ width: "100%", height: "100%" }}
            isPaused={isHeroPaused}
          />
        </div>

        {!isMobile && <GlassCube isPaused={isHeroPaused} />}
      </div>

      {webglFallback && <WebglFallback />}
    </div>
  );
}
