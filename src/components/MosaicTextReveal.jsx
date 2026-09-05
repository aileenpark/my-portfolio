import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MOTION } from "../motion";

const FONT_TIMEOUT = 2000;
const PIXEL_SIZE = {
  start: 20,
  end: 2.5,
};

function getFontSpec(style) {
  if (style.font) return style.font;

  return [
    style.fontStyle,
    style.fontVariant,
    style.fontWeight,
    style.fontStretch,
    style.fontSize,
    style.fontFamily,
  ]
    .filter(Boolean)
    .join(" ");
}

function getTextRuns(title) {
  const markedRuns = Array.from(
    title.querySelectorAll("[data-mosaic-text]"),
  )
    .filter((element) => element.getClientRects().length > 0)
    .map((element) => ({
      element,
      text: element.textContent ?? "",
    }))
    .filter(({ text }) => text.length > 0);

  if (markedRuns.length > 0) return markedRuns;

  return [{ element: title, text: title.textContent ?? "" }];
}

function applyTextRendering(context, style) {
  context.font = getFontSpec(style);
  context.fillStyle = style.color;
  context.textAlign = "left";
  context.textBaseline = "alphabetic";

  if ("fontKerning" in context) {
    context.fontKerning = style.fontKerning;
  }
  if ("letterSpacing" in context) {
    context.letterSpacing = style.letterSpacing;
  }
  if ("textRendering" in context) {
    context.textRendering = style.textRendering;
  }
}

export default function MosaicTextReveal({ titleRef, name = "text-reveal" }) {
  const canvasRef = useRef(null);
  const [isMounted, setIsMounted] = useState(() =>
    typeof window === "undefined"
      ? false
      : !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useLayoutEffect(() => {
    if (!isMounted) return undefined;

    const title = titleRef.current;
    const canvas = canvasRef.current;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (!title || !canvas || reducedMotion.matches) {
      const unmountFrame = requestAnimationFrame(() => setIsMounted(false));
      return () => cancelAnimationFrame(unmountFrame);
    }

    let isActive = true;
    let fontTimer;
    let resizeFrame;
    let resizeObserver;
    let sourceCanvas;
    let pixelCanvas;
    let drawMosaic;
    const mosaic = { pixelSize: PIXEL_SIZE.start };
    const ctx = gsap.context(() => {}, title.parentElement);

    const finishWithoutReveal = () => {
      if (!isActive) return;
      isActive = false;
      gsap.set(title, { opacity: 1 });
      gsap.set(canvas, { opacity: 0 });
      setIsMounted(false);
    };

    const syncCanvas = () => {
      const context = canvas.getContext("2d");
      const sourceContext = sourceCanvas?.getContext("2d");
      const pixelContext = pixelCanvas?.getContext("2d");
      const rect = title.getBoundingClientRect();

      if (
        !context ||
        !sourceContext ||
        !pixelContext ||
        rect.width <= 0 ||
        rect.height <= 0
      ) {
        return false;
      }

      const width = rect.width;
      const height = rect.height;
      const dpr = Math.max(1, window.devicePixelRatio || 1);

      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      sourceCanvas.width = canvas.width;
      sourceCanvas.height = canvas.height;

      sourceContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      sourceContext.clearRect(0, 0, width, height);

      getTextRuns(title).forEach(({ element, text }) => {
        const runRect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        applyTextRendering(sourceContext, style);

        const metrics = sourceContext.measureText(text);
        const ascent =
          metrics.fontBoundingBoxAscent || metrics.actualBoundingBoxAscent;
        const descent =
          metrics.fontBoundingBoxDescent || metrics.actualBoundingBoxDescent;
        const baseline =
          ascent + descent > 0
            ? runRect.top - rect.top +
              (runRect.height - ascent - descent) / 2 +
              ascent
            : runRect.top - rect.top + runRect.height / 2;

        sourceContext.fillText(text, runRect.left - rect.left, baseline);
      });

      drawMosaic = () => {
        const sampleWidth = Math.max(
          1,
          Math.ceil(width / mosaic.pixelSize),
        );
        const sampleHeight = Math.max(
          1,
          Math.ceil(height / mosaic.pixelSize),
        );

        pixelCanvas.width = sampleWidth;
        pixelCanvas.height = sampleHeight;
        pixelContext.imageSmoothingEnabled = true;
        pixelContext.clearRect(0, 0, sampleWidth, sampleHeight);
        pixelContext.drawImage(
          sourceCanvas,
          0,
          0,
          sourceCanvas.width,
          sourceCanvas.height,
          0,
          0,
          sampleWidth,
          sampleHeight,
        );

        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.imageSmoothingEnabled = false;
        context.drawImage(
          pixelCanvas,
          0,
          0,
          sampleWidth,
          sampleHeight,
          0,
          0,
          canvas.width,
          canvas.height,
        );
      };

      drawMosaic();
      return true;
    };

    const handleResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        if (!sourceCanvas || !pixelCanvas) return;
        if (isActive && !syncCanvas()) finishWithoutReveal();
      });
    };

    const handleReducedMotion = (event) => {
      if (event.matches) finishWithoutReveal();
    };

    const startReveal = async () => {
      if (!document.fonts?.load || !document.fonts?.check) {
        finishWithoutReveal();
        return;
      }

      const requirements = getTextRuns(title).map(({ element, text }) => ({
        fontSpec: getFontSpec(window.getComputedStyle(element)),
        text,
      }));
      const fontsLoaded = await Promise.race([
        Promise.all(
          requirements.map(({ fontSpec, text }) =>
            document.fonts.load(fontSpec, text),
          ),
        )
          .then(() => true)
          .catch(() => false),
        new Promise((resolve) => {
          fontTimer = window.setTimeout(() => resolve(false), FONT_TIMEOUT);
        }),
      ]);

      window.clearTimeout(fontTimer);

      if (
        !isActive ||
        !fontsLoaded ||
        reducedMotion.matches ||
        requirements.some(
          ({ fontSpec, text }) => !document.fonts.check(fontSpec, text),
        )
      ) {
        finishWithoutReveal();
        return;
      }

      sourceCanvas = document.createElement("canvas");
      pixelCanvas = document.createElement("canvas");

      if (!syncCanvas()) {
        finishWithoutReveal();
        return;
      }

      ctx.add(() => {
        gsap.set(title, { opacity: 0 });
        gsap.set(canvas, { opacity: 1 });

        gsap
          .timeline({
            onComplete: () => {
              if (isActive) setIsMounted(false);
            },
          })
          .to(mosaic, {
            pixelSize: PIXEL_SIZE.end,
            ...MOTION.slow,
            onUpdate: () => {
              try {
                drawMosaic?.();
              } catch {
                finishWithoutReveal();
              }
            },
          })
          .to(title, { opacity: 1, ...MOTION.base })
          .to(canvas, { opacity: 0, ...MOTION.base }, "<");
      });
    };

    window.addEventListener("resize", handleResize);
    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(title);
    }
    reducedMotion.addEventListener("change", handleReducedMotion);
    startReveal().catch(finishWithoutReveal);

    return () => {
      isActive = false;
      window.clearTimeout(fontTimer);
      cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
      reducedMotion.removeEventListener("change", handleReducedMotion);
      ctx.revert();
    };
  }, [isMounted, titleRef]);

  if (!isMounted) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-canvas-slot={name}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
        opacity: 0,
      }}
    />
  );
}
