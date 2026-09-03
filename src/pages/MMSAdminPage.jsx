import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Header from "../components/Header";

const C = {
  surface: "var(--color-surface)",
  surfaceSubtle:
    "color-mix(in srgb, var(--color-surface-inverted) 2%, var(--color-surface))",
  surfaceDisabled: "var(--color-surface-disabled)",
  surfaceInverted: "var(--color-surface-inverted)",
  text: "var(--color-text)",
  textMuted: "var(--color-text-muted)",
  textSubtle: "var(--color-text-subtle)",
  textInverse: "var(--color-text-inverse)",
  border:
    "color-mix(in srgb, var(--color-surface-inverted) 10%, var(--color-surface))",
  confidentiality:
    "color-mix(in srgb, var(--color-surface-inverted) 70%, transparent)",
  accent: "var(--color-accent)",
  accentValue: "#646CFF",
  purpleSurface:
    "color-mix(in srgb, var(--color-accent) 12%, var(--color-surface))",
};

const F = {
  base: "var(--font-family-base)",
  display: "var(--font-family-display)",
  label: "var(--font-family-label)",
};

const ASSETS = {
  hero: "/mms-admin/hero.webp",
  requestFlow: "/mms-admin/request-flow.webp",
  taskInventory: "/mms-admin/task-inventory.webp",
  informationArchitecture: "/mms-admin/information-architecture.webp",
  userGrouping: "/mms-admin/user-grouping.webp",
  contentOperations: "/mms-admin/content-operations.webp",
  videoManagement: "/mms-admin/video-management.webp",
  settlementRecords: "/mms-admin/settlement-records.mp4",
  iteration: "/mms-admin/iteration.webp",
};

const META_ITEMS = [
  {
    label: "ROLE",
    lines: [
      "Product Planning",
      "IA",
      "User Flow",
      "Wireframing",
      "Require Definition",
    ],
  },
  { label: "TIMELINE", lines: ["2 weeks"] },
  {
    label: "TEAM",
    lines: ["Nayun Park (PD)", "1 PM", "1 Developer"],
    emphasizedLine: "Nayun Park (PD)",
  },
  { label: "TOOLS", lines: ["Figma", "Figjam"] },
];

const SIDE_NAV_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "strategy", label: "Strategy" },
  { id: "key-solutions", label: "Key Solutions" },
  { id: "iteration", label: "Iteration" },
  { id: "impact", label: "Impact" },
  { id: "reflection", label: "Reflection" },
];

const PAIN_POINTS = [
  {
    title: "Content",
    icon: "/mms-admin/content.svg",
    lines: [
      "MR files, lyrics, album art, and timestamps",
      "were sent to developers manually.",
    ],
    friction: "Scattered content data",
  },
  {
    title: "Operations",
    icon: "/mms-admin/operations.svg",
    lines: [
      "Notices, banners, and user video issues",
      "required developer requests.",
    ],
    friction: "No real-time control",
  },
  {
    title: "Finance",
    icon: "/mms-admin/finance.svg",
    lines: [
      "Revenue settlement and music registration requests",
      "were processed manually.",
    ],
    friction: "Manual calculation",
  },
  {
    title: "Development",
    icon: "/mms-admin/development.svg",
    lines: [
      "Repeated operation requests interrupted",
      "main product development.",
    ],
    friction: "Constant bottleneck",
  },
];

const STRATEGY_STEPS = [
  {
    number: "1",
    title: "Map repeated manual work",
    body: "I listed the tasks that were repeatedly handled through messages, emails, or developer requests.",
  },
  {
    number: "2",
    title: "Group tasks by ownership and risk",
    body: "I grouped tasks by who handled them and how much impact each action could have on the service.",
  },
  {
    number: "3",
    title: "Build IA around real workflows",
    body: "The IA was structured around how the team completed work, not around backend data tables.",
  },
];

const STRATEGY_GALLERY_ITEMS = [
  {
    id: "task-inventory",
    src: ASSETS.taskInventory,
    alt: "Task inventory spreadsheets",
    caption: "Screenshot: Task inventory spreadsheets",
  },
  {
    id: "information-architecture",
    src: ASSETS.informationArchitecture,
    alt: "Information architecture",
    caption: "Screenshot: Information architecture",
  },
  {
    id: "user-grouping",
    src: ASSETS.userGrouping,
    alt: "User grouping diagram",
    caption: "Screenshot: User grouping diagram",
  },
];

const SOLUTIONS = [
  {
    title: "Centralized Content Operations",
    need: "Scattered checks and moderation requests, status unclear",
    image: ASSETS.contentOperations,
    alt: "Content operations admin screen",
    values: [
      "List screens for quick status overview",
      "Detail screens separated for editing and final control",
      "Reduced repeated developer requests and made publishing easier to track",
    ],
  },
  {
    title: "Status-based User Video Management",
    need: "Requests via messages, files, and developer handoffs",
    image: ASSETS.videoManagement,
    alt: "User video management admin screen",
    values: [
      "Main table focused on decision-making information",
      "Detail screen provided full context before action",
      "Helped teams move from case-by-case requests to a clearer review process",
    ],
  },
  {
    title: "Centralized Settlement Records",
    need: "Files, manual checks, and repeated communication",
    image: ASSETS.settlementRecords,
    mediaType: "video",
    alt: "Settlement records admin screen",
    values: [
      "Search, filters, and views organized around how teams checked records, not database structure",
      "Created a clearer source of truth, reducing missed or inconsistent information",
    ],
  },
];

const IMPACT_ITEMS = [
  {
    lines: ["30–60 min saved", "per task"],
    body: "Repeated updates became faster because teams could handle common tasks directly.",
  },
  {
    lines: ["10 internal users", "supported"],
    body: "The system supported company-wide use across content, operations, finance, CS, and QA teams.",
  },
  {
    lines: ["5 work areas", "centralized"],
    body: "Content, operations, finance, CS, and QA tasks were organized into one admin structure.",
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
        style={{ width: "6px", background: C.textMuted, flexShrink: 0 }}
      />
      <p
        style={{
          margin: 0,
          color: C.textMuted,
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
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        scrollMarginTop: `${SCROLL_OFFSET}px`,
      }}
    >
      <SectionLabel>{label}</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <h2
          style={{
            margin: 0,
            color: C.text,
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

function BodyParagraph({ children }) {
  return (
    <p
      style={{
        margin: 0,
        color: C.text,
        fontFamily: F.base,
        fontSize: "18px",
        fontWeight: 400,
        lineHeight: 1.55,
      }}
    >
      {children}
    </p>
  );
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

function ConfidentialMedia({
  src,
  alt,
  caption,
  objectFit = "cover",
  mediaType = "image",
  reduceMotion = false,
}) {
  const mediaStyle = {
    gridArea: "1 / 1",
    width: "100%",
    height: "auto",
    objectFit,
    display: "block",
  };

  return (
    <figure
      style={{
        margin: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "8px",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "grid",
          width: "100%",
          border: `1px solid ${C.border}`,
          borderRadius: "4px",
          overflow: "hidden",
          background: C.surfaceSubtle,
        }}
      >
        {mediaType === "video" ? (
          <LoopingVideo
            src={src}
            label={alt}
            reduceMotion={reduceMotion}
            style={mediaStyle}
          />
        ) : (
          <img src={src} alt={alt} style={mediaStyle} />
        )}
        <span
          style={{
            gridArea: "1 / 1",
            alignSelf: "end",
            justifySelf: "end",
            padding: "3px 12px",
            background: C.confidentiality,
            color: C.textInverse,
            fontFamily: F.base,
            fontSize: "14px",
            fontWeight: 600,
            lineHeight: 1.4,
            textAlign: "right",
          }}
        >
          Some details have been modified for confidentiality.
        </span>
      </div>
      {caption && (
        <figcaption
          style={{
            color: C.textSubtle,
            fontFamily: F.base,
            fontSize: "14px",
            fontStyle: "italic",
            fontWeight: 400,
            lineHeight: 1.55,
            textAlign: "right",
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function PainCard({ point }) {
  return (
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "18px 14px",
        border: `1px solid ${C.border}`,
        borderRadius: "8px",
        minWidth: 0,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img src={point.icon} alt="" width="20" height="20" />
          <strong
            style={{
              color: C.accent,
              fontFamily: F.base,
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            {point.title}
          </strong>
        </div>
        <p
          style={{
            margin: 0,
            color: C.text,
            fontFamily: F.base,
            fontSize: "16px",
            lineHeight: 1.55,
          }}
        >
          {point.lines.map((line, index) => (
            <span key={line}>
              {line}
              {index < point.lines.length - 1 && <br aria-hidden="true" />}
            </span>
          ))}
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <span
          style={{
            color: C.textSubtle,
            fontFamily: F.base,
            fontSize: "14px",
            lineHeight: 1.4,
          }}
        >
          Key friction
        </span>
        <ul
          style={{
            margin: 0,
            paddingLeft: "22px",
            color: C.text,
            fontFamily: F.base,
            fontSize: "16px",
            lineHeight: 1.55,
          }}
        >
          <li>{point.friction}</li>
        </ul>
      </div>
    </article>
  );
}

function StrategyStep({ step }) {
  return (
    <article
      style={{
        display: "flex",
        flex: 1,
        minWidth: 0,
        flexDirection: "column",
        gap: "12px",
        padding: "18px 14px",
        borderRadius: "8px",
        background: C.surfaceSubtle,
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "28px",
          height: "28px",
          borderRadius: "8px",
          background: C.accent,
          color: C.textInverse,
          fontFamily: F.base,
          fontSize: "14px",
          fontWeight: 700,
        }}
      >
        {step.number}
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <h3
          style={{
            margin: 0,
            color: C.text,
            fontFamily: F.base,
            fontSize: "18px",
            fontWeight: 600,
            lineHeight: 1.5,
          }}
        >
          {step.title}
        </h3>
        <p
          style={{
            margin: 0,
            color: C.text,
            fontFamily: F.base,
            fontSize: "16px",
            lineHeight: 1.55,
          }}
        >
          {step.body}
        </p>
      </div>
    </article>
  );
}

function StrategyGallery({ isMobile }) {
  const [selectedId, setSelectedId] = useState(
    STRATEGY_GALLERY_ITEMS[0].id,
  );
  const selectedItem =
    STRATEGY_GALLERY_ITEMS.find((item) => item.id === selectedId) ??
    STRATEGY_GALLERY_ITEMS[0];

  return (
    <figure
      style={{
        margin: 0,
        display: "grid",
        gridTemplateColumns: isMobile ? "minmax(0, 1fr)" : "minmax(0, 1fr) 137px",
        gridTemplateAreas: isMobile
          ? '"main" "thumbs" "caption"'
          : '"main thumbs" "caption ."',
        gap: isMobile ? "12px" : "8px 12px",
        width: "100%",
      }}
    >
      <div
        style={{
          gridArea: "main",
          aspectRatio: "2222 / 1281",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 0,
          border: `1px solid ${C.border}`,
          borderRadius: "4px",
          overflow: "hidden",
          background: C.surface,
        }}
      >
        <img
          src={selectedItem.src}
          alt={selectedItem.alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      </div>

      <div
        aria-label="Strategy image gallery"
        style={{
          gridArea: "thumbs",
          display: "grid",
          gridTemplateColumns: isMobile
            ? "repeat(3, minmax(0, 1fr))"
            : "minmax(0, 1fr)",
          gridTemplateRows: isMobile
            ? "auto"
            : "repeat(3, minmax(0, 1fr))",
          gap: "12px",
          minWidth: 0,
          minHeight: 0,
        }}
      >
        {STRATEGY_GALLERY_ITEMS.map((item) => {
          const isSelected = item.id === selectedId;

          return (
            <button
              key={item.id}
              type="button"
              aria-label={`Show ${item.alt}`}
              aria-pressed={isSelected}
              onClick={() => setSelectedId(item.id)}
              style={{
                margin: 0,
                padding: 0,
                minWidth: 0,
                minHeight: 0,
                aspectRatio: isMobile ? "1" : "auto",
                border: `1px solid ${isSelected ? C.textMuted : C.border}`,
                borderRadius: "4px",
                overflow: "hidden",
                background: C.surface,
                cursor: "pointer",
              }}
            >
              <img
                src={item.src}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  filter: "blur(2px)",
                  transform: "scale(1.03)",
                }}
              />
            </button>
          );
        })}
      </div>

      <figcaption
        aria-live="polite"
        style={{
          gridArea: "caption",
          color: C.textSubtle,
          fontFamily: F.base,
          fontSize: "14px",
          fontStyle: "italic",
          lineHeight: 1.55,
          textAlign: "right",
        }}
      >
        {selectedItem.caption}
      </figcaption>
    </figure>
  );
}

function SolutionBlock({ solution, reduceMotion }) {
  return (
    <article
      style={{ display: "flex", flexDirection: "column", gap: "20px" }}
    >
      <h3
        style={{
          margin: 0,
          color: C.textMuted,
          fontFamily: F.base,
          fontSize: "16px",
          fontWeight: 500,
          lineHeight: 1.5,
        }}
      >
        {solution.title}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <strong
            style={{
              color: C.text,
              fontFamily: F.base,
              fontSize: "18px",
              fontWeight: 600,
              lineHeight: 1.5,
            }}
          >
            Operational Need
          </strong>
          <ul
            style={{
              margin: 0,
              paddingLeft: "27px",
              color: C.text,
              fontFamily: F.base,
              fontSize: "18px",
              lineHeight: 1.55,
            }}
          >
            <li>{solution.need}</li>
          </ul>
        </div>
        <ConfidentialMedia
          src={solution.image}
          alt={solution.alt}
          caption="Screen Evidence"
          objectFit="contain"
          mediaType={solution.mediaType}
          reduceMotion={reduceMotion}
        />
        <div>
          <strong
            style={{
              color: C.text,
              fontFamily: F.base,
              fontSize: "18px",
              fontWeight: 600,
              lineHeight: 1.5,
            }}
          >
            Design Value
          </strong>
          <ul
            style={{
              margin: 0,
              paddingLeft: "27px",
              color: C.text,
              fontFamily: F.base,
              fontSize: "18px",
              lineHeight: 1.55,
            }}
          >
            {solution.values.map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default function MMSAdminPage() {
  useScrollable();
  const { isMobile, isTablet, hPad } = useViewport();
  const reduceMotion = usePrefersReducedMotion();
  const activeId = useScrollSpy(SIDE_NAV_ITEMS.map((item) => item.id));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.surface,
        "--color-accent": C.accentValue,
      }}
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
              {["Shipped", "Internal Tool", "System Design"].map((chip) => (
                <span
                  key={chip}
                  style={{
                    padding: "5px 16px",
                    borderRadius: "20px",
                    background: C.surfaceInverted,
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
                  color: C.text,
                  fontFamily: F.display,
                  fontSize: isMobile ? "32px" : "48px",
                  fontWeight: 600,
                  lineHeight: 1.4,
                }}
              >
                From Requests to Ownership
              </h1>
              <p
                style={{
                  margin: 0,
                  color: C.textMuted,
                  fontFamily: F.base,
                  fontSize: isMobile ? "20px" : "28px",
                  fontWeight: 400,
                  lineHeight: 1.4,
                }}
              >
                My Music Studio: Admin Panel Design
              </p>
            </div>
          </div>
        </header>

        <div
          style={{
            display: "grid",
            width: "100%",
            aspectRatio: "16 / 9",
            maxHeight: "1080px",
            overflow: "hidden",
            background: C.surfaceSubtle,
          }}
        >
          <img
            src={ASSETS.hero}
            alt="My Music Studio admin dashboard displayed on a laptop"
            style={{
              gridArea: "1 / 1",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 45%",
              display: "block",
            }}
          />
          <span
            style={{
              gridArea: "1 / 1",
              alignSelf: "end",
              justifySelf: "end",
              padding: "3px 12px",
              background: C.confidentiality,
              color: C.textInverse,
              fontFamily: F.base,
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: 1.4,
              textAlign: "right",
            }}
          >
            Some details have been modified for confidentiality.
          </span>
        </div>

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
                    color: C.textMuted,
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
                        color: C.text,
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
                        color: active ? C.textMuted : C.surfaceDisabled,
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
                          background: active ? C.textMuted : "transparent",
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
                title="Building an admin system from scratch"
                isMobile={isMobile}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <BodyParagraph>
                    My Music Studio was already running as a live service, but{" "}
                    <strong>
                      many internal tasks still depended on the development team
                    </strong>
                    . Daily operations still relied on scattered manual requests
                    instead of a structured admin system.
                  </BodyParagraph>
                  <BodyParagraph>
                    My role was to plan a new admin system{" "}
                    <strong>from the ground up</strong>. I collected pain points
                    from different teams, organized the work flows, defined the
                    information architecture, and designed wireframes for the core
                    admin features.
                  </BodyParagraph>
                  <BodyParagraph>
                    The goal was not just to make internal screens. It was to{" "}
                    <strong>
                      help each team manage their own work faster, reduce repeated
                      requests to developers
                    </strong>
                    , and <strong>lower the risk of human errors</strong> in daily
                    operations.
                  </BodyParagraph>
                </div>
              </ProjectSection>

              <ProjectSection
                id="problem"
                label="Problem"
                title="The service was live, but operations were still manual"
                isMobile={isMobile}
              >
                <BodyParagraph>
                  My Music Studio was already running, but daily admin tasks were
                  still handled through emails, messages, file handoffs, and
                  developer requests.
                </BodyParagraph>
                <figure
                  style={{
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "9px",
                  }}
                >
                  <img
                    src={ASSETS.requestFlow}
                    alt="Before Admin request flow passing every operational task through developers"
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                  <figcaption
                    style={{
                      color: C.textSubtle,
                      fontFamily: F.base,
                      fontSize: "14px",
                      fontStyle: "italic",
                      lineHeight: 1.55,
                      textAlign: "right",
                    }}
                  >
                    Before Admin: Every operational request had to pass through
                    developers.
                  </figcaption>
                </figure>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <p
                    style={{
                      margin: 0,
                      color: C.textSubtle,
                      fontFamily: F.base,
                      fontSize: "16px",
                      fontWeight: 500,
                      lineHeight: 1.5,
                    }}
                  >
                    Team Pain Points
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile
                        ? "1fr"
                        : "repeat(2, minmax(0, 1fr))",
                      gap: "12px",
                    }}
                  >
                    {PAIN_POINTS.map((point) => (
                      <PainCard key={point.title} point={point} />
                    ))}
                  </div>
                </div>
                <BodyParagraph>
                  The issue was not only that teams had to wait. The bigger problem
                  was that daily operations had no clear owner, no central source of
                  truth, and too much room for error.
                </BodyParagraph>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "27px",
                    color: C.text,
                    fontFamily: F.base,
                    fontSize: "18px",
                    lineHeight: 1.55,
                  }}
                >
                  <li>
                    <strong>Responsibility Without Control:</strong> Teams owned the
                    work, but could not manage it directly.
                  </li>
                  <li>
                    <strong>Scattered Source of Truth:</strong> Files and service data
                    were spread across messages, emails, and folders.
                  </li>
                  <li>
                    <strong>Human Error Risk:</strong> Manual requests and calculations
                    made mistakes more likely.
                  </li>
                </ul>
              </ProjectSection>

              <ProjectSection
                id="strategy"
                label="Strategy"
                title="Turning scattered work into a structured admin system"
                isMobile={isMobile}
              >
                <BodyParagraph>
                  The admin needed to support real operations, not just collect
                  features. I mapped repeated work, grouped it by ownership and risk,
                  and used that structure to define the IA.
                </BodyParagraph>
                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: "12px",
                  }}
                >
                  {STRATEGY_STEPS.map((step) => (
                    <StrategyStep key={step.number} step={step} />
                  ))}
                </div>
                <StrategyGallery isMobile={isMobile} />
              </ProjectSection>

              <ProjectSection
                id="key-solutions"
                label="Key Solutions"
                title="From developer requests to self-serve operations"
                isMobile={isMobile}
              >
                <BodyParagraph>
                  After mapping repeated operational tasks, I designed admin
                  workflows that helped internal teams manage daily work without
                  asking developers. The goal was not to show every piece of data,
                  but to give each team the right controls, status, and context to
                  work safely.
                </BodyParagraph>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "48px",
                    paddingTop: "8px",
                  }}
                >
                  {SOLUTIONS.map((solution) => (
                    <SolutionBlock
                      key={solution.title}
                      solution={solution}
                      reduceMotion={reduceMotion}
                    />
                  ))}
                </div>
              </ProjectSection>

              <ProjectSection
                id="iteration"
                label="Iteration"
                title="Updating the IA as the service grew"
                isMobile={isMobile}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <BodyParagraph>
                    The first version of the admin focused on replacing manual
                    operational requests.
                  </BodyParagraph>
                  <BodyParagraph>
                    After launch, new service features created new objects to manage,
                    such as contest winners and user-created crews. Instead of adding
                    these items as small fields inside existing pages, I separated
                    them into independent admin menus when they became meaningful
                    operational units.
                  </BodyParagraph>
                </div>
                <ConfidentialMedia
                  src={ASSETS.iteration}
                  alt="Updated information architecture for the growing service"
                  caption="Screen Evidence"
                  objectFit="contain"
                />
              </ProjectSection>

              <ProjectSection
                id="impact"
                label="Impact"
                title="Making daily operations faster and more reliable"
                isMobile={isMobile}
              >
                <BodyParagraph>
                  The admin system helped internal teams handle repeated tasks with
                  less waiting, clearer records, and fewer manual steps.
                </BodyParagraph>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile
                      ? "1fr"
                      : "repeat(3, minmax(0, 1fr))",
                    gap: "12px",
                  }}
                >
                  {IMPACT_ITEMS.map((item) => (
                    <article
                      key={item.lines[0]}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        padding: "18px 14px",
                        borderRadius: "8px",
                        background: C.purpleSurface,
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          color: C.accent,
                          fontFamily: F.base,
                          fontSize: "20px",
                          fontWeight: 700,
                          lineHeight: 1.4,
                        }}
                      >
                        {item.lines[0]}
                        <br aria-hidden="true" />
                        {item.lines[1]}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          color: C.text,
                          fontFamily: F.base,
                          fontSize: "16px",
                          lineHeight: 1.55,
                        }}
                      >
                        {item.body}
                      </p>
                    </article>
                  ))}
                </div>
              </ProjectSection>

              <ProjectSection
                id="reflection"
                label="Reflection"
                title="Admin design starts with structure"
                isMobile={isMobile}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <BodyParagraph>
                    This project taught me that{" "}
                    <strong>
                      back office design starts with structuring work, not drawing
                      screens
                    </strong>
                    .
                  </BodyParagraph>
                  <BodyParagraph>
                    The hardest part was{" "}
                    <strong>designing a company-wide system from scratch</strong>.
                    Each team had different workflows and needs, so I had to collect
                    scattered requirements and turn them into a clear system
                    structure.
                  </BodyParagraph>
                  <BodyParagraph>
                    I also learned that a good admin system should{" "}
                    <strong>reduce more than delays</strong>. It should reduce the
                    communication fatigue that comes from explaining tasks, finding
                    information, checking details, and asking for changes again.
                  </BodyParagraph>
                  <BodyParagraph>
                    If I were to improve this system today, I would focus more on{" "}
                    <strong>
                      making related information easier to find and navigate
                    </strong>
                    , so users could move through complex data more efficiently.
                  </BodyParagraph>
                  <BodyParagraph>
                    Through this project, I learned that{" "}
                    <strong>
                      back office design is about making complex work manageable for
                      many teams
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
