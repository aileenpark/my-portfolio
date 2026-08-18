import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "../components/Header";
import { MOTION } from "../motion";

gsap.registerPlugin(ScrollTrigger);

const C = {
  surfaceDefault: "#FFFFFF",
  surfaceSection: "#FAFAFA",
  surfaceSubtle: "#F4F4F4",
  surfaceDark: "#121212",
  textPrimary: "#121212",
  textSecondary: "#444444",
  textMuted: "#777777",
  textInverse: "#FFFFFF",
  textDisabled: "#DADADA",
  borderDefault: "#E5E5E5",
  accentBackground: "#EEF0FF",
  accent: "#4F55E4",
  purple500: "#646CFF",
};

const F = {
  base: "'Inter', sans-serif",
  display: "'Merriweather', serif",
  label: "'Space Grotesk', sans-serif",
};

const ASSETS = {
  heroMain: "/aimix-renewal/hero-main.mp4",
  heroSub1: "/aimix-renewal/hero-sub-1.webp",
  heroSub2: "/aimix-renewal/hero-sub-2.webp",
  problemFlow: "/aimix-renewal/problem-flow.webp",
  userFlow: "/aimix-renewal/user-flow.webp",
  informationArchitecture: "/aimix-renewal/information-architecture.webp",
  recordingBefore: "/aimix-renewal/recording-before.mp4",
  recordingAfter: "/aimix-renewal/recording-after.mp4",
  effectBefore: "/aimix-renewal/effect-before.webp",
  effectAfter: "/aimix-renewal/effect-after.webp",
  mixingBefore: "/aimix-renewal/mixing-before.webp",
  mixingAfter: "/aimix-renewal/mixing-after.webp",
  impactGraph: "/aimix-renewal/impact-graph.webp",
};

const META_ITEMS = [
  {
    label: "ROLE",
    lines: ["UX Design", "IA", "User Flow", "Wireframing"],
  },
  { label: "TIMELINE", lines: ["5 months"] },
  {
    label: "TEAM",
    lines: ["Nayun Park (PD)", "1 PM", "3 Developers", "1 Visual Designer"],
    emphasizedLine: "Nayun Park (PD)",
  },
  { label: "TOOLS", lines: ["Figma", "Google Analytics"] },
];

const SIDE_NAV_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "strategy", label: "Strategy" },
  { id: "key-solutions", label: "Key Solutions" },
  { id: "impact", label: "Impact" },
  { id: "reflection", label: "Reflection" },
];

const SIDE_NAV_IDS = SIDE_NAV_ITEMS.map((item) => item.id);

const STRATEGY_COLUMNS = [
  {
    label: "Lower Entry Friction",
    problem: ["Changing songs broke", "the recording flow."],
    direction: ["Keep song selection", "in context."],
    rationale: ["Common actions should stay", "inside the recording flow."],
  },
  {
    label: "Reduce Result Uncertainty",
    problem: ["Users could not preview", "effects before recording."],
    direction: ["Preview effects", "before recording."],
    rationale: ["Preview reduces uncertainty", "before users start."],
  },
  {
    label: "Restore User Control",
    problem: ["AI mixing returned", "only one final result."],
    direction: ["Give users multiple AI mixing options."],
    rationale: ["Mixing is taste-based,", "so users need simple control."],
  },
];

const IMPACT_ITEMS = [
  {
    title: "Content upload rate increased by 39%",
    bullets: [
      "More users completed the flow from the recording screen to final upload.",
      "This showed that the main issue was not entry, but completion before upload.",
    ],
  },
  {
    title: "The upload flow required fewer screens and less depth",
    bullets: [
      "Song change, effect preview, and AI mixing selection all happened inside the recording flow, reducing fatigue from screen transitions.",
      "Users could complete the same goal in a lighter flow while keeping the core actions.",
    ],
  },
  {
    title: "The same flow became simpler to design and build",
    bullets: [
      "Reducing separated steps made the structure easier to maintain.",
      "Fewer transitions also meant fewer edge cases across web app and native recording screens.",
      "The redesign improved both user flow and production efficiency.",
    ],
  },
];

const SCROLL_OFFSET = 120;

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

function useSectionReveal(containerRef) {
  useLayoutEffect(() => {
    const container = containerRef.current;

    if (
      !container ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray("[data-aimix-section]");

      sections.forEach((section) => {
        const content = section.querySelector("[data-aimix-section-content]");
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
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = width <= 768;
  const isTablet = width > 768 && width <= 1280;
  const hPad = isMobile
    ? "24px"
    : isTablet
      ? "60px"
      : "max(60px, calc((100vw - 1330px) / 2))";

  return { isMobile, isTablet, hPad };
}

function usePrefersReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setReduceMotion(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return reduceMotion;
}

function useScrollSpy(ids) {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return undefined;

    const updateActiveSection = () => {
      const probe = SCROLL_OFFSET + 1;
      let current = sections[0].id;

      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= probe) current = section.id;
      });

      setActiveId(current);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [ids]);

  return activeId;
}

function scrollToSection(id) {
  const section = document.getElementById(id);
  if (!section) return;

  const top =
    section.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
}

function SectionLabel({ children }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        alignItems: "stretch",
        alignSelf: "flex-start",
      }}
    >
      <span
        aria-hidden="true"
        style={{ width: "6px", background: C.textSecondary, flexShrink: 0 }}
      />
      <p
        style={{
          margin: 0,
          color: C.textSecondary,
          fontFamily: F.label,
          fontSize: "20px",
          fontWeight: 700,
          lineHeight: 1.3,
          letterSpacing: "0.8px",
          textTransform: "uppercase",
        }}
      >
        {children}
      </p>
    </div>
  );
}

function ProjectSection({ id, label, title, children, isMobile }) {
  return (
    <section
      id={id}
      data-aimix-section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        scrollMarginTop: `${SCROLL_OFFSET}px`,
      }}
    >
      <SectionLabel>{label}</SectionLabel>
      <div
        data-aimix-section-content
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <h2
          style={{
            margin: 0,
            color: C.textPrimary,
            fontFamily: F.display,
            fontSize: isMobile ? "24px" : "32px",
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

function BodyParagraph({ children, style }) {
  return (
    <p
      style={{
        margin: 0,
        color: C.textPrimary,
        fontFamily: F.base,
        fontSize: "18px",
        fontWeight: 400,
        lineHeight: 1.55,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

function NumberedInsight({ number, title, bullets }) {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "24px",
          height: "24px",
          marginTop: "2px",
          borderRadius: "6px",
          background: C.accent,
          color: C.textInverse,
          fontFamily: F.base,
          fontSize: "14px",
          fontWeight: 600,
          lineHeight: 1.2,
          flexShrink: 0,
        }}
      >
        {number}
      </span>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          minWidth: 0,
        }}
      >
        <h3
          style={{
            margin: 0,
            color: C.textPrimary,
            fontFamily: F.base,
            fontSize: "20px",
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          {title}
        </h3>
        <ul
          style={{
            margin: 0,
            paddingLeft: "27px",
            color: C.textPrimary,
            fontFamily: F.base,
            fontSize: "18px",
            fontWeight: 400,
            lineHeight: 1.55,
          }}
        >
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MediaFigure({ src, caption, alt, isMobile }) {
  return (
    <figure
      style={{
        margin: 0,
        display: "flex",
        flex: 1,
        minWidth: 0,
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "8px",
      }}
    >
      <div
        style={{
          width: "100%",
          height: isMobile ? "220px" : "280px",
          border: `1px solid ${C.borderDefault}`,
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
      <figcaption
        style={{
          color: C.textMuted,
          fontFamily: F.base,
          fontSize: "14px",
          fontStyle: "italic",
          fontWeight: 400,
          lineHeight: 1.55,
        }}
      >
        {caption}
      </figcaption>
    </figure>
  );
}

function FigmaLines({ lines }) {
  return lines.map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 && <br aria-hidden="true" />}
    </span>
  ));
}

function LoopingVideo({ src, label, reduceMotion, style }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reduceMotion) {
      video.pause();
      video.currentTime = 0;
      return;
    }

    video.play().catch(() => {});
  }, [reduceMotion]);

  return (
    <video
      ref={videoRef}
      src={src}
      aria-label={label}
      autoPlay={!reduceMotion}
      loop
      muted
      playsInline
      preload="metadata"
      style={style}
    />
  );
}

function HeroShowcase({ reduceMotion }) {
  const radius = "clamp(4px, 0.78125vw, 15px)";
  const mediaStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  return (
    <section
      aria-label="CoverCut renewed recording and AI mixing screens"
      style={{
        width: "100%",
        aspectRatio: "16 / 9",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "69.270833%",
          height: "97.037037%",
          display: "grid",
          gridTemplateColumns: "652fr 648fr",
          columnGap: "2.255639%",
          minWidth: 0,
        }}
      >
        <div
          style={{
            minWidth: 0,
            overflow: "hidden",
            borderRadius: `${radius} ${radius} 0 0`,
            background: C.surfaceDark,
          }}
        >
          <LoopingVideo
            src={ASSETS.heroMain}
            label="CoverCut AI-assisted recording flow"
            reduceMotion={reduceMotion}
            style={mediaStyle}
          />
        </div>
        <div
          style={{
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: "2.671756%",
          }}
        >
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
              borderRadius: radius,
              background: C.surfaceDark,
            }}
          >
            <img
              src={ASSETS.heroSub1}
              alt="CoverCut recording screen on a phone mockup"
              style={mediaStyle}
            />
          </div>
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
              borderRadius: `${radius} ${radius} 0 0`,
            }}
          >
            <img
              src={ASSETS.heroSub2}
              alt="CoverCut content library screen on a phone mockup"
              style={mediaStyle}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SolutionAsset({ src, alt, reduceMotion }) {
  const style = { width: "100%", height: "auto", display: "block" };

  if (src.endsWith(".mp4")) {
    return (
      <LoopingVideo
        src={src}
        label={alt}
        reduceMotion={reduceMotion}
        style={style}
      />
    );
  }

  return <img src={src} alt={alt} style={style} />;
}

function ImpactDiagram({ isMobile }) {
  const graph = (
    <div
      style={{
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "8px",
        gridColumn: isMobile ? undefined : "1 / 3",
        gridRow: isMobile ? undefined : "1",
      }}
    >
      <img
        src={ASSETS.impactGraph}
        alt="Content creation index rising from 98 in July to 139 in October after renewal"
        style={{ width: "100%", height: "auto", display: "block" }}
      />
      <figcaption
        style={{
          color: C.textMuted,
          fontFamily: F.base,
          fontSize: "14px",
          fontStyle: "italic",
          fontWeight: 400,
          lineHeight: 1.55,
        }}
      >
        Content creation index
      </figcaption>
    </div>
  );

  const bubble = (
    <div
      style={{
        width: isMobile ? "min(100%, 279px)" : "100%",
        minHeight: isMobile ? undefined : "173px",
        boxSizing: "border-box",
        padding: "18px 20px",
        borderRadius: "0 16px 16px 16px",
        background: C.accent,
        color: C.textInverse,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        justifySelf: isMobile ? undefined : "stretch",
        alignSelf: isMobile ? "flex-end" : "start",
        gridColumn: isMobile ? undefined : "2 / 4",
        gridRow: isMobile ? undefined : "1",
        marginTop: isMobile ? 0 : "46px",
        zIndex: 1,
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: F.display,
          fontSize: isMobile ? "36px" : "48px",
          fontWeight: 600,
          lineHeight: 1.4,
        }}
      >
        +39%
      </p>
      <p
        style={{
          margin: 0,
          paddingBottom: "4px",
          fontFamily: F.base,
          fontSize: "18px",
          fontWeight: 500,
          lineHeight: 1.5,
        }}
      >
        Monthly content uploads
        <br aria-hidden="true" />
        MoM after renewal
      </p>
    </div>
  );

  return (
    <figure
      style={{
        width: "100%",
        maxWidth: "846px",
        margin: 0,
        padding: isMobile ? "12px 0" : "12px 4px",
        boxSizing: "border-box",
        display: isMobile ? "flex" : "grid",
        flexDirection: isMobile ? "column" : undefined,
        gridTemplateColumns: isMobile ? undefined : "minmax(0, 559px) 31px minmax(0, 248px)",
        gap: isMobile ? "16px" : 0,
      }}
    >
      {graph}
      {bubble}
    </figure>
  );
}

function StrategyMatrix({ isMobile }) {
  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {STRATEGY_COLUMNS.map((column) => (
          <article
            key={column.label}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              padding: "16px",
              border: `1px solid ${C.borderDefault}`,
              borderRadius: "8px",
            }}
          >
            <span
              style={{
                alignSelf: "flex-start",
                padding: "4px 10px",
                borderRadius: "8px",
                background: C.accentBackground,
                color: C.accent,
                fontFamily: F.base,
                fontSize: "14px",
                fontWeight: 600,
                lineHeight: 1.4,
              }}
            >
              {column.label}
            </span>
            {[
              ["Problem", column.problem, C.borderDefault, C.textPrimary],
              ["Direction", column.direction, C.accent, C.textInverse],
              ["Rationale", column.rationale, C.surfaceSection, C.textPrimary],
            ].map(([label, lines, background, color]) => (
              <div
                key={label}
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <strong
                  style={{
                    color: C.textPrimary,
                    fontFamily: F.base,
                    fontSize: "14px",
                    lineHeight: 1.4,
                  }}
                >
                  {label}
                </strong>
                <p
                  style={{
                    margin: 0,
                    padding: "12px 16px",
                    borderRadius: "8px",
                    background,
                    color,
                    fontFamily: F.base,
                    fontSize: "16px",
                    fontWeight: label === "Rationale" ? 400 : 500,
                    lineHeight: label === "Rationale" ? 1.55 : 1.5,
                  }}
                >
                  {lines.join(" ")}
                </p>
              </div>
            ))}
          </article>
        ))}
      </div>
    );
  }

  const rows = [
    {
      label: "Problem",
      key: "problem",
      background: C.borderDefault,
      color: C.textPrimary,
    },
    {
      label: "Direction",
      key: "direction",
      background: C.accent,
      color: C.textInverse,
    },
    {
      label: "Rationale",
      key: "rationale",
      background: C.surfaceSection,
      color: C.textPrimary,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "64px repeat(3, minmax(0, 1fr))",
          gap: "16px",
        }}
      >
        <span />
        {STRATEGY_COLUMNS.map((column) => (
          <span
            key={column.label}
            style={{
              padding: "4px 10px",
              borderRadius: "8px",
              background: C.accentBackground,
              color: C.accent,
              fontFamily: F.base,
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: 1.4,
              textAlign: "center",
            }}
          >
            {column.label}
          </span>
        ))}
      </div>
      {rows.map((row) => (
        <div
          key={row.label}
          style={{
            display: "grid",
            gridTemplateColumns: "64px repeat(3, minmax(0, 1fr))",
            gap: "16px",
            alignItems: "stretch",
          }}
        >
          <strong
            style={{
              paddingTop: "2px",
              color: C.textPrimary,
              fontFamily: F.base,
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            {row.label}
          </strong>
          {STRATEGY_COLUMNS.map((column) => (
            <p
              key={`${row.label}-${column.label}`}
              style={{
                margin: 0,
                padding: "12px 16px",
                borderRadius: "8px",
                background: row.background,
                color: row.color,
                fontFamily: F.base,
                fontSize: "16px",
                fontWeight: row.label === "Rationale" ? 400 : 500,
                lineHeight: row.label === "Rationale" ? 1.55 : 1.5,
              }}
            >
              <FigmaLines lines={column[row.key]} />
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

function SolutionMedia({
  before,
  after,
  title,
  bullets,
  isMobile,
  reduceMotion,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div
        style={{
          display: "flex",
          gap: isMobile ? "28px" : "64px",
          alignItems: "flex-end",
          justifyContent: "flex-start",
          padding: isMobile ? "0" : "0 16px",
        }}
      >
        <figure
          style={{
            margin: 0,
            width: isMobile ? "36%" : "149px",
            maxWidth: "149px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "8px",
            opacity: 0.7,
          }}
        >
          <SolutionAsset
            src={before}
            alt={`${title} before`}
            reduceMotion={reduceMotion}
          />
          <figcaption
            style={{
              color: C.textMuted,
              fontFamily: F.base,
              fontSize: "14px",
              fontStyle: "italic",
              lineHeight: 1.55,
            }}
          >
            Before
          </figcaption>
        </figure>
        <figure
          style={{
            margin: 0,
            width: isMobile ? "48%" : "198px",
            maxWidth: "198px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "8px",
          }}
        >
          <SolutionAsset
            src={after}
            alt={`${title} after`}
            reduceMotion={reduceMotion}
          />
          <figcaption
            style={{
              color: C.textMuted,
              fontFamily: F.base,
              fontSize: "14px",
              fontStyle: "italic",
              lineHeight: 1.55,
            }}
          >
            After
          </figcaption>
        </figure>
      </div>
      <div>
        <p
          style={{
            margin: 0,
            color: C.textPrimary,
            fontFamily: F.base,
            fontSize: "18px",
            fontWeight: 600,
            lineHeight: 1.5,
          }}
        >
          What changed?
        </p>
        <ul
          style={{
            margin: 0,
            paddingLeft: "27px",
            color: C.textPrimary,
            fontFamily: F.base,
            fontSize: "18px",
            fontWeight: 400,
            lineHeight: 1.55,
          }}
        >
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function AIMixRenewalPage() {
  const pageRef = useRef(null);

  useScrollable();
  useSectionReveal(pageRef);
  const { isMobile, isTablet, hPad } = useViewport();
  const reduceMotion = usePrefersReducedMotion();
  const activeId = useScrollSpy(SIDE_NAV_IDS);

  return (
    <div
      ref={pageRef}
      style={{ minHeight: "100vh", background: C.surfaceDefault }}
    >
      <Header />
      <main>
        <header
          style={{ padding: `${isMobile ? "132px" : "184px"} ${hPad} 0` }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "1330px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {["Shipped", "AI Music", "UX Renewal"].map((chip) => (
                <span
                  key={chip}
                  style={{
                    padding: "5px 16px",
                    borderRadius: "20px",
                    background: C.surfaceDark,
                    color: C.textInverse,
                    fontFamily: F.base,
                    fontSize: "16px",
                    fontWeight: 500,
                    lineHeight: 1.5,
                    whiteSpace: "nowrap",
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                paddingBottom: isMobile ? "40px" : "56px",
              }}
            >
              <h1
                style={{
                  margin: 0,
                  color: C.textPrimary,
                  fontFamily: F.display,
                  fontSize: isMobile ? "32px" : "48px",
                  fontWeight: 600,
                  lineHeight: 1.4,
                }}
              >
                Less Friction, More Finished Results
              </h1>
              <p
                style={{
                  margin: 0,
                  color: C.textSecondary,
                  fontFamily: F.base,
                  fontSize: isMobile ? "20px" : "28px",
                  fontWeight: 400,
                  lineHeight: 1.4,
                }}
              >
                CoverCut: AI-Powered Cover Song Recording Flow Renewal
              </p>
            </div>
          </div>
        </header>

        <HeroShowcase reduceMotion={reduceMotion} />

        <section
          style={{ padding: `60px ${hPad}` }}
          aria-label="Project information"
        >
          <div
            style={{
              width: "100%",
              maxWidth: "1330px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(2, minmax(0, 1fr))"
                : "repeat(4, minmax(0, 1fr))",
              gap: isMobile ? "32px 20px" : "36px",
            }}
          >
            {META_ITEMS.map((item) => (
              <div
                key={item.label}
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <p
                  style={{
                    margin: 0,
                    color: C.textSecondary,
                    fontFamily: F.label,
                    fontSize: "18px",
                    fontWeight: 700,
                    lineHeight: 1.4,
                    letterSpacing: "0.9px",
                  }}
                >
                  {item.label}
                </p>
                <div>
                  {item.lines.map((line) => (
                    <p
                      key={line}
                      style={{
                        margin: 0,
                        color: C.textPrimary,
                        fontFamily: F.base,
                        fontSize: "16px",
                        fontWeight: line === item.emphasizedLine ? 600 : 400,
                        lineHeight: 1.55,
                      }}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ padding: `0 ${hPad} 120px` }}>
          <div
            style={{
              width: "100%",
              maxWidth: "1330px",
              margin: "0 auto",
              display: "flex",
              gap: isTablet ? "60px" : "120px",
              alignItems: "flex-start",
            }}
          >
            {!isMobile && (
              <nav
                aria-label="Case study sections"
                style={{
                  width: "310px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  position: "sticky",
                  top: `${SCROLL_OFFSET}px`,
                  flexShrink: 0,
                }}
              >
                {SIDE_NAV_ITEMS.map(({ id, label }) => {
                  const active = id === activeId;

                  return (
                    <a
                      key={id}
                      href={`#${id}`}
                      aria-current={active ? "location" : undefined}
                      onClick={(event) => {
                        event.preventDefault();
                        scrollToSection(id);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: active ? C.textSecondary : C.textDisabled,
                        fontFamily: F.base,
                        fontSize: "18px",
                        fontWeight: active ? 600 : 500,
                        lineHeight: 1.5,
                        textDecoration: "none",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "1px",
                          background: active ? C.textSecondary : "transparent",
                          flexShrink: 0,
                        }}
                      />
                      {label}
                    </a>
                  );
                })}
              </nav>
            )}

            <div
              style={{
                width: "100%",
                maxWidth: "900px",
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: "90px",
              }}
            >
              <ProjectSection
                id="overview"
                label="Overview"
                title="Helping singers move from recording to upload"
                isMobile={isMobile}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <BodyParagraph>
                    CoverCut is an AI-powered music service for amateur singers.
                    Users can sing a cover song and the service helps with
                    mixing, mastering, and music distribution.
                  </BodyParagraph>
                  <BodyParagraph>
                    This renewal project focused on the recording-to-upload
                    flow. Although many users reached the recording screen, many
                    of them left before uploading their content.
                  </BodyParagraph>
                  <BodyParagraph>
                    I redesigned the flow to reduce unnecessary steps, make the
                    result easier to predict, and give users more control over
                    the final AI mixing result.
                  </BodyParagraph>
                  <BodyParagraph>
                    As a result, the{" "}
                    <strong>content upload rate increased by 39%</strong>, and
                    the same flow became simpler with fewer screens and less
                    depth.
                  </BodyParagraph>
                </div>
              </ProjectSection>

              <ProjectSection
                id="problem"
                label="Problem"
                title="Users got there, but did not upload"
                isMobile={isMobile}
              >
                <BodyParagraph>
                  Users reached the recording screen, but many left before
                  uploading. The issue was not access. It was the friction
                  inside the recording flow.
                </BodyParagraph>
                <div style={{ width: "100%", overflowX: "auto" }}>
                  <img
                    src={ASSETS.problemFlow}
                    alt="Flow from MR list through recording and preview to upload, showing drop-off before upload"
                    style={{
                      width: isMobile ? "700px" : "100%",
                      height: "auto",
                      display: "block",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: C.textMuted,
                      fontFamily: F.base,
                      fontSize: "16px",
                      fontWeight: 500,
                      lineHeight: 1.5,
                    }}
                  >
                    What’s the Point?
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    <NumberedInsight
                      number="1"
                      title="Song changes broke the flow"
                      bullets={[
                        "Users had to leave recording screen to change MR.",
                      ]}
                    />
                    <NumberedInsight
                      number="2"
                      title="No preview before recording"
                      bullets={[
                        "Users had to record first before experiencing diverse effects.",
                      ]}
                    />
                    <NumberedInsight
                      number="3"
                      title="No choice after AI mixing"
                      bullets={[
                        "Users received only one non-editable final result.",
                      ]}
                    />
                  </div>
                </div>
              </ProjectSection>

              <ProjectSection
                id="strategy"
                label="Strategy"
                title="Turning friction into clear design directions"
                isMobile={isMobile}
              >
                <BodyParagraph>
                  I restructured the recording flow around song choice, sound
                  preview, and final mix selection.
                </BodyParagraph>
                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: "20px",
                  }}
                >
                  <MediaFigure
                    src={ASSETS.userFlow}
                    caption="Redesigned user flow"
                    alt="Redesigned CoverCut user flow"
                    isMobile={isMobile}
                  />
                  <MediaFigure
                    src={ASSETS.informationArchitecture}
                    caption="Information architecture"
                    alt="CoverCut information architecture"
                    isMobile={isMobile}
                  />
                </div>
                <BodyParagraph>
                  These became three design directions for reducing friction
                  before upload.
                </BodyParagraph>
                <StrategyMatrix isMobile={isMobile} />
              </ProjectSection>

              <ProjectSection
                id="key-solutions"
                label="Key Solutions"
                title="Three changes that made recording feel easier"
                isMobile={isMobile}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "48px",
                    paddingTop: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: C.textSecondary,
                        fontFamily: F.base,
                        fontSize: "16px",
                        fontWeight: 500,
                        lineHeight: 1.5,
                      }}
                    >
                      Recording
                    </p>
                    <SolutionMedia
                      title="Recording"
                      before={ASSETS.recordingBefore}
                      after={ASSETS.recordingAfter}
                      isMobile={isMobile}
                      reduceMotion={reduceMotion}
                      bullets={[
                        "Song selection became part of the recording flow, not a separate step.",
                        "Users can listen to a song before choosing it.",
                      ]}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: C.textSecondary,
                        fontFamily: F.base,
                        fontSize: "16px",
                        fontWeight: 500,
                        lineHeight: 1.5,
                      }}
                    >
                      Mixing Effect Realtime Preview
                    </p>
                    <SolutionMedia
                      title="Mixing effect preview"
                      before={ASSETS.effectBefore}
                      after={ASSETS.effectAfter}
                      isMobile={isMobile}
                      reduceMotion={reduceMotion}
                      bullets={[
                        "Users can experience preset effects before they start recording.",
                        "The preview reduces uncertainty about the final sound.",
                        "The interaction feels familiar, like trying a camera filter.",
                      ]}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: C.textSecondary,
                        fontFamily: F.base,
                        fontSize: "16px",
                        fontWeight: 500,
                        lineHeight: 1.5,
                      }}
                    >
                      AI Mixing
                    </p>
                    <SolutionMedia
                      title="AI mixing"
                      before={ASSETS.mixingBefore}
                      after={ASSETS.mixingAfter}
                      isMobile={isMobile}
                      reduceMotion={reduceMotion}
                      bullets={[
                        "Users can choose from three AI-mixed versions.",
                        "Producer-style labels make each option easier to compare and understand.",
                      ]}
                    />
                  </div>
                </div>
              </ProjectSection>

              <ProjectSection
                id="impact"
                label="Impact"
                title="The new flow led to more uploads"
                isMobile={isMobile}
              >
                <p
                  style={{
                    margin: 0,
                    color: C.textSecondary,
                    fontFamily: F.base,
                    fontSize: "16px",
                    fontWeight: 500,
                    lineHeight: 1.5,
                  }}
                >
                  Content Creation Recovery After Renewal
                </p>
                <ImpactDiagram isMobile={isMobile} />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  {IMPACT_ITEMS.map((item, index) => (
                    <NumberedInsight
                      key={item.title}
                      number={String(index + 1)}
                      title={item.title}
                      bullets={item.bullets}
                    />
                  ))}
                </div>
              </ProjectSection>

              <ProjectSection
                id="reflection"
                label="Reflection"
                title="Better UX does not always mean more features"
                isMobile={isMobile}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <BodyParagraph>
                    This project taught me that users do not always leave
                    because a product lacks features. Sometimes, they leave
                    because{" "}
                    <strong>the experience feels too hard to complete.</strong>
                  </BodyParagraph>
                  <BodyParagraph>
                    In CoverCut, users were already entering the recording
                    screen. The problem was not the lack of AI technology, but{" "}
                    <strong>the friction before upload</strong>: changing songs
                    broke the flow, the sound result was hard to predict, and
                    the final AI output gave users little control.
                  </BodyParagraph>
                  <BodyParagraph>
                    I learned that improvement starts from understanding{" "}
                    <strong>what users actually need in the moment</strong>. For
                    this project, that meant keeping users in the recording
                    context, showing results earlier, and letting them choose
                    the final output.
                  </BodyParagraph>
                  <BodyParagraph>
                    It also changed how I think about AI in product design. AI
                    does not automatically make a product feel better.
                    Especially when users do not fully trust AI yet, the
                    experience needs to make the result{" "}
                    <strong>
                      understandable, predictable, and easy to control
                    </strong>
                    .
                  </BodyParagraph>
                </div>
              </ProjectSection>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
