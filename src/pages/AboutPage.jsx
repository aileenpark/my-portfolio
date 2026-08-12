import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "../components/Header";
import { MOTION } from "../motion";

gsap.registerPlugin(ScrollTrigger);

const C = {
  surface: "var(--color-surface)",
  surfaceInverted: "var(--color-surface-inverted)",
  text: "var(--color-text)",
  textMuted: "var(--color-text-muted)",
  textSubtle: "var(--color-text-subtle)",
  textInverse: "var(--color-text-inverse)",
  purple500: "#646CFF",
};

const F = {
  base: "var(--font-family-base)",
  display: "var(--font-family-display)",
  label: "var(--font-family-label)",
  greeting: "'Helvetica Neue', var(--font-family-base)",
};

const ASSETS = {
  background: "/about/images/background.webp",
  teamSync: "/about/images/team-sync.webp",
  atWork: "/about/images/at-work.webp",
  singapore: "/about/images/singapore-gp.webp",
  osaka: "/about/images/osaka.webp",
  footerLogo: "/about/footer-logo.svg",
  instagram: "/about/instagram.svg",
  linkedin: "/about/linkedin.svg",
  mail: "/about/mail.svg",
};

const KEYWORDS = [
  "CS major",
  "3 yrs in Product Planning",
  "Figma + Code",
  "Korea",
];

const GREETING_TEXT = "Hi, I’m Nayun.";
const GREETING_FONT_TIMEOUT = 2000;
const GREETING_PIXEL_SIZE = {
  start: 20,
  end: 2.5,
};
const DRAWLINE_MEDIA_QUERY =
  "(min-width: 1281px) and (any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)";
const DRAWLINE_PALETTE = ["#a855f7", "#ec4899", "#f9a8d4"];
const DRAWLINE_BLOCK_SIZE = 8;
const DRAWLINE_BRUSH_RADIUS = 16;
const DRAWLINE_HOLD_MS = 600;
const DRAWLINE_FADE_MS = 500;
const DRAWLINE_INTERPOLATION_STEP = 4;

const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/nayuningg/",
  linkedin: "https://www.linkedin.com/in/nayuningg",
  email: "mailto:nypark115@gmail.com",
};

function useScrollable() {
  useLayoutEffect(() => {
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);
}

function useAboutSectionReveal(containerRef) {
  useLayoutEffect(() => {
    const container = containerRef.current;

    if (
      !container ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray("[data-about-section]");

      sections.forEach((section) => {
        const content = section.querySelector("[data-about-section-content]");
        const items = [section.firstElementChild, ...content.children];

        gsap.fromTo(
          items,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ...MOTION.base,
            stagger: 0.06,
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              once: true,
            },
          },
        );
      });
    }, container);

    return () => ctx.revert();
  }, [containerRef]);
}

function useViewport() {
  const [width, setWidth] = useState(() =>
    typeof window === "undefined" ? 1440 : window.innerWidth,
  );

  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return {
    isMobile: width <= 768,
    isTablet: width > 768 && width <= 1280,
    isDesktop: width > 1280,
  };
}

function CanvasSlot({ name, canvasRef, opacity, zIndex }) {
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
        opacity,
        zIndex,
      }}
    />
  );
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;

    try {
      return window.matchMedia(query).matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    let mediaQuery;
    const handleChange = () => setMatches(mediaQuery?.matches ?? false);

    try {
      mediaQuery = window.matchMedia(query);
      handleChange();
      mediaQuery.addEventListener("change", handleChange);
    } catch {
      const failureTimer = window.setTimeout(() => setMatches(false), 0);
      return () => window.clearTimeout(failureTimer);
    }

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

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

function GreetingsMosaicReveal({ titleRef }) {
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
    const mosaic = { pixelSize: GREETING_PIXEL_SIZE.start };
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

      const style = window.getComputedStyle(title);
      const width = rect.width;
      const height = rect.height;
      const dpr = Math.max(1, window.devicePixelRatio || 1);

      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      sourceCanvas.width = canvas.width;
      sourceCanvas.height = canvas.height;

      sourceContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      sourceContext.clearRect(0, 0, width, height);
      sourceContext.font = getFontSpec(style);
      sourceContext.fillStyle = style.color;
      sourceContext.textAlign = "left";
      sourceContext.textBaseline = "alphabetic";

      if ("fontKerning" in sourceContext) {
        sourceContext.fontKerning = style.fontKerning;
      }
      if ("letterSpacing" in sourceContext) {
        sourceContext.letterSpacing = style.letterSpacing;
      }
      if ("textRendering" in sourceContext) {
        sourceContext.textRendering = style.textRendering;
      }

      const metrics = sourceContext.measureText(GREETING_TEXT);
      const ascent =
        metrics.fontBoundingBoxAscent || metrics.actualBoundingBoxAscent;
      const descent =
        metrics.fontBoundingBoxDescent || metrics.actualBoundingBoxDescent;
      const baseline =
        ascent + descent > 0
          ? (height - ascent - descent) / 2 + ascent
          : height / 2;

      sourceContext.fillText(GREETING_TEXT, 0, baseline);

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

      const style = window.getComputedStyle(title);
      const fontSpec = getFontSpec(style);
      const fontLoaded = await Promise.race([
        document.fonts
          .load(fontSpec, GREETING_TEXT)
          .then(() => true)
          .catch(() => false),
        new Promise((resolve) => {
          fontTimer = window.setTimeout(
            () => resolve(false),
            GREETING_FONT_TIMEOUT,
          );
        }),
      ]);

      window.clearTimeout(fontTimer);

      if (
        !isActive ||
        !fontLoaded ||
        reducedMotion.matches ||
        !document.fonts.check(fontSpec, GREETING_TEXT)
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
            pixelSize: GREETING_PIXEL_SIZE.end,
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
    <CanvasSlot
      name="greetings-reveal"
      canvasRef={canvasRef}
      opacity={0}
    />
  );
}

function CursorMosaicDrawline({ name }) {
  const canvasRef = useRef(null);
  const isEnabled = useMediaQuery(DRAWLINE_MEDIA_QUERY);
  const [hasFailed, setHasFailed] = useState(false);

  useLayoutEffect(() => {
    if (!isEnabled || hasFailed) return undefined;

    const canvas = canvasRef.current;
    const frame = canvas?.closest("[data-image-hook]");

    if (!frame || !canvas || !("IntersectionObserver" in window)) {
      setHasFailed(true);
      return undefined;
    }

    let context;
    let intersectionObserver;
    let resizeObserver;
    let animationFrame = 0;
    let resizeFrame = 0;
    let wakeTimer = 0;
    let isVisible = false;
    let previousPoint = null;
    let colorIndex = 0;
    let canvasWidth = 0;
    let canvasHeight = 0;
    const blocks = new Map();

    const stopScheduledWork = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      window.clearTimeout(wakeTimer);
      wakeTimer = 0;
    };

    const syncCanvas = () => {
      const rect = frame.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return false;

      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvasWidth = rect.width;
      canvasHeight = rect.height;
      canvas.width = Math.max(1, Math.round(canvasWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvasHeight * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.imageSmoothingEnabled = false;
      blocks.clear();
      previousPoint = null;
      stopScheduledWork();
      return true;
    };

    const drawFrame = (now) => {
      animationFrame = 0;
      if (!isVisible) return;

      context.clearRect(0, 0, canvasWidth, canvasHeight);
      let isFading = false;
      let nextFadeAt = Number.POSITIVE_INFINITY;

      blocks.forEach((block, key) => {
        const age = now - block.createdAt;
        if (age >= DRAWLINE_HOLD_MS + DRAWLINE_FADE_MS) {
          blocks.delete(key);
          return;
        }

        const opacity =
          age <= DRAWLINE_HOLD_MS
            ? 1
            : 1 - (age - DRAWLINE_HOLD_MS) / DRAWLINE_FADE_MS;

        if (opacity < 1) {
          isFading = true;
        } else {
          nextFadeAt = Math.min(
            nextFadeAt,
            block.createdAt + DRAWLINE_HOLD_MS,
          );
        }

        context.globalAlpha = Math.max(0, opacity);
        context.fillStyle = block.color;
        context.fillRect(
          block.column * DRAWLINE_BLOCK_SIZE,
          block.row * DRAWLINE_BLOCK_SIZE,
          DRAWLINE_BLOCK_SIZE,
          DRAWLINE_BLOCK_SIZE,
        );
      });

      context.globalAlpha = 1;

      if (isFading) {
        animationFrame = requestAnimationFrame(drawFrame);
      } else if (blocks.size > 0 && Number.isFinite(nextFadeAt)) {
        wakeTimer = window.setTimeout(
          () => {
            wakeTimer = 0;
            animationFrame = requestAnimationFrame(drawFrame);
          },
          Math.max(0, nextFadeAt - performance.now()),
        );
      }
    };

    const requestDraw = () => {
      if (!isVisible) return;
      window.clearTimeout(wakeTimer);
      wakeTimer = 0;
      if (!animationFrame) animationFrame = requestAnimationFrame(drawFrame);
    };

    const stampBlocks = (x, y, createdAt) => {
      const minColumn = Math.floor(
        (x - DRAWLINE_BRUSH_RADIUS) / DRAWLINE_BLOCK_SIZE,
      );
      const maxColumn = Math.floor(
        (x + DRAWLINE_BRUSH_RADIUS) / DRAWLINE_BLOCK_SIZE,
      );
      const minRow = Math.floor(
        (y - DRAWLINE_BRUSH_RADIUS) / DRAWLINE_BLOCK_SIZE,
      );
      const maxRow = Math.floor(
        (y + DRAWLINE_BRUSH_RADIUS) / DRAWLINE_BLOCK_SIZE,
      );

      for (let row = minRow; row <= maxRow; row += 1) {
        for (let column = minColumn; column <= maxColumn; column += 1) {
          const blockX = column * DRAWLINE_BLOCK_SIZE;
          const blockY = row * DRAWLINE_BLOCK_SIZE;
          const centerX = blockX + DRAWLINE_BLOCK_SIZE / 2;
          const centerY = blockY + DRAWLINE_BLOCK_SIZE / 2;

          if (
            blockX >= canvasWidth ||
            blockY >= canvasHeight ||
            blockX + DRAWLINE_BLOCK_SIZE <= 0 ||
            blockY + DRAWLINE_BLOCK_SIZE <= 0 ||
            Math.hypot(centerX - x, centerY - y) > DRAWLINE_BRUSH_RADIUS
          ) {
            continue;
          }

          const key = `${column}:${row}`;
          blocks.set(key, {
            column,
            row,
            color: DRAWLINE_PALETTE[colorIndex % DRAWLINE_PALETTE.length],
            createdAt,
          });
          colorIndex += 1;
        }
      }
    };

    const handlePointerMove = (event) => {
      if (event.pointerType && event.pointerType !== "mouse") {
        return;
      }

      isVisible = true;

      const rect = frame.getBoundingClientRect();
      const currentPoint = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      if (
        currentPoint.x < 0 ||
        currentPoint.x > rect.width ||
        currentPoint.y < 0 ||
        currentPoint.y > rect.height
      ) {
        previousPoint = null;
        return;
      }

      const createdAt = performance.now();
      if (!previousPoint) {
        stampBlocks(currentPoint.x, currentPoint.y, createdAt);
      } else {
        const distance = Math.hypot(
          currentPoint.x - previousPoint.x,
          currentPoint.y - previousPoint.y,
        );
        const steps = Math.max(
          1,
          Math.ceil(distance / DRAWLINE_INTERPOLATION_STEP),
        );

        for (let step = 1; step <= steps; step += 1) {
          const progress = step / steps;
          stampBlocks(
            previousPoint.x + (currentPoint.x - previousPoint.x) * progress,
            previousPoint.y + (currentPoint.y - previousPoint.y) * progress,
            createdAt,
          );
        }
      }

      previousPoint = currentPoint;
      requestDraw();
    };

    const handlePointerLeave = () => {
      previousPoint = null;
    };

    const handleResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        if (!syncCanvas()) setHasFailed(true);
      });
    };

    try {
      context = canvas.getContext("2d");
      if (!context || !syncCanvas()) throw new Error("Canvas unavailable");

      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
          previousPoint = null;

          if (isVisible) {
            requestDraw();
          } else {
            stopScheduledWork();
          }
        },
        { threshold: 0.01 },
      );
      intersectionObserver.observe(frame);

      if ("ResizeObserver" in window) {
        resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(frame);
      }

      frame.addEventListener("pointermove", handlePointerMove);
      frame.addEventListener("pointerleave", handlePointerLeave);
      frame.addEventListener("pointercancel", handlePointerLeave);
      window.addEventListener("resize", handleResize);
    } catch {
      stopScheduledWork();
      intersectionObserver?.disconnect();
      resizeObserver?.disconnect();
      setHasFailed(true);
    }

    return () => {
      stopScheduledWork();
      cancelAnimationFrame(resizeFrame);
      frame.removeEventListener("pointermove", handlePointerMove);
      frame.removeEventListener("pointerleave", handlePointerLeave);
      frame.removeEventListener("pointercancel", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      blocks.clear();
    };
  }, [hasFailed, isEnabled]);

  useEffect(() => {
    if (!isEnabled) setHasFailed(false);
  }, [isEnabled]);

  if (!isEnabled || hasFailed) return null;

  return <CanvasSlot name={name} canvasRef={canvasRef} zIndex={1} />;
}

function ImageFrame({
  src,
  slot,
  aspectRatio,
  frameHeight,
  objectPosition = "center",
}) {
  return (
    <div
      data-image-hook={slot}
      style={{
        position: "relative",
        width: "100%",
        height: frameHeight,
        aspectRatio: frameHeight ? undefined : aspectRatio,
        overflow: "hidden",
        background: C.surface,
      }}
    >
      <img
        src={src}
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition,
          display: "block",
        }}
      />
      <CursorMosaicDrawline name={`${slot}-drawline`} />
    </div>
  );
}

function ImageCard({
  src,
  caption,
  slot,
  aspectRatio,
  frameHeight,
  objectPosition,
  flex = 1,
}) {
  return (
    <figure
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
        flex,
        minWidth: 0,
        margin: 0,
      }}
    >
      <ImageFrame
        src={src}
        slot={slot}
        aspectRatio={aspectRatio}
        frameHeight={frameHeight}
        objectPosition={objectPosition}
      />
      <figcaption
        style={{
          margin: 0,
          fontFamily: F.base,
          fontSize: "var(--font-size-caption-md)",
          fontStyle: "italic",
          fontWeight: 400,
          lineHeight: 1.55,
          color: C.textSubtle,
          textAlign: "right",
        }}
      >
        {caption}
      </figcaption>
    </figure>
  );
}

function SectionLabel({ children, isMobile }) {
  return (
    <h2
      style={{
        width: isMobile ? "100%" : "160px",
        margin: 0,
        fontFamily: F.label,
        fontSize: isMobile
          ? "var(--font-size-title-sm)"
          : "var(--font-size-title-md)",
        fontWeight: 700,
        lineHeight: 1.3,
        letterSpacing: isMobile ? "0.72px" : "0.8px",
        textTransform: "uppercase",
        color: C.purple500,
      }}
    >
      {children}
    </h2>
  );
}

function BodyCopy({ children, isMobile }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: isMobile ? "none" : "700px",
        fontFamily: F.base,
        fontSize: isMobile
          ? "var(--font-size-body-sm)"
          : "var(--font-size-body-md)",
        fontWeight: 400,
        lineHeight: isMobile ? 1.5 : 1.55,
        color: C.text,
      }}
    >
      {children}
    </div>
  );
}

function FigmaLines({ lines }) {
  return lines.map((line, index) => (
    <Fragment key={`${index}-${line}`}>
      {line}
      {index < lines.length - 1 && <br />}
    </Fragment>
  ));
}

function AboutSection({ label, children, isMobile }) {
  return (
    <section
      data-about-section={label.toLowerCase().replaceAll(" ", "-")}
      style={{
        display: "grid",
        gridTemplateColumns: isMobile
          ? "minmax(0, 1fr)"
          : "160px minmax(0, 800px)",
        gap: isMobile ? "var(--space-6)" : "40px",
        alignItems: "start",
        width: "100%",
      }}
    >
      <SectionLabel isMobile={isMobile}>{label}</SectionLabel>
      <div
        data-about-section-content
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-8)",
          width: "100%",
          minWidth: 0,
        }}
      >
        {children}
      </div>
    </section>
  );
}

function SocialChip({ icon, children, href }) {
  const commonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "6px var(--space-4)",
    border: `1px solid ${C.textInverse}`,
    borderRadius: "var(--radius-md)",
    color: C.textInverse,
    fontFamily: F.label,
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: 1,
    letterSpacing: "0.12px",
    textTransform: "uppercase",
    textDecoration: "none",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
  };

  const content = (
    <>
      <img
        src={icon}
        alt=""
        style={{ width: "20px", height: "20px", display: "block" }}
      />
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} style={commonStyle}>
        {content}
      </a>
    );
  }

  return <span style={commonStyle}>{content}</span>;
}

function Footer({ isMobile }) {
  return (
    <footer
      style={{
        marginTop: isMobile ? "var(--space-12)" : "var(--space-32)",
        background: C.surfaceInverted,
        color: C.textInverse,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "var(--content-max)",
          minHeight: isMobile ? "auto" : "300px",
          margin: "0 auto",
          padding: isMobile
            ? "var(--space-8) var(--space-4)"
            : "var(--space-12) var(--space-6)",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: isMobile ? "34px" : "var(--space-12)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: F.display,
            fontSize: isMobile ? "var(--font-size-title-lg)" : "48px",
            fontWeight: 600,
            lineHeight: 1.4,
            color: C.textInverse,
          }}
        >
          Got something messy?
          <br />
          I’m into it.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: isMobile ? "flex-start" : "flex-end",
            gap: isMobile ? "var(--space-4)" : "var(--space-8)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <img
              src={ASSETS.footerLogo}
              alt=""
              style={{
                width: isMobile ? "18px" : "20px",
                height: isMobile ? "18px" : "20px",
              }}
            />
            <span
              style={{
                fontFamily: F.base,
                fontSize: isMobile
                  ? "var(--font-size-title-md)"
                  : "var(--font-size-title-lg)",
                fontWeight: 500,
                lineHeight: 1.4,
                color: C.textInverse,
              }}
            >
              Nayun Park
            </span>
          </div>

          <div
            aria-label="Social links"
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: isMobile ? "flex-start" : "flex-end",
              gap: "var(--space-3)",
            }}
          >
            <SocialChip icon={ASSETS.instagram} href={SOCIAL_LINKS.instagram}>
              Instagram
            </SocialChip>
            <SocialChip icon={ASSETS.linkedin} href={SOCIAL_LINKS.linkedin}>
              LinkedIn
            </SocialChip>
            <SocialChip icon={ASSETS.mail} href={SOCIAL_LINKS.email}>
              e-mail
            </SocialChip>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function AboutPage() {
  const pageRef = useRef(null);
  const greetingTitleRef = useRef(null);

  useScrollable();
  useAboutSectionReveal(pageRef);
  const { isMobile, isTablet, isDesktop } = useViewport();
  const pairAspect = isMobile ? "4 / 3" : undefined;
  const desktopPairHeight = isDesktop ? "390px" : undefined;

  return (
    <div
      ref={pageRef}
      style={{ minHeight: "100vh", background: C.surface, color: C.text }}
    >
      <Header />

      <main
        style={{
          width: "100%",
          maxWidth: "var(--content-max)",
          margin: "0 auto",
          padding: `${isMobile ? "92px" : "176px"} ${isMobile ? "var(--space-4)" : "var(--space-6)"} 0`,
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: "100%", maxWidth: "1000px" }}>
          <div
            data-greetings-hook
            style={{
              position: "relative",
              display: "inline-block",
              maxWidth: "100%",
            }}
          >
            <h1
              ref={greetingTitleRef}
              style={{
                margin: 0,
                fontFamily: F.greeting,
                fontSize: isMobile ? "40px" : "56px",
                fontWeight: 700,
                lineHeight: isMobile ? 1.1 : 1.2,
                letterSpacing: isMobile ? "-0.048px" : "-0.0672px",
                color: C.text,
                whiteSpace: "nowrap",
              }}
            >
              {GREETING_TEXT}
            </h1>
            <GreetingsMosaicReveal titleRef={greetingTitleRef} />
          </div>

          <p
            style={{
              margin: `${isMobile ? "var(--space-3)" : "var(--space-4)"} 0 0`,
              fontFamily: F.base,
              fontSize: isMobile
                ? "var(--font-size-body-sm)"
                : "var(--font-size-body-lg)",
              fontWeight: 500,
              lineHeight: 1.5,
              color: C.textMuted,
            }}
          >
            A product designer who ships what she designs.
          </p>

          <div
            aria-label="Profile keywords"
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "6px",
              marginTop: isMobile ? "var(--space-3)" : "var(--space-6)",
            }}
          >
            {KEYWORDS.map((keyword) => (
              <span
                key={keyword}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "32px",
                  padding: "5px var(--space-4)",
                  border: `1px solid ${C.textSubtle}`,
                  borderRadius: "var(--radius-md)",
                  boxSizing: "border-box",
                  fontFamily: F.base,
                  fontSize: isMobile
                    ? "var(--font-size-caption-md)"
                    : "var(--font-size-body-sm)",
                  fontWeight: 500,
                  lineHeight: isMobile ? 1.4 : 1.5,
                  color: C.textSubtle,
                  whiteSpace: "nowrap",
                }}
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? "52px" : "var(--space-20)",
            width: "100%",
            maxWidth: "1000px",
            marginTop: isMobile ? "68px" : "var(--space-20)",
          }}
        >
          <AboutSection label="Background" isMobile={isMobile}>
            <BodyCopy isMobile={isMobile}>
              <p style={{ margin: 0 }}>
                <FigmaLines
                  lines={
                    isMobile
                      ? [
                          "I took the long way here. At 12, I taught myself Photoshop",
                          "to make my own fonts and banners. Then I studied",
                          "computer science and worked in product planning.",
                          "Ten years later, I came back to design: where I started.",
                        ]
                      : [
                          "I took the long way here. At 12, I taught myself Photoshop",
                          "to make my own fonts and banners. Then I studied computer science",
                          "and worked in product planning. Ten years later, I came back to design:",
                          "where I started.",
                        ]
                  }
                />
              </p>
            </BodyCopy>
            <ImageCard
              src={ASSETS.background}
              caption="Working in Figma"
              slot="background"
              aspectRatio="16 / 9"
              objectPosition="center 38%"
            />
          </AboutSection>

          <AboutSection label="How I Work" isMobile={isMobile}>
            <div
              style={{
                display: "flex",
                gap: "var(--space-4)",
                alignItems: "flex-start",
              }}
            >
              <ImageCard
                src={ASSETS.teamSync}
                caption="Team sync"
                slot="team-sync"
                aspectRatio={pairAspect || "4 / 3"}
                frameHeight={desktopPairHeight}
                flex={isMobile || isTablet ? 1 : 1.78}
              />
              <ImageCard
                src={ASSETS.atWork}
                caption={
                  isMobile ? (
                    <>
                      Just another day
                      <br />
                      at work
                    </>
                  ) : (
                    "Just another day at work"
                  )
                }
                slot="at-work"
                aspectRatio={pairAspect || "3 / 4"}
                frameHeight={desktopPairHeight}
                objectPosition="center 24%"
                flex={1}
              />
            </div>
            <BodyCopy isMobile={isMobile}>
              <p style={{ margin: "0 0 14px" }}>
                <FigmaLines
                  lines={
                    isMobile
                      ? [
                          "I notice small frictions fast. A flaky form,",
                          "a missing back button, a screen that feels one pixel off.",
                          "It stays in my head. I turn that into smoother flows,",
                          "better structure, and details that feel right.",
                        ]
                      : [
                          "I notice small frictions fast. A flaky form, a missing back button,",
                          "a screen that feels one pixel off. It stays in my head.",
                          "I turn that into smoother flows, better structure, and details that feel right.",
                        ]
                  }
                />
              </p>
              <p style={{ margin: 0 }}>
                <FigmaLines
                  lines={
                    isMobile
                      ? [
                          "I like making things people can see, touch, and use.",
                          "I pick up new tools early, but I only keep the ones",
                          "that pass one test:",
                          "does it help me think faster, build better,",
                          "or ship what I designed?",
                        ]
                      : [
                          "I like making things people can see, touch, and use.",
                          "I pick up new tools early, but I only keep the ones that pass one test:",
                          "does it help me think faster, build better, or ship what I designed?",
                        ]
                  }
                />
              </p>
            </BodyCopy>
          </AboutSection>

          <AboutSection label="Off the Clock" isMobile={isMobile}>
            <div
              style={{
                display: "flex",
                gap: "var(--space-4)",
                alignItems: "flex-start",
              }}
            >
              <ImageCard
                src={ASSETS.singapore}
                caption="Lando wins in Singapore"
                slot="singapore-gp"
                aspectRatio={pairAspect || "3 / 4"}
                frameHeight={desktopPairHeight}
                objectPosition="center 38%"
                flex={isMobile || isTablet ? 1 : 1}
              />
              <ImageCard
                src={ASSETS.osaka}
                caption="Osaka moment"
                slot="osaka"
                aspectRatio={pairAspect || "4 / 3"}
                frameHeight={desktopPairHeight}
                objectPosition="center"
                flex={isMobile || isTablet ? 1 : 1.86}
              />
            </div>
            <BodyCopy isMobile={isMobile}>
              <p style={{ margin: "0 0 14px" }}>
                <FigmaLines
                  lines={
                    isMobile
                      ? [
                          "When something grabs me, I move fast. I book the flight, host the event, design the merch.",
                          "There’s almost no gap between liking something",
                          "and doing something about it.",
                          "Sports tend to stick with me the longest.",
                          "I’ve followed McLaren in F1 since 2023,",
                          "because they keep surprising me every season,",
                          "for better or worse.",
                        ]
                      : [
                          "When something grabs me, I move fast. I book the flight, host the event,",
                          "design the merch. There’s almost no gap between liking something",
                          "and doing something about it. Sports tend to stick with me the longest.",
                          "I’ve followed McLaren in F1 since 2023, because they keep surprising me",
                          "every season, for better or worse.",
                        ]
                  }
                />
              </p>
              <p style={{ margin: 0 }}>
                <FigmaLines
                  lines={
                    isMobile
                      ? [
                          "The eye that can’t ignore a messy interface is the same one that sorts my bag into little pouches.",
                          "That instinct shows up as UX at work",
                          "and as a neatly organized bag at home.",
                        ]
                      : [
                          "The eye that can’t ignore a messy interface is the same one that sorts",
                          "my bag into little pouches. That instinct shows up as UX",
                          "at work and as a neatly organized bag at home.",
                        ]
                  }
                />
              </p>
            </BodyCopy>
          </AboutSection>
        </div>
      </main>

      <Footer isMobile={isMobile} />
    </div>
  );
}
