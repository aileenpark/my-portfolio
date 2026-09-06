import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import LiquidEther from "./components/LiquidEther.jsx";
import GlassCube from "./components/GlassCube.jsx";
import WebglFallback from "./components/WebglFallback.jsx";
import { getDeviceTier, getGlassCubeTier } from "./utils/device.js";
import "./App.css";

export default function App() {
  const [webglFallback, setWebglFallback] = useState(false);
  const [isHeroPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [deviceTier, setDeviceTier] = useState(() => {
    if (typeof window === "undefined") return "desktop";
    return getDeviceTier();
  });
  const [glassCubeTier, setGlassCubeTier] = useState(() => {
    if (typeof window === "undefined") return "desktop";
    return getGlassCubeTier();
  });
  const isMobileOrTablet = deviceTier !== "desktop";
  const isMobile = deviceTier === "mobile";

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleReducedMotionChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleReducedMotionChange);
    return () =>
      mediaQuery.removeEventListener("change", handleReducedMotionChange);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }

    const handleResize = () => {
      setDeviceTier(getDeviceTier());
      setGlassCubeTier(getGlassCubeTier());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fallbackFrame = requestAnimationFrame(() => {
      const canvas = document.createElement("canvas");
      let gl = null;

      try {
        gl =
          canvas.getContext("webgl") ||
          canvas.getContext("experimental-webgl");
      } catch {
        gl = null;
      }

      if (!gl) setWebglFallback(true);
    });

    window.handleWebGLFallback = () => setWebglFallback(true);
    return () => {
      cancelAnimationFrame(fallbackFrame);
      delete window.handleWebGLFallback;
    };
  }, []);

  return (
    <div className="home-page">
      <Header />
      <Hero>
        {/* WebGL layer — contained and clipped by the Hero section */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            visibility: webglFallback ? "hidden" : "visible",
            opacity: webglFallback ? 0 : 1,
            pointerEvents: "none",
            width: "100%",
            height: "100%",
          }}
          aria-hidden="true"
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              pointerEvents: "all",
            }}
          >
            <LiquidEther
              colors={["#a855f7", "#ec4899", "#f9a8d4"]}
              mouseForce={isMobileOrTablet ? 15 : 22}
              cursorSize={isMobileOrTablet ? 80 : 150}
              autoDemo={!prefersReducedMotion}
              autoSpeed={isMobileOrTablet ? 0.35 : 0.42}
              autoIntensity={isMobileOrTablet ? 2.0 : 2.5}
              autoRampDuration={isMobile ? 0.35 : 1.1}
              autoResumeDelay={isMobile ? 0 : 1000}
              resolution={isMobileOrTablet ? 0.25 : 0.55}
              iterationsPoisson={isMobileOrTablet ? 12 : 32}
              iterationsViscous={isMobileOrTablet ? 12 : 32}
              BFECC={!isMobileOrTablet}
              style={{ width: "100%", height: "100%" }}
              isPaused={isHeroPaused || prefersReducedMotion}
            />
          </div>

          {glassCubeTier !== "mobile" && (
            <GlassCube
              deviceTier={glassCubeTier}
              isPaused={isHeroPaused || prefersReducedMotion}
            />
          )}
        </div>

        {webglFallback && <WebglFallback />}
      </Hero>
    </div>
  );
}
