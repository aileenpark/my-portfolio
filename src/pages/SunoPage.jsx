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
                      <ImageCard src="/suno/discover/affinity-session.mov" caption="Team affinity mapping session" video />
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
          </div>
        </div>
      </main>
    </div>
  );
}
