import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import MosaicTextReveal from "../components/MosaicTextReveal";
import "./WorksPage.css";

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
      >
        {content}
      </Link>
    );
  }

  return <article className="works-card">{content}</article>;
}

export default function WorksPage() {
  const titleRef = useRef(null);

  useScrollable();

  return (
    <div className="works-page">
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
