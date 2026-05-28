import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { getDeviceTier } from "../utils/device.js";

export default function GlassCube({ isPaused = false }) {
  const mountRef = useRef(null);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    let mounted = true;

    const tier = getDeviceTier();
    const isMobile = tier === "mobile";
    const isTablet = tier === "tablet";
    const isLowEnd = isMobile || isTablet;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: isLowEnd ? "low-power" : "high-performance",
      });
    } catch (e) {
      if (window.handleWebGLFallback) window.handleWebGLFallback();
      return;
    }

    const dpr = isMobile
      ? Math.min(window.devicePixelRatio, 1.0)
      : isTablet
        ? Math.min(window.devicePixelRatio, 1.5)
        : Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.offsetWidth, container.offsetHeight, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    Object.assign(renderer.domElement.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
    });

    const onContextLost = (e) => {
      e.preventDefault();
      if (mounted) {
        cancelAnimationFrame(rafId);
        if (window.handleWebGLFallback) window.handleWebGLFallback();
      }
    };
    const onContextCreationError = () => {
      if (mounted && window.handleWebGLFallback) window.handleWebGLFallback();
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost, false);
    renderer.domElement.addEventListener("webglcontextcreationerror", onContextCreationError, false);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 5;

    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();

    // Synthetic env map (always generated)
    {
      const W = isMobile ? 64 : 256,
        H = isMobile ? 32 : 128;
      const f = new Float32Array(W * H * 4);
      const SPOTS = [
        [0.22, 0.12, 14, 12, 10, 0.06],
        [0.68, 0.28, 2, 5, 16, 0.1],
        [0.42, 0.72, 10, 2, 18, 0.09],
        [0.82, 0.56, 12, 2, 6, 0.08],
        [0.1, 0.45, 2, 12, 5, 0.08],
        [0.55, 0.18, 8, 6, 14, 0.07],
      ];
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const i = (y * W + x) * 4;
          const u = x / W, v = y / H;
          const sky = 1 - v * 0.55;
          let r = sky * 0.65, g = sky * 0.55, b = sky * 0.95;
          for (const [su, sv, sr, sg, sb, rad] of SPOTS) {
            const d = Math.sqrt((u - su) ** 2 + (v - sv) ** 2);
            const k = Math.max(0, 1 - d / rad) ** 3;
            r += sr * k; g += sg * k; b += sb * k;
          }
          f[i] = r; f[i + 1] = g; f[i + 2] = b; f[i + 3] = 1;
        }
      }
      const synth = new THREE.DataTexture(f, W, H, THREE.RGBAFormat, THREE.FloatType);
      synth.mapping = THREE.EquirectangularReflectionMapping;
      synth.colorSpace = THREE.LinearSRGBColorSpace;
      synth.needsUpdate = true;
      scene.environment = pmrem.fromEquirectangular(synth).texture;
      synth.dispose();
      if (isLowEnd) pmrem.dispose(); // skip HDR on mobile/tablet
    }

    // Only load heavy HDR on desktop
    if (!isLowEnd) {
      new RGBELoader()
        .loadAsync(
          "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr",
        )
        .then((hdrTex) => {
          if (!mounted) { hdrTex.dispose(); pmrem.dispose(); return; }
          hdrTex.mapping = THREE.EquirectangularReflectionMapping;
          const next = pmrem.fromEquirectangular(hdrTex).texture;
          const prev = scene.environment;
          scene.environment = next;
          prev?.dispose();
          hdrTex.dispose();
          pmrem.dispose();
        })
        .catch(() => { if (mounted) pmrem.dispose(); });
    }

    const cubeGeo = new RoundedBoxGeometry(2, 2, 2, isMobile ? 4 : 8, 0.22);
    const cubeMat = isLowEnd
      ? new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.3,
        envMapIntensity: 1.5,
        transparent: true,
        opacity: 0.75,
      })
      : new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 1,
        thickness: 2,
        roughness: 0.05,
        metalness: 0.1,
        ior: 1.5,
        iridescence: 1,
        iridescenceIOR: 1.3,
        iridescenceThicknessRange: [100, 700],
        clearcoat: 1,
        clearcoatRoughness: 0,
        envMapIntensity: 2,
        transparent: true,
        opacity: 0.65,
      });
    const cube = new THREE.Mesh(cubeGeo, cubeMat);
    cube.scale.set(1.21, 1.21, 1.21);
    scene.add(cube);

    const innerGeo = new THREE.OctahedronGeometry(0.52, isMobile ? 1 : 2);
    const innerMat = isLowEnd
      ? new THREE.MeshStandardMaterial({
        color: 0xddc8ff,
        roughness: 0.1,
        metalness: 0.2,
        envMapIntensity: 1.8,
        transparent: true,
        opacity: 0.7,
      })
      : new THREE.MeshPhysicalMaterial({
        color: 0xddc8ff,
        transmission: 0.9,
        thickness: 1,
        roughness: 0.06,
        metalness: 0.0,
        ior: 1.8,
        iridescence: 1,
        iridescenceIOR: 1.6,
        iridescenceThicknessRange: [200, 900],
        clearcoat: 0.8,
        clearcoatRoughness: 0,
        envMapIntensity: 2.5,
        transparent: true,
        opacity: 0.6,
      });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    inner.scale.set(1.21, 1.21, 1.21);
    scene.add(inner);

    scene.add(new THREE.AmbientLight(0xffffff, isLowEnd ? 0.8 : 0.4));

    const LIGHT_DEFS_ALL = [
      { color: 0xff2244, intensity: 25 },
      { color: 0xff8800, intensity: 18 },
      { color: 0x00ddff, intensity: 22 },
      { color: 0x9922ff, intensity: 24 },
      { color: 0xff00bb, intensity: 16 },
      { color: 0x00ff99, intensity: 14 },
    ];
    const LIGHT_DEFS = isLowEnd ? LIGHT_DEFS_ALL.slice(0, 3) : LIGHT_DEFS_ALL;
    const lights = LIGHT_DEFS.map(({ color, intensity }) => {
      const l = new THREE.PointLight(color, isLowEnd ? intensity * 0.8 : intensity, 14);
      scene.add(l);
      return l;
    });

    let mouseX = 0,
      mouseY = 0,
      prevMouseX = 0,
      prevMouseY = 0;
    let velX = 0,
      velY = 0,
      rotX = 0.18,
      rotY = 0;
    let autoBlend = 1,
      isInWindow = false;
    const SENS = 0.00024,
      FRICTION = 0.94,
      AUTO_VEL = 0.004,
      BLEND_IN = 0.012,
      BLEND_OUT = 0.05;

    const onMove = (e) => { mouseX = e.clientX; mouseY = e.clientY; isInWindow = true; };
    const onLeave = () => { isInWindow = false; };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    let t = 0, rafId;
    let frameCount = 0;
    const LIGHT_UPDATE_INTERVAL = isMobile ? 2 : 1;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (isPausedRef.current || !mounted) return;

      frameCount++;
      t += 0.011;
      const dX = mouseX - prevMouseX,
        dY = mouseY - prevMouseY;
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      velY += dX * SENS;
      velX += -dY * SENS * 0.7;
      velY = Math.max(-0.12, Math.min(0.12, velY));
      velX = Math.max(-0.08, Math.min(0.08, velX));
      velY *= FRICTION;
      velX *= FRICTION;
      if (isInWindow) autoBlend = Math.max(0, autoBlend - BLEND_OUT);
      else autoBlend = Math.min(1, autoBlend + BLEND_IN);
      rotY += velY * (1 - autoBlend) + AUTO_VEL * autoBlend;
      rotX += velX * (1 - autoBlend);
      cube.rotation.y = rotY;
      cube.rotation.x = rotX;
      inner.rotation.y = rotY * 0.7;
      inner.rotation.x = -rotX * 0.65;
      inner.rotation.z = t * 0.22;

      if (frameCount % LIGHT_UPDATE_INTERVAL === 0) {
        lights[0].position.set(Math.cos(t * 0.7) * 4.5, Math.sin(t * 0.42) * 3.0, 3.5);
        lights[1].position.set(-3.5, Math.cos(t * 0.55) * 4.2, Math.sin(t * 0.38) * 3.0);
        lights[2].position.set(Math.sin(t * 0.62) * 4.5, -2.0, Math.cos(t * 0.78) * 4.5);
        if (!isLowEnd) {
          lights[3].position.set(Math.cos(t * 0.42 + 2.0) * 4.0, Math.sin(t * 0.9) * 4.5, 2.5);
          lights[4].position.set(-2.5, Math.sin(t * 0.73 + 1.2) * 3.5, Math.cos(t * 0.48 + 1.0) * -4.0);
          lights[5].position.set(Math.sin(t * 0.3) * 3.5, -2.5, Math.cos(t * 0.6 + 2.1) * -3.5);
        }
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mounted) return;
      const screenW = window.innerWidth;
      const mob = screenW < 768;
      const tab = screenW >= 768 && screenW < 1280;
      renderer.setPixelRatio(
        mob
          ? Math.min(window.devicePixelRatio, 1.0)
          : tab
            ? Math.min(window.devicePixelRatio, 1.5)
            : Math.min(window.devicePixelRatio, 2),
      );
      renderer.setSize(616, 616, false);
      if (camera.aspect !== 1) {
        camera.aspect = 1;
        camera.updateProjectionMatrix();
      }
      let scale = 0.8;
      if (mob) scale = 0.4;
      else if (tab) scale = 0.6;
      container.style.transform = `translate(-50%, -50%) scale(${scale})`;
      cube.scale.set(1.21, 1.21, 1.21);
      inner.scale.set(1.21, 1.21, 1.21);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      mounted = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      lights.forEach((l) => { scene.remove(l); l.dispose(); });
      [cubeGeo, cubeMat, innerGeo, innerMat].forEach((o) => o.dispose());
      if (scene.environment) scene.environment.dispose();
      renderer.dispose();
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      renderer.domElement.removeEventListener("webglcontextcreationerror", onContextCreationError);
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        top: "40%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1,
        pointerEvents: "none",
        width: 616,
        height: 616,
      }}
    />
  );
}
