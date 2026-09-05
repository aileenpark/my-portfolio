import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "../components/Header";
import MosaicTextReveal from "../components/MosaicTextReveal";
import "./WorksPage.css";

gsap.registerPlugin(ScrollTrigger);

const WORKS = [
  {
    id: "covercut",
    name: "Covercut",
    summary: "AI Mixing Experience Redesign",
    tags: ["AI", "Music", "UX Renewal"],
    image: "/works-thumbnail/my-music-studio.webp",
    href: "/works/ai-mix-renewal",
    status: "shipped",
  },
  {
    id: "my-music-studio",
    name: "My Music Studio",
    summary: "Admin CMS & Internal Tools",
    tags: ["Internal Tool", "System Design"],
    image: "/works-thumbnail/mms-admin.webp",
    href: "/works/mms-admin",
    status: "shipped",
  },
  {
    id: "suno",
    name: "Suno",
    summary: "AI Music Creation App Revamp",
    tags: ["AI", "Music", "Product Design"],
    image: "/works-thumbnail/suno.webp",
    href: "/works/suno",
  },
  {
    id: "hey-mood",
    name: "Hey Mood",
    summary: "Teenager Mental Healthcare App",
    tags: ["AI", "Mental Healthcare", "Product Design"],
    image: "/works-thumbnail/hey-mood.webp",
    status: "coming-soon",
  },
  {
    id: "ecolab",
    name: "Ecolab",
    summary: "Responsive Website Revamp",
    tags: ["B2B", "Web", "Product Design"],
    image: "/works-thumbnail/ecolab.webp",
    status: "coming-soon",
  },
  {
    id: "vibe-review",
    name: "Vibe Review",
    summary: "AI Code Review Tool",
    tags: ["AI", "Web", "Product Design"],
    image: "/works-thumbnail/vibe-review.webp",
    imageWidth: 2880,
    imageHeight: 1620,
    status: "coming-soon",
  },
];

const STATUS_LABELS = {
  shipped: "SHIPPED",
  "coming-soon": "COMING SOON",
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

function useCardStackReveal(containerRef) {
  useLayoutEffect(() => {
    const container = containerRef.current;

    if (
      !container ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray("[data-works-card]", container);

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 72, scale: 0.985 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 94%",
              end: "top 68%",
              scrub: 0.55,
            },
          },
        );
      });
    }, container);

    return () => ctx.revert();
  }, [containerRef]);
}

function useStackCompletion(containerRef) {
  useLayoutEffect(() => {
    const container = containerRef.current;
    const main = container?.querySelector(".works-page__main");
    const title = container?.querySelector(".works-page__title-shell");
    const cards = container
      ? gsap.utils.toArray("[data-works-card]", container)
      : [];
    const lastCard = cards.at(-1);

    if (!container || !main || !title || !lastCard) {
      return undefined;
    }

    const getStickyTop = () =>
      Number.parseFloat(
        window
          .getComputedStyle(container)
          .getPropertyValue("--works-card-sticky-top"),
      ) || 0;

    const syncStackExit = () => {
      const stickyTop = getStickyTop();
      const lastCardTop = lastCard.getBoundingClientRect().top;
      const exitOffset = Math.min(0, lastCardTop - stickyTop);

      container.style.setProperty(
        "--works-title-exit-y",
        `${exitOffset}px`,
      );
      container.classList.toggle(
        "is-stack-complete",
        lastCardTop <= stickyTop + 0.5,
      );
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: main,
        start: "top bottom",
        end: "bottom top",
        onUpdate: syncStackExit,
        onRefresh: syncStackExit,
        invalidateOnRefresh: true,
      });
    }, container);

    return () => {
      container.classList.remove("is-stack-complete");
      container.style.removeProperty("--works-title-exit-y");
      ctx.revert();
    };
  }, [containerRef]);
}

function WorkTags({ tags }) {
  return (
    <div className="works-card__tags" aria-label="Project categories">
      {tags.map((tag) => (
        <span className="works-card__tag" key={tag}>
          {tag}
        </span>
      ))}
    </div>
  );
}

function WorkCard({ project, index }) {
  const isComingSoon = project.status === "coming-soon";
  const statusLabel = STATUS_LABELS[project.status] ?? null;

  const content = (
    <>
      <div
        className={`works-card__thumbnail${isComingSoon ? " is-coming-soon" : ""}`}
      >
        <img
          src={project.image}
          alt=""
          width={project.imageWidth ?? 5760}
          height={project.imageHeight ?? 3240}
          loading={index === 0 ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : "auto"}
        />
        {statusLabel && (
          <span
            className={`works-card__status works-card__status--${project.status}`}
          >
            {statusLabel}
          </span>
        )}
      </div>

      <div className="works-card__details">
        <div className="works-card__meta">
          <h2>{project.name}</h2>
          <p>{project.summary}</p>
        </div>
        <WorkTags tags={project.tags} />
      </div>
    </>
  );

  if (project.href) {
    return (
      <Link
        className="works-card works-card--link"
        to={project.href}
        aria-label={`View ${project.name}: ${project.summary}`}
        data-works-card
        style={{ "--works-card-index": index }}
      >
        {content}
      </Link>
    );
  }

  return (
    <article
      className="works-card"
      data-works-card
      style={{ "--works-card-index": index }}
    >
      {content}
    </article>
  );
}

export default function WorksPage() {
  const pageRef = useRef(null);
  const titleRef = useRef(null);

  useScrollable();
  useCardStackReveal(pageRef);
  useStackCompletion(pageRef);

  return (
    <div className="works-page" ref={pageRef}>
      <Header />

      <main className="works-page__main">
        <div className="works-page__title-shell">
          <h1 ref={titleRef} className="works-page__title">
            <span data-mosaic-text>Selected works</span>
            <span className="works-page__title-space"> </span>
            <br className="works-page__title-break" />
            <span data-mosaic-text>across digital experiences.</span>
          </h1>
          <MosaicTextReveal name="works-title-reveal" titleRef={titleRef} />
        </div>

        <section className="works-grid" aria-label="Selected works">
          {WORKS.map((project, index) => (
            <WorkCard project={project} index={index} key={project.id} />
          ))}
        </section>
      </main>
    </div>
  );
}
