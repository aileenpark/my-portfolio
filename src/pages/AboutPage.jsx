import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "../components/Header";
import MosaicTextReveal from "../components/MosaicTextReveal";
import { MOTION } from "../motion";
import "./AboutPage.css";

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

const ASSETS = {
  background: "/about/images/background.webp",
  teamSync: "/about/images/team-sync.webp",
  atWork: "/about/images/at-work.webp",
  singapore: "/about/images/singapore-gp.webp",
  osaka: "/about/images/osaka.webp",
};

const KEYWORDS = [
  "CS major",
  "3 yrs in Product Managing",
  "Seoul, Korea",
];

const COPY = {
  background: {
    desktop: [
      "I took the long way here. At 12, I taught myself Photoshop",
      "to make my own fonts and banners. Then I studied computer science and worked in product planning. Ten years later,",
      "I came back to design: where I started.",
    ],
    tablet: [
      "I took the long way here. At 12, I taught myself Photoshop to make my own fonts and banners. Then I studied computer science and worked in product planning. Ten years later, I came back to design: where I started.",
    ],
    mobile: [
      "I took the long way here. At 12, I taught myself Photoshop to make my own fonts and banners. Then I studied computer science and worked in product planning. Ten years later, I came back to design: where I started.",
    ],
  },
  howPrimary: {
    desktop: [
      "I notice small frictions fast. A flaky form, a missing back button,",
      "a screen that feels one pixel off. It stays in my head.",
      "I turn that into smoother flows, better structure,",
      "and details that feel right.",
    ],
    tablet: [
      "I notice small frictions fast. A flaky form, a missing back button, a screen that feels one pixel off. It stays in my head. I turn that into smoother flows, better structure,",
      "and details that feel right.",
    ],
    mobile: [
      "I notice small frictions fast. A flaky form, a missing back button, a screen that feels one pixel off.",
      "It stays in my head. I turn that into smoother flows,",
      "better structure, and details that feel right.",
    ],
  },
  howSecondary: {
    desktop: [
      "I like making things people can see, touch, and use. I pick up new tools early, but I only keep the ones that pass one test:",
      "does it help me think faster, build better, or ship what I designed?",
    ],
    tablet: [
      "I like making things people can see, touch, and use. I pick up new tools early,",
      "but I only keep the ones that pass one test:",
      "does it help me think faster, build better, or ship what I designed?",
    ],
    mobile: [
      "I like making things people can see, touch, and use.",
      "I pick up new tools early, but I only keep the ones",
      "that pass one test:",
      "does it help me think faster, build better,",
      "or ship what I designed?",
    ],
  },
  offPrimary: {
    desktop: [
      "When something grabs me, I move fast. I book the flight, host the event, design the merch. There’s almost no gap between liking something and doing something about it.",
      "Sports tend to stick with me the longest. I’ve followed McLaren in F1 since 2023, because they keep surprising me every season,",
      "for better or worse.",
    ],
    tablet: [
      "When something grabs me, I move fast. I book the flight, host the event,",
      "design the merch. There’s almost no gap between liking something and doing something about it.",
      "Sports tend to stick with me the longest. I’ve followed McLaren in F1 since 2023, because they keep surprising me every season, for better or worse.",
    ],
    mobile: [
      "When something grabs me, I move fast. I book the flight, host the event, design the merch.",
      "There’s almost no gap between liking something",
      "and doing something about it.",
      "Sports tend to stick with me the longest.",
      "I’ve followed McLaren in F1 since 2023,",
      "because they keep surprising me every season,",
      "for better or worse.",
    ],
  },
  offSecondary: {
    desktop: [
      "The eye that can’t ignore a messy interface is the same one that sorts my bag into little pouches. That instinct shows up as UX",
      "at work and as a neatly organized bag at home.",
    ],
    tablet: [
      "The eye that can’t ignore a messy interface is the same one",
      "that sorts my bag into little pouches. That instinct shows up as UX at work",
      "and as a neatly organized bag at home.",
    ],
    mobile: [
      "The eye that can’t ignore a messy interface is the same one that sorts my bag into little pouches.",
      "That instinct shows up as UX at work",
      "and as a neatly organized bag at home.",
    ],
  },
};

const GREETING_TEXT = "Hi, I’m Nayun.";
const DRAWLINE_MEDIA_QUERY =
  "(min-width: 1281px) and (any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)";
const DRAWLINE_PALETTE = ["#a855f7", "#ec4899", "#f9a8d4"];
const DRAWLINE_BLOCK_SIZE = 8;
const DRAWLINE_BRUSH_RADIUS = 16;
const DRAWLINE_HOLD_MS = 600;
const DRAWLINE_FADE_MS = 500;
const DRAWLINE_INTERPOLATION_STEP = 4;
const DRAWLINE_HINT_DISMISS_MS = 200;

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

function DrawlineHintBadge({ isDismissed }) {
  const badgeRef = useRef(null);
  const isEnabled = useMediaQuery(DRAWLINE_MEDIA_QUERY);
  const [isMounted, setIsMounted] = useState(() => !isDismissed);

  useLayoutEffect(() => {
    const badge = badgeRef.current;
    if (!badge || !isEnabled || !isMounted || isDismissed) return undefined;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ repeat: -1, repeatDelay: 1.8 })
        .to(badge, { y: -6, duration: 0.18, ease: "power2.out" })
        .to(badge, { y: 0, duration: 0.16, ease: "power2.in" })
        .to(badge, { y: -3, duration: 0.12, ease: "power2.out" })
        .to(badge, { y: 0, duration: 0.14, ease: "power2.in" });
    }, badge);

    return () => ctx.revert();
  }, [isDismissed, isEnabled, isMounted]);

  useEffect(() => {
    if (!isEnabled || !isDismissed || !isMounted) return undefined;

    const dismissTimer = window.setTimeout(
      () => setIsMounted(false),
      DRAWLINE_HINT_DISMISS_MS,
    );

    return () => window.clearTimeout(dismissTimer);
  }, [isDismissed, isEnabled, isMounted]);

  if (!isEnabled || !isMounted) return null;

  return (
    <div
      ref={badgeRef}
      data-drawline-hint
      style={{
        position: "absolute",
        top: "var(--space-4)",
        right: "var(--space-4)",
        zIndex: 2,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "220px",
        height: "32px",
        padding: "6px 10px",
        boxSizing: "border-box",
        borderRadius: "var(--radius-sm)",
        background: C.surfaceInverted,
        color: C.textInverse,
        fontFamily: "var(--font-family-label)",
        fontSize: "var(--font-size-caption-md)",
        fontWeight: 500,
        lineHeight: 1.4,
        letterSpacing: "0.07px",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        opacity: isDismissed ? 0 : 1,
        transition: "opacity var(--motion-fast)",
      }}
    >
      MOVE YOUR CURSOR TO DRAW
    </div>
  );
}

function CursorMosaicDrawline({ name, onDrawStart }) {
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
    let hasStartedDrawing = false;
    const blocks = new Map();
    const previousCursor = frame.style.cursor;

    const restoreCursor = () => {
      frame.style.cursor = previousCursor;
    };

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
      if (!hasStartedDrawing) {
        hasStartedDrawing = true;
        onDrawStart?.();
      }

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
      frame.style.cursor = "crosshair";
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
      restoreCursor();
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
      restoreCursor();
    };
  }, [hasFailed, isEnabled, onDrawStart]);

  useEffect(() => {
    if (!isEnabled) setHasFailed(false);
  }, [isEnabled]);

  if (!isEnabled || hasFailed) return null;

  return <CanvasSlot name={name} canvasRef={canvasRef} zIndex={1} />;
}

function ImageFrame({
  src,
  slot,
  showDrawHint = false,
  isDrawHintDismissed = false,
  onDrawStart,
}) {
  return (
    <div
      data-image-hook={slot}
      className={`about-image-frame about-image-frame--${slot}`}
    >
      <img src={src} alt="" />
      <CursorMosaicDrawline
        name={`${slot}-drawline`}
        onDrawStart={onDrawStart}
      />
      {showDrawHint ? (
        <DrawlineHintBadge isDismissed={isDrawHintDismissed} />
      ) : null}
    </div>
  );
}

function ImageCard({
  src,
  caption,
  mobileCaption,
  slot,
  showDrawHint,
  isDrawHintDismissed,
  onDrawStart,
}) {
  return (
    <figure className={`about-image-card about-image-card--${slot}`}>
      <ImageFrame
        src={src}
        slot={slot}
        showDrawHint={showDrawHint}
        isDrawHintDismissed={isDrawHintDismissed}
        onDrawStart={onDrawStart}
      />
      <figcaption className="about-image-caption">
        <span className={mobileCaption ? "about-caption-desktop" : undefined}>
          {caption}
        </span>
        {mobileCaption ? (
          <span className="about-caption-mobile">{mobileCaption}</span>
        ) : null}
      </figcaption>
    </figure>
  );
}

function SectionLabel({ children }) {
  return <h2 className="about-section__label">{children}</h2>;
}

function BodyCopy({ children }) {
  return <div className="about-body-copy">{children}</div>;
}

function FigmaLines({ lines }) {
  return lines.map((line, index) => (
    <Fragment key={`${index}-${line}`}>
      {line}
      {index < lines.length - 1 && <br />}
    </Fragment>
  ));
}

function ResponsiveFigmaLines({ desktop, tablet, mobile }) {
  return (
    <>
      <span className="about-copy-lines about-copy-lines--desktop">
        <FigmaLines lines={desktop} />
      </span>
      <span className="about-copy-lines about-copy-lines--tablet">
        <FigmaLines lines={tablet} />
      </span>
      <span className="about-copy-lines about-copy-lines--mobile">
        <FigmaLines lines={mobile} />
      </span>
    </>
  );
}

function AboutSection({ label, children }) {
  return (
    <section
      data-about-section={label.toLowerCase().replaceAll(" ", "-")}
      className="about-section"
    >
      <SectionLabel>{label}</SectionLabel>
      <div data-about-section-content className="about-section__content">
        {children}
      </div>
    </section>
  );
}

export default function AboutPage() {
  const pageRef = useRef(null);
  const greetingTitleRef = useRef(null);
  const [isDrawHintDismissed, setIsDrawHintDismissed] = useState(false);

  useScrollable();
  useAboutSectionReveal(pageRef);
  const handleDrawStart = useCallback(() => {
    setIsDrawHintDismissed(true);
  }, []);

  return (
    <div
      ref={pageRef}
      className="about-page"
      style={{ "--about-accent": C.purple500 }}
    >
      <Header />

      <main className="about-main">
        <div className="about-intro">
          <div data-greetings-hook className="about-greeting">
            <h1
              ref={greetingTitleRef}
              className="about-greeting__title"
            >
              {GREETING_TEXT}
            </h1>
            <MosaicTextReveal
              name="greetings-reveal"
              titleRef={greetingTitleRef}
            />
          </div>

          <p className="about-intro__subtitle">
            A product designer who ships what she designs.
          </p>

          <div aria-label="Profile keywords" className="about-keywords">
            {KEYWORDS.map((keyword) => (
              <span key={keyword} className="about-keyword">
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="about-sections">
          <AboutSection label="Background">
            <BodyCopy>
              <p>
                <ResponsiveFigmaLines {...COPY.background} />
              </p>
            </BodyCopy>
            <ImageCard
              src={ASSETS.background}
              caption="Working in Figma"
              slot="background"
              showDrawHint
              isDrawHintDismissed={isDrawHintDismissed}
              onDrawStart={handleDrawStart}
            />
          </AboutSection>

          <AboutSection label="How I Work">
            <BodyCopy>
              <p>
                <ResponsiveFigmaLines {...COPY.howPrimary} />
              </p>
              <p>
                <ResponsiveFigmaLines {...COPY.howSecondary} />
              </p>
            </BodyCopy>
            <div className="about-image-pair about-image-pair--how">
              <ImageCard
                src={ASSETS.teamSync}
                caption="Team sync"
                slot="team-sync"
                onDrawStart={handleDrawStart}
              />
              <ImageCard
                src={ASSETS.atWork}
                caption="Just another day at work"
                mobileCaption={
                  <>
                    Just another day
                    <br />
                    at work
                  </>
                }
                slot="at-work"
                onDrawStart={handleDrawStart}
              />
            </div>
          </AboutSection>

          <AboutSection label="Off the Clock">
            <BodyCopy>
              <p>
                <ResponsiveFigmaLines {...COPY.offPrimary} />
              </p>
              <p>
                <ResponsiveFigmaLines {...COPY.offSecondary} />
              </p>
            </BodyCopy>
            <div className="about-image-pair about-image-pair--off">
              <ImageCard
                src={ASSETS.singapore}
                caption="Lando wins in Singapore"
                mobileCaption={
                  <>
                    Lando wins
                    <br />
                    in Singapore
                  </>
                }
                slot="singapore-gp"
                onDrawStart={handleDrawStart}
              />
              <ImageCard
                src={ASSETS.osaka}
                caption="Osaka moment"
                slot="osaka"
                onDrawStart={handleDrawStart}
              />
            </div>
          </AboutSection>
        </div>
      </main>
    </div>
  );
}
