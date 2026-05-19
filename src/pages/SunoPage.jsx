import { useState, useEffect, useLayoutEffect } from "react";
import Header from "../components/Header";

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

const C = {
  surfaceDefault: "#FFFFFF",
  surfaceSubtle: "#F4F4F4",
  surfaceDark: "#121212",
  textPrimary: "#121212",
  textSecondary: "#444444",
  textMuted: "#777777",
  textInverse: "#FFFFFF",
  textDisabled: "#DADADA",
  surfaceSection: "#FAFAFA",
  accentBg: "#EEF0FF",
  accentText: "#4F55E4",
  borderDefault: "#E5E5E5",
};

const F = {
  base: "'Inter', sans-serif",
  display: "'Merriweather', serif",
  label: "'Space Grotesk', sans-serif",
};

function useHPad() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  if (width <= 768) return { hPad: "24px", isMobile: true };
  if (width <= 1200) return { hPad: "60px", isMobile: false };
  return { hPad: "352px", isMobile: false };
}

const META_ITEMS = [
  {
    label: "ROLE",
    lines: ["User Research", "Market Research", "Product Design", "Design System", "Prototyping"],
  },
  { label: "TIMELINE", lines: ["2 months"] },
  { label: "TEAM", lines: ["Nayun Park (Product Designer)", "1 Designer"] },
  { label: "TOOLS", lines: ["Figma", "Figjam"] },
];

const SIDE_NAV_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "discover", label: "Discover" },
  { id: "define", label: "Define" },
  { id: "ideate", label: "Ideate" },
  { id: "design-system", label: "Design System" },
  { id: "key-solutions", label: "Key Solutions" },
  { id: "evaluation", label: "Evaluation" },
  { id: "reflection", label: "Reflection" },
];

const SCROLL_OFFSET = 120;

function useScrollSpy(ids) {
  const [activeId, setActiveId] = useState(ids[0]);
  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return;

    const compute = () => {
      const probe = SCROLL_OFFSET + 1;
      let current = sections[0].id;
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= probe) current = s.id;
        else break;
      }
      setActiveId(current);
    };

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [ids]);
  return activeId;
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
}

function InsightCard({ label, title, body }) {
  return (
    <div
      style={{
        background: C.surfaceSection,
        borderRadius: "8px",
        padding: "18px 12px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "100%",
      }}
    >
      <div
        style={{
          background: C.accentBg,
          borderRadius: "8px",
          padding: "4px 10px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "flex-start",
        }}
      >
        <span
          style={{
            fontFamily: F.base,
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: 1.4,
            color: C.accentText,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingLeft: "4px" }}>
        <p
          style={{
            fontFamily: F.display,
            fontWeight: 600,
            fontSize: "20px",
            lineHeight: 1.4,
            color: C.textPrimary,
            margin: 0,
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontFamily: F.base,
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: 1.55,
            color: C.textPrimary,
            margin: 0,
          }}
        >
          {body}
        </p>
      </div>
    </div>
  );
}

function DetailBlock({ title, items }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
      <p
        style={{
          fontFamily: F.base,
          fontWeight: 600,
          fontSize: "14px",
          lineHeight: 1.4,
          color: C.textSecondary,
          margin: 0,
        }}
      >
        {title}
      </p>
      <ul style={{ margin: 0, paddingLeft: "24px", listStyle: "disc" }}>
        {items.map((item) => (
          <li
            key={item}
            style={{
              fontFamily: F.base,
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: 1.55,
              color: C.textPrimary,
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ImageCard({ src, caption, bordered = false, video = false }) {
  return (
    <figure style={{ margin: 0, flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
      <div
        style={{
          width: "100%",
          height: "280px",
          borderRadius: "4px",
          overflow: "hidden",
          border: bordered ? `1px solid ${C.borderDefault}` : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {video ? (
          <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <img
            src={src}
            alt={caption}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        )}
      </div>
      <figcaption
        style={{
          fontFamily: F.base,
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "14px",
          lineHeight: 1.55,
          color: C.textMuted,
        }}
      >
        {caption}
      </figcaption>
    </figure>
  );
}

const SIDE_NAV_IDS = SIDE_NAV_ITEMS.map((i) => i.id);

export default function SunoPage() {
  useScrollable();
  const { hPad, isMobile } = useHPad();
  const activeId = useScrollSpy(SIDE_NAV_IDS);

  return (
    <div style={{ background: C.surfaceDefault, minHeight: "100vh" }}>
      <Header />
      <main>
        {/* Project Header */}
        <div style={{ padding: `184px ${hPad} 0` }}>
          {/* Category chips */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "24px" }}>
            {["Case Study", "AI", "2025"].map((chip) => (
              <div
                key={chip}
                style={{
                  background: C.surfaceDark,
                  color: C.textInverse,
                  fontFamily: F.base,
                  fontWeight: 500,
                  fontSize: "16px",
                  lineHeight: 1.4,
                  padding: "5px 16px",
                  borderRadius: "999px",
                  whiteSpace: "nowrap",
                }}
              >
                {chip}
              </div>
            ))}
          </div>

          {/* Title group */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "56px" }}>
            <h1
              style={{
                fontFamily: F.display,
                fontWeight: 600,
                fontSize: isMobile ? "32px" : "48px",
                lineHeight: 1.4,
                color: C.textPrimary,
                margin: 0,
              }}
            >
              Making AI Music Creation Intuitive
            </h1>
            <p
              style={{
                fontFamily: F.base,
                fontWeight: 400,
                fontSize: isMobile ? "20px" : "28px",
                lineHeight: 1.4,
                color: C.textSecondary,
                margin: 0,
              }}
            >
              Suno AI App Revamp
            </p>
          </div>
        </div>

        {/* Hero image — full width */}
        <div style={{ width: "100%", aspectRatio: "16/9", position: "relative", overflow: "hidden" }}>
          <img
            src="/suno/mockup-bg.png"
            alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
          />
          <div
            style={{
              position: "absolute",
              left: "41.302%",
              top: "15.926%",
              width: "17.552%",
              aspectRatio: "337/726",
            }}
          >
            {/* SVG mask clips video to rounded corners, scales with container */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                WebkitMaskImage: "url('/suno/screen-mask.svg')",
                maskImage: "url('/suno/screen-mask.svg')",
                WebkitMaskSize: "100% 100%",
                maskSize: "100% 100%",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "0 0",
                maskPosition: "0 0",
              }}
            >
              <video
                src="/suno/screen-video.mov"
                autoPlay
                loop
                muted
                playsInline
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <img
              src="/suno/system-ui.png"
              alt=""
              style={{ position: "absolute", top: "1.58%", left: 0, width: "100%", pointerEvents: "none" }}
            />
          </div>
        </div>

        {/* Project Meta */}
        <div style={{ padding: `60px ${hPad}` }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
              gap: "36px",
            }}
          >
            {META_ITEMS.map((item) => (
              <div key={item.label} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <p
                  style={{
                    fontFamily: F.label,
                    fontWeight: 700,
                    fontSize: "18px",
                    lineHeight: 1.4,
                    letterSpacing: "0.9px",
                    color: C.textSecondary,
                    margin: 0,
                  }}
                >
                  {item.label}
                </p>
                <div>
                  {item.lines.map((line, i) => (
                    <p
                      key={i}
                      style={{
                        fontFamily: F.base,
                        fontWeight: 400,
                        fontSize: "16px",
                        lineHeight: 1.5,
                        color: C.textPrimary,
                        margin: 0,
                      }}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content area — side nav + placeholder */}
        <div
          style={{
            padding: `0 ${hPad} 120px`,
            display: "flex",
            gap: "60px",
            alignItems: "flex-start",
          }}
        >
          {/* Side nav — desktop only */}
          {!isMobile && (
            <nav
              style={{
                width: "310px",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                position: "sticky",
                top: `${SCROLL_OFFSET}px`,
                alignSelf: "flex-start",
                maxHeight: `calc(100vh - ${SCROLL_OFFSET + 24}px)`,
                overflowY: "auto",
              }}
            >
              {SIDE_NAV_ITEMS.map(({ id, label }) => {
                const active = id === activeId;
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(id);
                    }}
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                  >
                    {active && (
                      <div
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "1px",
                          background: C.textSecondary,
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <span
                      style={{
                        fontFamily: F.base,
                        fontWeight: active ? 600 : 500,
                        fontSize: "18px",
                        lineHeight: 1.4,
                        color: active ? C.textSecondary : C.textDisabled,
                        whiteSpace: "nowrap",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {label}
                    </span>
                  </a>
                );
              })}
            </nav>
          )}

          {/* Project content */}
          <div style={{ flex: 1, minWidth: 0, maxWidth: "700px", display: "flex", flexDirection: "column", gap: "90px" }}>
            {/* Overview section */}
            <section
              id="overview"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                alignItems: "flex-start",
                scrollMarginTop: `${SCROLL_OFFSET}px`,
              }}
            >
              {/* section-label */}
              <div style={{ display: "flex", gap: "10px", alignItems: "center", alignSelf: "stretch" }}>
                <div
                  style={{
                    width: "6px",
                    alignSelf: "stretch",
                    background: C.textSecondary,
                    flexShrink: 0,
                  }}
                />
                <p
                  style={{
                    fontFamily: F.label,
                    fontWeight: 700,
                    fontSize: "20px",
                    lineHeight: 1.3,
                    letterSpacing: "0.8px",
                    color: C.textSecondary,
                    textTransform: "uppercase",
                    margin: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  Overview
                </p>
              </div>

              {/* section-body */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
                <h2
                  style={{
                    fontFamily: F.display,
                    fontWeight: 600,
                    fontSize: isMobile ? "24px" : "32px",
                    lineHeight: 1.4,
                    color: C.textPrimary,
                    margin: 0,
                  }}
                >
                  Making your first AI song feel easy
                </h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    fontFamily: F.base,
                    fontWeight: 400,
                    fontSize: "18px",
                    lineHeight: 1.55,
                    color: C.textPrimary,
                  }}
                >
                  <p style={{ margin: 0 }}>
                    This project started from a problem I&rsquo;ve seen three times: building an AI music mixing service, using music AI tools as a listener, and now designing for one. Every time, users got stuck before they even started.
                  </p>
                  <p style={{ margin: 0 }}>
                    Suno lets people create music using AI. Users type a style or lyrics, and the app makes a song.
                  </p>
                  <p style={{ margin: 0 }}>
                    But new users often don&rsquo;t know what to write in the prompt. This case study focuses on the first creation experience, so users feel confident enough to keep going.
                  </p>
                </div>
              </div>
            </section>

            {/* Discover section */}
            <section
              id="discover"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                alignItems: "flex-start",
                scrollMarginTop: `${SCROLL_OFFSET}px`,
              }}
            >
              {/* section-label */}
              <div style={{ display: "flex", gap: "10px", alignItems: "center", alignSelf: "stretch" }}>
                <div style={{ width: "6px", alignSelf: "stretch", background: C.textSecondary, flexShrink: 0 }} />
                <p
                  style={{
                    fontFamily: F.label,
                    fontWeight: 700,
                    fontSize: "20px",
                    lineHeight: 1.3,
                    letterSpacing: "0.8px",
                    color: C.textSecondary,
                    textTransform: "uppercase",
                    margin: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  Discover
                </p>
              </div>

              <h2
                style={{
                  fontFamily: F.display,
                  fontWeight: 600,
                  fontSize: isMobile ? "24px" : "32px",
                  lineHeight: 1.4,
                  color: C.textPrimary,
                  margin: 0,
                }}
              >
                Starting is hard, but users still want to create
              </h2>

              {/* section content */}
              <div style={{ display: "flex", flexDirection: "column", gap: "48px", width: "100%" }}>
                {/* Desk Research subsection */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                  <p
                    style={{
                      fontFamily: F.base,
                      fontWeight: 500,
                      fontSize: "16px",
                      lineHeight: 1.5,
                      color: C.textMuted,
                      margin: 0,
                    }}
                  >
                    Desk Research
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
                    <p
                      style={{
                        fontFamily: F.base,
                        fontWeight: 400,
                        fontSize: "18px",
                        lineHeight: 1.55,
                        color: C.textPrimary,
                        margin: 0,
                      }}
                    >
                      This desk research combined market research, app reviews, competitor analysis, and product structure analysis to identify key early UX problems.
                    </p>

                    <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                      <div
                        style={{
                          width: "100%",
                          border: `1px solid ${C.borderDefault}`,
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src="/suno/discover/desk-research.png"
                          alt="FigJam board with synthesized desk research"
                          style={{ display: "block", width: "100%", height: "auto" }}
                        />
                      </div>
                      <figcaption
                        style={{
                          fontFamily: F.base,
                          fontStyle: "italic",
                          fontWeight: 400,
                          fontSize: "14px",
                          lineHeight: 1.55,
                          color: C.textMuted,
                        }}
                      >
                        FigJam board with synthesized desk research
                      </figcaption>
                    </figure>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                      {[
                        { label: "Insight 1", title: "Good features, hard first step", body: "Users don’t know how to write prompts without guidance." },
                        { label: "Insight 2", title: "Users still have a desire to create on mobile", body: "Users accept fewer features, but still want to create music on mobile." },
                      ].map(({ label, title, body }) => (
                        <InsightCard key={label} label={label} title={title} body={body} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* User Interview subsection */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                  <p
                    style={{
                      fontFamily: F.base,
                      fontWeight: 500,
                      fontSize: "16px",
                      lineHeight: 1.5,
                      color: C.textMuted,
                      margin: 0,
                    }}
                  >
                    User Interview
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
                    <p
                      style={{
                        fontFamily: F.base,
                        fontWeight: 400,
                        fontSize: "18px",
                        lineHeight: 1.55,
                        color: C.textPrimary,
                        margin: 0,
                      }}
                    >
                      I conducted one-on-one semi-structured in-depth interviews to understand how people experience Suno&rsquo;s creative flow, what makes them excited to create, and where the process begins to break down.
                    </p>

                    {/* details */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", paddingLeft: "8px", width: "100%" }}>
                      <DetailBlock
                        title="Interview Purpose"
                        items={[
                          "To learn what users expect when they first open Suno",
                          "To see where users feel confused or stuck while creating music",
                          "To understand why users stop using the app or keep using it, even when it feels hard",
                        ]}
                      />
                      <DetailBlock
                        title="Participants"
                        items={[
                          "8 users in total",
                          "6 users - new to Suno and had never made music before",
                          "2 users - had music knowledge and had used Suno before",
                          "All users had used AI services before",
                        ]}
                      />
                    </div>

                    {/* image row 1 */}
                    <div style={{ display: "flex", gap: "20px", width: "100%", flexDirection: isMobile ? "column" : "row" }}>
                      <ImageCard src="/suno/discover/interview-image.webp" caption="1:1 in-depth interview" objectFit="cover" />
                      <ImageCard src="/suno/discover/transcripts.png" caption="Color-coded interview transcripts" bordered />
                    </div>

                    <p
                      style={{
                        fontFamily: F.base,
                        fontWeight: 400,
                        fontSize: "18px",
                        lineHeight: 1.55,
                        color: C.textPrimary,
                        margin: 0,
                      }}
                    >
                      Interview responses were grouped using affinity mapping to identify key patterns.
                    </p>

                    {/* image row 2 */}
                    <div style={{ display: "flex", gap: "20px", width: "100%", flexDirection: isMobile ? "column" : "row" }}>
                      <ImageCard src="/suno/discover/affinity-session-720p.mov" caption="Team affinity mapping session" video />
                      <ImageCard src="/suno/discover/affinity-mapping.png" caption="Affinity mapping" />
                    </div>

                    <InsightCard
                      label="Insight"
                      title="Fun to start, hard to continue"
                      body="Users enjoy creating music at first, but feel lost when the app doesn’t take the lead."
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Define section */}
            <section
              id="define"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                alignItems: "flex-start",
                scrollMarginTop: `${SCROLL_OFFSET}px`,
              }}
            >
              {/* section-label */}
              <div style={{ display: "flex", gap: "10px", alignItems: "center", alignSelf: "stretch" }}>
                <div style={{ width: "6px", alignSelf: "stretch", background: C.textSecondary, flexShrink: 0 }} />
                <p
                  style={{
                    fontFamily: F.label,
                    fontWeight: 700,
                    fontSize: "20px",
                    lineHeight: 1.3,
                    letterSpacing: "0.8px",
                    color: C.textSecondary,
                    textTransform: "uppercase",
                    margin: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  Define
                </p>
              </div>

              {/* section content */}
              <div style={{ display: "flex", flexDirection: "column", gap: "48px", width: "100%" }}>
                {/* headline + intro */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
                  <h2
                    style={{
                      fontFamily: F.display,
                      fontWeight: 600,
                      fontSize: isMobile ? "24px" : "32px",
                      lineHeight: 1.4,
                      color: C.textPrimary,
                      margin: 0,
                    }}
                  >
                    Without clear signals, users don’t know what to do next
                  </h2>
                  <p
                    style={{
                      fontFamily: F.base,
                      fontWeight: 400,
                      fontSize: "18px",
                      lineHeight: 1.55,
                      color: C.textPrimary,
                      margin: 0,
                    }}
                  >
                    In this phase, we identified key user types, surfaced their core pain points, and aligned on the problems to prioritize.
                  </p>
                </div>

                {/* Persona subsection */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                  <p style={{ fontFamily: F.base, fontWeight: 500, fontSize: "16px", lineHeight: 1.5, color: C.textMuted, margin: 0 }}>
                    Persona
                  </p>
                  <div style={{ display: "flex", gap: "20px", width: "100%", flexDirection: isMobile ? "column" : "row", alignItems: "stretch" }}>
                    {[
                      {
                        img: "/suno/define/persona-1.png",
                        label: "Persona 1",
                        title: "First-time AI music creator who wants to express emotions easily",
                        goals: [
                          "Create music that matches how they feel, without knowing music terms",
                          "Finish one song quickly and feel confident about the result",
                        ],
                        pains: [
                          "Doesn’t know what to write when asked to enter a prompt",
                          "Feels lost after the first result and doesn’t know what to do next",
                        ],
                      },
                      {
                        img: "/suno/define/persona-2.png",
                        label: "Persona 2",
                        title: "Music-experienced user who wants more control and understanding",
                        goals: [
                          "Understand why the AI creates different results each time",
                          "Adjust and improve the result step by step",
                        ],
                        pains: [
                          "Can’t change only the part they want",
                          "The app makes music, but doesn’t explain how or why",
                        ],
                      },
                    ].map((p) => (
                      <div
                        key={p.label}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          border: `1px solid ${C.borderDefault}`,
                          borderRadius: "8px",
                          padding: "18px 14px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "16px",
                          alignItems: "flex-start",
                        }}
                      >
                        <img
                          src={p.img}
                          alt={p.label}
                          style={{ width: "64px", height: "64px", borderRadius: "9999px", objectFit: "cover", display: "block" }}
                        />
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
                          <p style={{ fontFamily: F.base, fontWeight: 600, fontSize: "14px", lineHeight: 1.4, color: C.accentText, margin: 0 }}>
                            {p.label}
                          </p>
                          <p style={{ fontFamily: F.base, fontWeight: 400, fontSize: "16px", lineHeight: 1.55, color: C.textPrimary, margin: 0 }}>
                            {p.title}
                          </p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <p style={{ fontFamily: F.base, fontWeight: 600, fontSize: "14px", lineHeight: 1.4, color: C.textSecondary, margin: 0 }}>
                              Goals
                            </p>
                            <ul style={{ margin: 0, paddingLeft: "24px", listStyle: "disc" }}>
                              {p.goals.map((g) => (
                                <li key={g} style={{ fontFamily: F.base, fontWeight: 400, fontSize: "16px", lineHeight: 1.55, color: C.textPrimary }}>
                                  {g}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <p style={{ fontFamily: F.base, fontWeight: 600, fontSize: "14px", lineHeight: 1.4, color: C.textSecondary, margin: 0 }}>
                              Pain points
                            </p>
                            <ul style={{ margin: 0, paddingLeft: "24px", listStyle: "disc" }}>
                              {p.pains.map((pn) => (
                                <li key={pn} style={{ fontFamily: F.base, fontWeight: 400, fontSize: "16px", lineHeight: 1.55, color: C.textPrimary }}>
                                  {pn}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Empathy Map subsection */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                  <p style={{ fontFamily: F.base, fontWeight: 500, fontSize: "16px", lineHeight: 1.5, color: C.textMuted, margin: 0 }}>
                    Empathy Map
                  </p>
                  <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end", width: "100%" }}>
                    <div
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        border: `1px solid ${C.borderDefault}`,
                        borderRadius: "4px",
                        padding: "8px 16px",
                        display: "flex",
                        gap: "24px",
                        flexDirection: isMobile ? "column" : "row",
                        alignItems: "center",
                        overflow: "hidden",
                      }}
                    >
                      {[
                        { src: "/suno/define/empathy-map-1.png", alt: "Empathy map for Persona 1" },
                        { src: "/suno/define/empathy-map-2.png", alt: "Empathy map for Persona 2" },
                      ].map(({ src, alt }) => (
                        <div
                          key={src}
                          style={{ flex: 1, minWidth: 0, aspectRatio: "1 / 1", width: "100%", position: "relative" }}
                        >
                          <img
                            src={src}
                            alt={alt}
                            style={{
                              position: "absolute",
                              inset: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <figcaption
                      style={{
                        fontFamily: F.base,
                        fontStyle: "italic",
                        fontWeight: 400,
                        fontSize: "14px",
                        lineHeight: 1.55,
                        color: C.textMuted,
                        textAlign: "right",
                      }}
                    >
                      Empathy mapping based on interview transcripts and affinity mapping
                    </figcaption>
                  </figure>
                </div>

                {/* HMW block */}
                <div style={{ width: "100%", padding: "24px 0", boxSizing: "border-box" }}>
                  <div
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      background: C.accentText,
                      padding: isMobile ? "60px 24px" : "100px 40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: F.display,
                        fontWeight: 700,
                        fontSize: isMobile ? "24px" : "36px",
                        lineHeight: 1.55,
                        color: C.textInverse,
                        textAlign: "center",
                        margin: 0,
                        width: "100%",
                      }}
                    >
                      How might we help users know
                      <br />
                      what to do when creating a song?
                    </p>
                  </div>
                </div>

                {/* Feature Prioritization subsection */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                  <p style={{ fontFamily: F.base, fontWeight: 500, fontSize: "16px", lineHeight: 1.5, color: C.textMuted, margin: 0 }}>
                    Feature Prioritization
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%" }}>
                      <p
                        style={{
                          fontFamily: F.base,
                          fontWeight: 400,
                          fontSize: "18px",
                          lineHeight: 1.55,
                          color: C.textPrimary,
                          margin: 0,
                        }}
                      >
                        We prioritized features that help users know what to do next after their first song, focusing on high impact with low effort.
                      </p>
                      <ul style={{ margin: 0, paddingLeft: "24px", listStyle: "disc" }}>
                        <li style={{ fontFamily: F.base, fontSize: "18px", lineHeight: 1.55, color: C.textPrimary }}>
                          <span style={{ fontWeight: 600 }}>Eisenhower matrix</span>
                          <span style={{ fontWeight: 400 }}> was used to evaluate value vs. effort</span>
                        </li>
                        <li style={{ fontFamily: F.base, fontSize: "18px", lineHeight: 1.55, color: C.textPrimary }}>
                          <span style={{ fontWeight: 600 }}>Kano model</span>
                          <span style={{ fontWeight: 400 }}> was used to understand user satisfaction vs. functionality</span>
                        </li>
                      </ul>
                    </div>

                    {/* image row: Eisenhower + Kano */}
                    <div style={{ display: "flex", gap: "20px", width: "100%", flexDirection: isMobile ? "column" : "row", alignItems: "stretch" }}>
                      {[
                        { src: "/suno/define/eisenhower.png", caption: "Eisenhower matrix" },
                        { src: "/suno/define/kano.png", caption: "Kano model" },
                      ].map(({ src, caption }) => (
                        <figure
                          key={caption}
                          style={{ margin: 0, flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}
                        >
                          <div
                            style={{
                              width: "100%",
                              aspectRatio: "1 / 1",
                              border: `1px solid ${C.borderDefault}`,
                              borderRadius: "4px",
                              overflow: "hidden",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <img
                              src={src}
                              alt={caption}
                              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            />
                          </div>
                          <figcaption
                            style={{
                              fontFamily: F.base,
                              fontStyle: "italic",
                              fontWeight: 400,
                              fontSize: "14px",
                              lineHeight: 1.55,
                              color: C.textMuted,
                              textAlign: "right",
                            }}
                          >
                            {caption}
                          </figcaption>
                        </figure>
                      ))}
                    </div>

                    {/* selected + dropped lists */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", paddingLeft: "8px", width: "100%" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
                        <p style={{ fontFamily: F.base, fontSize: "14px", lineHeight: 1.4, color: C.textSecondary, margin: 0 }}>
                          <span style={{ fontWeight: 600 }}>Selected </span>
                          <span style={{ fontWeight: 400 }}>(4)</span>
                        </p>
                        <ul style={{ margin: 0, paddingLeft: "24px", listStyle: "disc" }}>
                          {[
                            "Taste-first Onboarding",
                            "Prompt Helper",
                            "Prompt History",
                            "Feedback-driven Personalization",
                          ].map((item) => (
                            <li
                              key={item}
                              style={{ fontFamily: F.base, fontWeight: 500, fontSize: "16px", lineHeight: 1.5, color: C.textPrimary }}
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
                        <p style={{ fontFamily: F.base, fontSize: "14px", lineHeight: 1.4, color: C.textSecondary, margin: 0 }}>
                          <span style={{ fontWeight: 600 }}>Considered but dropped </span>
                          <span style={{ fontWeight: 400 }}>(2)</span>
                        </p>
                        <ul style={{ margin: 0, paddingLeft: "24px", listStyle: "disc" }}>
                          {[
                            {
                              title: "Tutorial Video",
                              body: "Watching someone else create doesn’t reduce first-time drop-off. It only delays the moment users have to start on their own.",
                            },
                            {
                              title: "Auto Genre Detection",
                              body: "Users lose the sense of control they came for. Conflicts with Persona 2’s need to understand and adjust results.",
                            },
                          ].map(({ title, body }) => (
                            <li
                              key={title}
                              style={{ fontFamily: F.base, fontSize: "16px", lineHeight: 1.55, color: C.textPrimary }}
                            >
                              <div style={{ fontWeight: 500, lineHeight: 1.5 }}>{title}</div>
                              <div style={{ fontWeight: 400 }}>{body}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Ideate section */}
            <section
              id="ideate"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                alignItems: "flex-start",
                scrollMarginTop: `${SCROLL_OFFSET}px`,
              }}
            >
              {/* section-label */}
              <div style={{ display: "flex", gap: "10px", alignItems: "center", alignSelf: "stretch" }}>
                <div style={{ width: "6px", alignSelf: "stretch", background: C.textSecondary, flexShrink: 0 }} />
                <p
                  style={{
                    fontFamily: F.label,
                    fontWeight: 700,
                    fontSize: "20px",
                    lineHeight: 1.3,
                    letterSpacing: "0.8px",
                    color: C.textSecondary,
                    textTransform: "uppercase",
                    margin: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  Ideate
                </p>
              </div>

              {/* section-body */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
                <h2
                  style={{
                    fontFamily: F.display,
                    fontWeight: 600,
                    fontSize: isMobile ? "24px" : "32px",
                    lineHeight: 1.4,
                    color: C.textPrimary,
                    margin: 0,
                  }}
                >
                  Shaping ideas to reduce user thinking
                </h2>
                <p
                  style={{
                    fontFamily: F.base,
                    fontWeight: 400,
                    fontSize: "18px",
                    lineHeight: 1.55,
                    color: C.textPrimary,
                    margin: 0,
                  }}
                >
                  We focused on reducing user thinking, not teaching new features. With this direction, we explored how these ideas could live on the screen. So, we quickly sketched many ideas to explore how this idea could work on screen.
                </p>
              </div>

              {/* subsection list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "48px", width: "100%" }}>
                {/* Crazy 8's */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                  <p style={{ fontFamily: F.base, fontWeight: 500, fontSize: "16px", lineHeight: 1.5, color: C.textMuted, margin: 0 }}>
                    Crazy 8&rsquo;s
                  </p>
                  <div style={{ display: "flex", gap: "20px", width: "100%", flexDirection: isMobile ? "column" : "row", alignItems: "stretch" }}>
                    {/* Video — 340×386 content, centered & clipped inside 380px-tall box */}
                    <figure style={{ margin: 0, flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end", padding: "8px 0" }}>
                      <div
                        style={{
                          width: "100%",
                          height: "380px",
                          borderRadius: "4px",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <video
                          src="/suno/ideate/crazy8s_session.mov"
                          autoPlay
                          loop
                          muted
                          playsInline
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      </div>
                      <figcaption
                        style={{
                          fontFamily: F.base,
                          fontStyle: "italic",
                          fontWeight: 400,
                          fontSize: "14px",
                          lineHeight: 1.55,
                          color: C.textMuted,
                        }}
                      >
                        Team crazy 8&rsquo;s session
                      </figcaption>
                    </figure>

                    {/* Sketches grid image — centered inside bordered 380px-tall box */}
                    <figure style={{ margin: 0, flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end", padding: "8px 0" }}>
                      <div
                        style={{
                          width: "100%",
                          height: "380px",
                          border: `1px solid ${C.borderDefault}`,
                          borderRadius: "4px",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxSizing: "border-box",
                        }}
                      >
                        <img
                          src="/suno/ideate/image-crazy8s.webp"
                          alt="Crazy 8's sketches"
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      </div>
                      <figcaption
                        style={{
                          fontFamily: F.base,
                          fontStyle: "italic",
                          fontWeight: 400,
                          fontSize: "14px",
                          lineHeight: 1.55,
                          color: C.textMuted,
                        }}
                      >
                        Crazy 8&rsquo;s
                      </figcaption>
                    </figure>
                  </div>
                </div>

                {/* Final Sketches */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                  <p style={{ fontFamily: F.base, fontWeight: 500, fontSize: "16px", lineHeight: 1.5, color: C.textMuted, margin: 0 }}>
                    Final Sketches
                  </p>
                  <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end", width: "100%" }}>
                    <div
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        border: `1px solid ${C.borderDefault}`,
                        borderRadius: "4px",
                        padding: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src="/suno/ideate/final-sketches.png"
                        alt="Final sketches"
                        style={{ display: "block", width: "100%", height: "auto" }}
                      />
                    </div>
                    <figcaption
                      style={{
                        fontFamily: F.base,
                        fontStyle: "italic",
                        fontWeight: 400,
                        fontSize: "14px",
                        lineHeight: 1.55,
                        color: C.textMuted,
                        textAlign: "right",
                      }}
                    >
                      Final sketches
                    </figcaption>
                  </figure>
                </div>

                {/* Task Flow */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                  <p style={{ fontFamily: F.base, fontWeight: 500, fontSize: "16px", lineHeight: 1.5, color: C.textMuted, margin: 0 }}>
                    Task Flow
                  </p>
                  <p
                    style={{
                      fontFamily: F.base,
                      fontWeight: 400,
                      fontSize: "18px",
                      lineHeight: 1.55,
                      color: C.textPrimary,
                      margin: 0,
                    }}
                  >
                    We translated insights into three task flows that guide users step by step.
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%", marginTop: "8px" }}>
                    {/* First-time User Flow — full width */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingLeft: "8px", width: "100%" }}>
                        <p style={{ fontFamily: F.base, fontWeight: 600, fontSize: "14px", lineHeight: 1.4, color: C.textSecondary, margin: 0 }}>
                          First-time User Flow
                        </p>
                        <p style={{ fontFamily: F.base, fontWeight: 400, fontSize: "16px", lineHeight: 1.55, color: C.textPrimary, margin: 0 }}>
                          Guided onboarding that helps first-time users know what to do next.
                        </p>
                      </div>
                      <div
                        style={{
                          background: C.surfaceSection,
                          borderRadius: "4px",
                          padding: "32px 24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      >
                        <img
                          src="/suno/ideate/flow-first-time.png"
                          alt="First-time user flow diagram"
                          style={{ display: "block", maxWidth: "100%", height: "auto" }}
                        />
                      </div>
                    </div>

                    {/* Creation & Feedback + Exploration — 2 columns */}
                    <div style={{ display: "flex", gap: "12px", width: "100%", flexDirection: isMobile ? "column" : "row", alignItems: "stretch" }}>
                      {[
                        {
                          title: "Creation & Feedback Flow",
                          body: "The Prompt Helper helps write prompts, and feedback improves the next ones.",
                          src: "/suno/ideate/flow-creation-feedback.png",
                          alt: "Creation and feedback flow diagram",
                        },
                        {
                          title: "Exploration Flow",
                          body: "Users learn how to create by looking at others’ prompts and their own history.",
                          src: "/suno/ideate/flow-exploration.png",
                          alt: "Exploration flow diagram",
                        },
                      ].map(({ title, body, src, alt }) => (
                        <div key={title} style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingLeft: "8px", width: "100%" }}>
                            <p style={{ fontFamily: F.base, fontWeight: 600, fontSize: "14px", lineHeight: 1.4, color: C.textSecondary, margin: 0 }}>
                              {title}
                            </p>
                            <p style={{ fontFamily: F.base, fontWeight: 400, fontSize: "16px", lineHeight: 1.55, color: C.textPrimary, margin: 0 }}>
                              {body}
                            </p>
                          </div>
                          <div
                            style={{
                              background: C.surfaceSection,
                              borderRadius: "4px",
                              padding: "32px 16px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "100%",
                              boxSizing: "border-box",
                              minHeight: "140px",
                            }}
                          >
                            <img
                              src={src}
                              alt={alt}
                              style={{ display: "block", maxWidth: "100%", height: "auto" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Wireframe */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                  <p style={{ fontFamily: F.base, fontWeight: 500, fontSize: "16px", lineHeight: 1.5, color: C.textMuted, margin: 0 }}>
                    Wireframe
                  </p>
                  <p
                    style={{
                      fontFamily: F.base,
                      fontWeight: 400,
                      fontSize: "18px",
                      lineHeight: 1.55,
                      color: C.textPrimary,
                      margin: 0,
                    }}
                  >
                    We translated key flows into wireframes that guide users step by step.
                  </p>

                  <div
                    style={{
                      background: C.surfaceSection,
                      borderRadius: "4px",
                      padding: isMobile ? "16px" : "24px 16px",
                      display: "flex",
                      gap: isMobile ? "32px" : "60px",
                      alignItems: "stretch",
                      flexDirection: isMobile ? "column" : "row",
                      width: "100%",
                      boxSizing: "border-box",
                      marginTop: "8px",
                    }}
                  >
                    {/* Creation Screen — left */}
                    <WireframeBlock
                      title="Creation Screen"
                      src="/suno/ideate/image-wireframe-creation.webp"
                      labels={[
                        "History / Drafts Menu",
                        "Prompt Suggestions Cards",
                        "Prompt Helper Button",
                        "Prompt Settings Button",
                      ]}
                      large
                      direction="column"
                    />

                    {/* Onboarding + Feedback — right column stacked */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px", flex: 1, minWidth: 0, justifyContent: "center" }}>
                      <WireframeBlock
                        title="Onboarding Screen"
                        src="/suno/ideate/image-wireframe-onboarding.webp"
                        labels={["Example Content", "Go to Home Button"]}
                      />
                      <WireframeBlock
                        title="Feedback Screen"
                        src="/suno/ideate/image-wireframe-feedback.webp"
                        labels={["Preference Feedback Button", "Next Step Buttons"]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Design System section */}
            <section
              id="design-system"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                alignItems: "flex-start",
                scrollMarginTop: `${SCROLL_OFFSET}px`,
              }}
            >
              {/* section-label */}
              <div style={{ display: "flex", gap: "10px", alignItems: "center", alignSelf: "stretch" }}>
                <div style={{ width: "6px", alignSelf: "stretch", background: C.textSecondary, flexShrink: 0 }} />
                <p
                  style={{
                    fontFamily: F.label,
                    fontWeight: 700,
                    fontSize: "20px",
                    lineHeight: 1.3,
                    letterSpacing: "0.8px",
                    color: C.textSecondary,
                    textTransform: "uppercase",
                    margin: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  Design System
                </p>
              </div>

              {/* section-body */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
                <h2
                  style={{
                    fontFamily: F.display,
                    fontWeight: 600,
                    fontSize: isMobile ? "24px" : "32px",
                    lineHeight: 1.4,
                    color: C.textPrimary,
                    margin: 0,
                  }}
                >
                  A shared system helps teams stay consistent
                </h2>
              </div>

              {/* subsection list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "48px", width: "100%" }}>
                {/* Typography */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                  <p style={{ fontFamily: F.base, fontWeight: 500, fontSize: "16px", lineHeight: 1.5, color: C.textMuted, margin: 0 }}>
                    Typography
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "40px", width: "100%" }}>
                    <FontFamilySample
                      familyName="Helvetica Now Display"
                      fontStack="'Helvetica Now Display', 'Helvetica Neue', Helvetica, Arial, sans-serif"
                      samples={[
                        { weightLabel: "Medium", sizeLabel: "32px", text: "Headline", size: 32, lineHeight: 1.2, letterSpacing: "-0.128px" },
                        { weightLabel: "Medium", sizeLabel: "20px", text: "Title", size: 20, lineHeight: 1.3, letterSpacing: "-0.1px" },
                        { weightLabel: "Medium", sizeLabel: "16px", text: "Body", size: 16, lineHeight: 1.5, letterSpacing: "-0.08px" },
                        { weightLabel: "Medium", sizeLabel: "14px", text: "Caption", size: 14, lineHeight: 1.35, letterSpacing: "-0.07px" },
                      ]}
                      fontWeight={500}
                      isMobile={isMobile}
                    />
                    <FontFamilySample
                      familyName="PP Editorial New"
                      fontStack="'PP Editorial New', 'Cambria', Georgia, 'Times New Roman', serif"
                      samples={[
                        { weightLabel: "Regular", sizeLabel: "32px", text: "Extra Large", size: 32, lineHeight: 1.2 },
                        { weightLabel: "Regular", sizeLabel: "28px", text: "Large", size: 28, lineHeight: 1.2 },
                        { weightLabel: "Regular", sizeLabel: "24px", text: "Medium", size: 24, lineHeight: 1.2 },
                        { weightLabel: "Regular", sizeLabel: "20px", text: "Small", size: 20, lineHeight: 1.2 },
                      ]}
                      fontWeight={400}
                      isMobile={isMobile}
                    />
                  </div>
                </div>

                {/* Color */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                  <p style={{ fontFamily: F.base, fontWeight: 500, fontSize: "16px", lineHeight: 1.5, color: C.textMuted, margin: 0 }}>
                    Color
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
                      gap: "12px",
                      width: "100%",
                    }}
                  >
                    <ColorScale
                      name="Primary"
                      mainSwatch={{ bg: "#292929", hex: "#292929", textOnDark: true }}
                      shades={[
                        { bg: "#5F5F5F", hex: "#5F5F5F", textOnDark: true },
                        { bg: "#8A8A8A", hex: "#8A8A8A", textOnDark: false },
                        { bg: "#BCBCBC", hex: "#BCBCBC", textOnDark: false },
                        { bg: "#DFDFDF", hex: "#DFDFDF", textOnDark: false },
                      ]}
                    />
                    <ColorScale
                      name="Secondary"
                      mainSwatch={{ bg: "#FD0084", hex: "#FD0084", textOnDark: false }}
                      shades={[
                        { bg: "#EF5AA0", hex: "#EF5AA0", textOnDark: false },
                        { bg: "#F287BC", hex: "#F287BC", textOnDark: false },
                        { bg: "#F5ACD1", hex: "#F5ACD1", textOnDark: false },
                        { bg: "#FCE4F0", hex: "#FCE4F0", textOnDark: false },
                      ]}
                    />
                    <GradientSwatch
                      name="Gradient"
                      subLabel="Radial"
                      background="radial-gradient(circle at 10% 100%, #FFAC00 0%, #FF9800 34%, #FF6300 52%, #FF4900 60%, #FF2E00 69%, #FF2311 76%, #FF1722 83%, #FF0C34 90%, #FF0045 97%)"
                    />
                    <GradientSwatch
                      name="Gradient"
                      subLabel="Linear"
                      background="linear-gradient(180deg, #F7729D 0%, #FD2D79 35.577%, #FB695A 96.154%, #F3B2A2 100%)"
                    />
                  </div>
                </div>

                {/* Components */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                  <p style={{ fontFamily: F.base, fontWeight: 500, fontSize: "16px", lineHeight: 1.5, color: C.textMuted, margin: 0 }}>
                    Components
                  </p>
                  <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end", width: "100%" }}>
                    <div
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        border: `1px solid ${C.borderDefault}`,
                        borderRadius: "4px",
                        padding: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src="/suno/design-system/components.png"
                        alt="Suno design system component library — buttons, text fields, search, and sheets"
                        style={{ display: "block", width: "100%", height: "auto" }}
                      />
                    </div>
                  </figure>
                </div>
              </div>
            </section>

            {/* Key Solutions section */}
            <section
              id="key-solutions"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                alignItems: "flex-start",
                scrollMarginTop: `${SCROLL_OFFSET}px`,
              }}
            >
              {/* section-label */}
              <div style={{ display: "flex", gap: "10px", alignItems: "center", alignSelf: "stretch" }}>
                <div style={{ width: "6px", alignSelf: "stretch", background: C.textSecondary, flexShrink: 0 }} />
                <p
                  style={{
                    fontFamily: F.label,
                    fontWeight: 700,
                    fontSize: "20px",
                    lineHeight: 1.3,
                    letterSpacing: "0.8px",
                    color: C.textSecondary,
                    textTransform: "uppercase",
                    margin: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  Key Solutions
                </p>
              </div>

              {/* section-body */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
                <h2
                  style={{
                    fontFamily: F.display,
                    fontWeight: 600,
                    fontSize: isMobile ? "24px" : "32px",
                    lineHeight: 1.4,
                    color: C.textPrimary,
                    margin: 0,
                  }}
                >
                  Motivation works better with clear direction
                </h2>
              </div>

              {/* subsection list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "72px", width: "100%" }}>
                {[
                  {
                    label: "Getting Ready to Start",
                    solutions: [
                      {
                        title: "Onboarding",
                        body: "Shows similar users’ examples to make starting feel possible",
                        src: "/suno/key-solutions/onboarding.mov",
                      },
                      {
                        title: "Finding Others’ Prompts",
                        body: "Shows how others wrote prompts, instead of explaining step by step",
                        src: "/suno/key-solutions/finding-others-prompts.mov",
                      },
                    ],
                  },
                  {
                    label: "Creating with Less Thinking",
                    solutions: [
                      {
                        title: "Prompt Helper",
                        body: "Helps users create a prompt by choosing, not writing",
                        src: "/suno/key-solutions/prompt-helper.mov",
                      },
                      {
                        title: "Creation Feedback",
                        body: "Learns from feedback to suggest better results next time",
                        src: "/suno/key-solutions/creation-feedback.mov",
                      },
                    ],
                  },
                ].map(({ label, solutions }) => (
                  <div key={label} style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                    <p style={{ fontFamily: F.base, fontWeight: 500, fontSize: "16px", lineHeight: 1.5, color: C.textMuted, margin: 0 }}>
                      {label}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        padding: "8px 0",
                        width: "100%",
                        flexDirection: isMobile ? "column" : "row",
                        alignItems: isMobile ? "center" : "flex-start",
                      }}
                    >
                      {solutions.map((s) => (
                        <SolutionCard key={s.title} {...s} isMobile={isMobile} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Evaluation section */}
            <section
              id="evaluation"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                alignItems: "flex-start",
                scrollMarginTop: `${SCROLL_OFFSET}px`,
              }}
            >
              {/* section-label */}
              <div style={{ display: "flex", gap: "10px", alignItems: "center", alignSelf: "stretch" }}>
                <div style={{ width: "6px", alignSelf: "stretch", background: C.textSecondary, flexShrink: 0 }} />
                <p
                  style={{
                    fontFamily: F.label,
                    fontWeight: 700,
                    fontSize: "20px",
                    lineHeight: 1.3,
                    letterSpacing: "0.8px",
                    color: C.textSecondary,
                    textTransform: "uppercase",
                    margin: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  Evaluation
                </p>
              </div>

              {/* section-body */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
                <h2
                  style={{
                    fontFamily: F.display,
                    fontWeight: 600,
                    fontSize: isMobile ? "24px" : "32px",
                    lineHeight: 1.4,
                    color: C.textPrimary,
                    margin: 0,
                  }}
                >
                  Clarity turns confusion into confidence
                </h2>
                <p
                  style={{
                    fontFamily: F.base,
                    fontWeight: 400,
                    fontSize: "18px",
                    lineHeight: 1.55,
                    color: C.textPrimary,
                    margin: 0,
                  }}
                >
                  We conducted usability testing to observe how users interact with the redesigned flow and validate whether the emotional and creative journey felt intuitive.
                </p>
              </div>

              {/* subsection list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "48px", width: "100%" }}>
                {/* Usability Test */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                  <p style={{ fontFamily: F.base, fontWeight: 500, fontSize: "16px", lineHeight: 1.5, color: C.textMuted, margin: 0 }}>
                    Usability Test
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
                    <ul style={{ margin: 0, paddingLeft: "24px", listStyle: "disc" }}>
                      {[
                        { label: "Participants", value: "3 first-time users" },
                        { label: "Goal", value: "Validate whether users can follow the designed flows without guidance" },
                        { label: "Method", value: "Task-based usability test + Follow-up interview" },
                        { label: "SUS Score", value: "87.5" },
                      ].map(({ label, value }) => (
                        <li key={label} style={{ fontFamily: F.base, fontSize: "18px", lineHeight: 1.55, color: C.textPrimary }}>
                          <span style={{ fontWeight: 600 }}>{label}</span>
                          <span style={{ fontWeight: 400 }}>: {value}</span>
                        </li>
                      ))}
                    </ul>

                    {/* media row */}
                    <div style={{ display: "flex", gap: "20px", width: "100%", flexDirection: isMobile ? "column" : "row", alignItems: "stretch" }}>
                      {/* UT session — rotated */}
                      <figure style={{ margin: 0, flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end", padding: "8px 0" }}>
                        <div
                          style={{
                            width: "100%",
                            height: "280px",
                            borderRadius: "4px",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img
                            src="/suno/evaluation/ut-session.webp"
                            alt="Task-based usability test session"
                            style={{
                              width: "110%",
                              height: "110%",
                              objectFit: "cover",
                              display: "block",
                              transform: "rotate(-2.34deg)",
                            }}
                          />
                        </div>
                        <figcaption
                          style={{
                            fontFamily: F.base,
                            fontStyle: "italic",
                            fontWeight: 400,
                            fontSize: "14px",
                            lineHeight: 1.55,
                            color: C.textMuted,
                          }}
                        >
                          Task-based usability test session
                        </figcaption>
                      </figure>

                      {/* UT script */}
                      <figure style={{ margin: 0, flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end", padding: "8px 0" }}>
                        <div
                          style={{
                            width: "100%",
                            height: "280px",
                            border: `1px solid ${C.borderDefault}`,
                            borderRadius: "4px",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxSizing: "border-box",
                          }}
                        >
                          <img
                            src="/suno/evaluation/ut-script.png"
                            alt="Follow-up interview transcripts"
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          />
                        </div>
                        <figcaption
                          style={{
                            fontFamily: F.base,
                            fontStyle: "italic",
                            fontWeight: 400,
                            fontSize: "14px",
                            lineHeight: 1.55,
                            color: C.textMuted,
                          }}
                        >
                          Follow-up interview transcripts
                        </figcaption>
                      </figure>
                    </div>
                  </div>
                </div>

                {/* Task-based Evaluation */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                  <p style={{ fontFamily: F.base, fontWeight: 500, fontSize: "16px", lineHeight: 1.5, color: C.textMuted, margin: 0 }}>
                    Task-based Evaluation
                  </p>
                  <p
                    style={{
                      fontFamily: F.base,
                      fontWeight: 400,
                      fontSize: "18px",
                      lineHeight: 1.55,
                      color: C.textPrimary,
                      margin: 0,
                    }}
                  >
                    We evaluated whether users could complete each task as intended, without external guidance.
                  </p>
                  <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end", width: "100%", padding: "8px 0" }}>
                    <div
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        border: `1px solid ${C.borderDefault}`,
                        borderRadius: "4px",
                        padding: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src="/suno/evaluation/task-success-matrix.png"
                        alt="Task success matrix showing completion of each task across participants"
                        style={{ display: "block", width: "100%", height: "auto" }}
                      />
                    </div>
                    <figcaption
                      style={{
                        fontFamily: F.base,
                        fontStyle: "italic",
                        fontWeight: 400,
                        fontSize: "14px",
                        lineHeight: 1.55,
                        color: C.textMuted,
                      }}
                    >
                      Task Success Matrix
                    </figcaption>
                  </figure>
                </div>

                {/* Insights (no subsection label, just two cards) */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                  {[
                    {
                      label: "Insight 1",
                      title: "Users act first and learn by trying things out",
                      body: "Users tapped through the screen first and understood how things worked by seeing what happened after.",
                    },
                    {
                      label: "Insight 2",
                      title: "Clear feedback builds confidence",
                      body: "When users saw clear results after their actions, they felt safe to keep going.",
                    },
                  ].map(({ label, title, body }) => (
                    <InsightCard key={label} label={label} title={title} body={body} />
                  ))}
                </div>

                {/* Iteration */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                  <p style={{ fontFamily: F.base, fontWeight: 500, fontSize: "16px", lineHeight: 1.5, color: C.textMuted, margin: 0 }}>
                    Iteration
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "48px", width: "100%" }}>
                    {[
                      {
                        title: "Starting Creation",
                        beforeSrc: "/suno/evaluation/iteration-starting-before.png",
                        afterSrc: "/suno/evaluation/iteration-starting-after.png",
                        changes: [
                          "Made sample prompts feel clearly tappable.",
                          "We enlarged and repositioned the cards to strengthen visual hierarchy and show that users can tap and try right away.",
                        ],
                      },
                      {
                        title: "Feedback",
                        beforeSrc: "/suno/evaluation/iteration-feedback-before.png",
                        afterSrc: "/suno/evaluation/iteration-feedback-after.png",
                        changes: [
                          "Clarified what happens after selection.",
                          "We replaced the heart icon with “Add to Favorites” and added clear visual feedback to confirm saving.",
                        ],
                      },
                    ].map((iter) => (
                      <IterationBlock key={iter.title} {...iter} isMobile={isMobile} />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Reflection section */}
            <section
              id="reflection"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                alignItems: "flex-start",
                scrollMarginTop: `${SCROLL_OFFSET}px`,
              }}
            >
              {/* section-label */}
              <div style={{ display: "flex", gap: "10px", alignItems: "center", alignSelf: "stretch" }}>
                <div style={{ width: "6px", alignSelf: "stretch", background: C.textSecondary, flexShrink: 0 }} />
                <p
                  style={{
                    fontFamily: F.label,
                    fontWeight: 700,
                    fontSize: "20px",
                    lineHeight: 1.3,
                    letterSpacing: "0.8px",
                    color: C.textSecondary,
                    textTransform: "uppercase",
                    margin: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  Reflection
                </p>
              </div>

              {/* section-body */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
                <h2
                  style={{
                    fontFamily: F.display,
                    fontWeight: 600,
                    fontSize: isMobile ? "24px" : "32px",
                    lineHeight: 1.4,
                    color: C.textPrimary,
                    margin: 0,
                  }}
                >
                  Actions mattered more than guidance.
                </h2>

                {/* Key Takeaways */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                  <p style={{ fontFamily: F.base, fontWeight: 500, fontSize: "16px", lineHeight: 1.5, color: C.textMuted, margin: 0 }}>
                    Key Takeaways
                  </p>
                  {[
                    {
                      title: "Design revealed how users actually behave.",
                      body: "Product discovery helped define the right problems, but design showed how users actually behaved on screen. Users acted first and learned by trying, which made clear actions and immediate feedback more effective than detailed explanations.",
                    },
                    {
                      title: "Design decisions needed to work without explanation.",
                      body: "UI elements had to clearly signal what could be tapped, and every action needed a visible response to help users move forward with confidence.",
                    },
                  ].map(({ title, body }) => (
                    <div key={title} style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
                      <p style={{ fontFamily: F.base, fontWeight: 600, fontSize: "18px", lineHeight: 1.5, color: C.textPrimary, margin: 0 }}>
                        {title}
                      </p>
                      <ul style={{ margin: 0, paddingLeft: "24px", listStyle: "disc" }}>
                        <li style={{ fontFamily: F.base, fontWeight: 400, fontSize: "18px", lineHeight: 1.55, color: C.textPrimary }}>
                          {body}
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function IterationBlock({ title, beforeSrc, afterSrc, changes, isMobile }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
      <p
        style={{
          fontFamily: F.base,
          fontWeight: 600,
          fontSize: "14px",
          lineHeight: 1.4,
          color: C.textSecondary,
          margin: 0,
        }}
      >
        {title}
      </p>

      {/* Before / After */}
      <div
        style={{
          display: "flex",
          gap: isMobile ? "32px" : "64px",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {/* Before — smaller, dimmed */}
        <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
          <img
            src={beforeSrc}
            alt={`${title} before`}
            style={{
              width: isMobile ? "108px" : "148px",
              height: "auto",
              aspectRatio: "148 / 300",
              objectFit: "cover",
              opacity: 0.6,
              display: "block",
            }}
          />
          <figcaption
            style={{
              fontFamily: F.base,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: 1.55,
              color: C.textMuted,
            }}
          >
            Before
          </figcaption>
        </figure>

        {/* After — larger, full opacity */}
        <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
          <img
            src={afterSrc}
            alt={`${title} after`}
            style={{
              width: isMobile ? "148px" : "197px",
              height: "auto",
              aspectRatio: "197 / 400",
              objectFit: "cover",
              display: "block",
            }}
          />
          <figcaption
            style={{
              fontFamily: F.base,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: 1.55,
              color: C.textMuted,
            }}
          >
            After
          </figcaption>
        </figure>
      </div>

      {/* What changed list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
        <p style={{ fontFamily: F.base, fontWeight: 600, fontSize: "18px", lineHeight: 1.5, color: C.textPrimary, margin: 0 }}>
          What changed?
        </p>
        <ul style={{ margin: 0, paddingLeft: "24px", listStyle: "disc" }}>
          {changes.map((change) => (
            <li key={change} style={{ fontFamily: F.base, fontWeight: 400, fontSize: "18px", lineHeight: 1.55, color: C.textPrimary }}>
              {change}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SolutionCard({ title, body, src, isMobile }) {
  return (
    <figure
      style={{
        margin: 0,
        flex: isMobile ? "0 0 auto" : 1,
        minWidth: 0,
        width: isMobile ? "min(260px, 100%)" : "auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "flex-start",
      }}
    >
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "100%",
          aspectRatio: "197 / 400",
          objectFit: "contain",
          display: "block",
        }}
      />
      <figcaption style={{ display: "flex", flexDirection: "column", gap: "8px", paddingLeft: "8px", width: "100%" }}>
        <p
          style={{
            fontFamily: F.base,
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: 1.4,
            color: C.textSecondary,
            margin: 0,
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontFamily: F.base,
            fontWeight: 400,
            fontSize: "18px",
            lineHeight: 1.55,
            color: C.textPrimary,
            margin: 0,
          }}
        >
          {body}
        </p>
      </figcaption>
    </figure>
  );
}

function FontFamilySample({ familyName, fontStack, samples, fontWeight, isMobile }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
      <p
        style={{
          fontFamily: fontStack,
          fontWeight,
          fontSize: "48px",
          lineHeight: "normal",
          letterSpacing: "-1px",
          color: "#1C1B1F",
          margin: 0,
        }}
      >
        {familyName}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          gap: "8px",
          width: "100%",
          paddingBottom: "32px",
        }}
      >
        {samples.map(({ weightLabel, sizeLabel, text, size, lineHeight, letterSpacing }) => (
          <div key={`${familyName}-${sizeLabel}`} style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: 0 }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "center", opacity: 0.6 }}>
              <span style={{ fontFamily: F.base, fontWeight: 400, fontSize: "14px", lineHeight: 1.55, color: C.textSecondary }}>
                {weightLabel}
              </span>
              <span style={{ fontFamily: F.base, fontWeight: 400, fontSize: "14px", lineHeight: 1.55, color: C.textSecondary }}>
                {sizeLabel}
              </span>
            </div>
            <p
              style={{
                fontFamily: fontStack,
                fontWeight,
                fontSize: `${size}px`,
                lineHeight,
                letterSpacing,
                color: "#333333",
                margin: 0,
              }}
            >
              {text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ColorScale({ name, mainSwatch, shades }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }}>
      <div
        style={{
          background: mainSwatch.bg,
          height: "100px",
          borderRadius: "8px",
          overflow: "hidden",
          position: "relative",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <p
          style={{
            fontFamily: F.base,
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: 1.55,
            color: mainSwatch.textOnDark ? "#FFFFFF" : C.textPrimary,
            margin: 0,
          }}
        >
          {name}
        </p>
        <p
          style={{
            fontFamily: F.base,
            fontWeight: 400,
            fontSize: "12px",
            lineHeight: 1.55,
            color: mainSwatch.textOnDark ? "#FFFFFF" : C.textPrimary,
            margin: 0,
          }}
        >
          {mainSwatch.hex}
        </p>
      </div>
      {shades.map(({ bg, hex, textOnDark }) => (
        <div
          key={hex}
          style={{
            background: bg,
            height: "44px",
            borderRadius: "6px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            paddingLeft: "12px",
          }}
        >
          <p
            style={{
              fontFamily: F.base,
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: 1.55,
              color: textOnDark ? "#FFFFFF" : C.textPrimary,
              margin: 0,
            }}
          >
            {hex}
          </p>
        </div>
      ))}
    </div>
  );
}

function GradientSwatch({ name, subLabel, background }) {
  return (
    <div
      style={{
        background,
        borderRadius: "8px",
        overflow: "hidden",
        position: "relative",
        minHeight: "292px",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <p
        style={{
          fontFamily: F.base,
          fontWeight: 500,
          fontSize: "14px",
          lineHeight: 1.55,
          color: C.textPrimary,
          margin: 0,
        }}
      >
        {name}
      </p>
      <p
        style={{
          fontFamily: F.base,
          fontWeight: 400,
          fontSize: "12px",
          lineHeight: 1.55,
          color: C.textPrimary,
          margin: 0,
        }}
      >
        {subLabel}
      </p>
    </div>
  );
}

function WireframeBlock({ title, src, labels, large = false, direction = "row" }) {
  const isColumn = direction === "column";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: large ? "20px" : "10px", flex: 1, minWidth: 0 }}>
      <p
        style={{
          fontFamily: F.base,
          fontWeight: 600,
          fontSize: "14px",
          lineHeight: 1.4,
          color: C.textSecondary,
          margin: 0,
        }}
      >
        {title}
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: isColumn ? "column" : "row",
          gap: isColumn ? "20px" : "16px",
          alignItems: isColumn ? "stretch" : "flex-start",
          width: "100%",
        }}
      >
        <img
          src={src}
          alt={`${title} wireframe`}
          style={{
            width: isColumn ? "100%" : large ? "200px" : "133px",
            height: "auto",
            display: "block",
            flexShrink: 0,
            objectFit: "contain",
          }}
        />
        <ul style={{ margin: 0, padding: "8px 0 0", listStyle: "none", display: "flex", flexDirection: "column", gap: large ? "12px" : "12px" }}>
          {labels.map((label, i) => (
            <li key={label} style={{ display: "flex", gap: large ? "8px" : "6px", alignItems: "center" }}>
              <span
                style={{
                  background: C.accentText,
                  color: C.textInverse,
                  borderRadius: large ? "6px" : "4px",
                  width: large ? "20px" : "16px",
                  height: large ? "20px" : "16px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: F.base,
                  fontWeight: 600,
                  fontSize: large ? "12px" : "10px",
                  lineHeight: 1.2,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  fontFamily: F.base,
                  fontWeight: 400,
                  fontSize: large ? "16px" : "14px",
                  lineHeight: 1.55,
                  color: C.textPrimary,
                }}
              >
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
