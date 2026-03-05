import React from 'react';
import './Works.css';

const projects = [
    {
        id: 1,
        title: 'Project One',
        category: 'Product Design',
        year: '2024',
        description: 'A brief description of the project and the role played in it.',
        tags: ['UX Research', 'Interaction Design', 'Systems'],
    },
    {
        id: 2,
        title: 'Project Two',
        category: 'Design Systems',
        year: '2024',
        description: 'A brief description of the project and the role played in it.',
        tags: ['Design System', 'Component Library', 'Figma'],
    },
    {
        id: 3,
        title: 'Project Three',
        category: 'Product Design',
        year: '2023',
        description: 'A brief description of the project and the role played in it.',
        tags: ['User Research', 'Prototyping', 'Visual Design'],
    },
    {
        id: 4,
        title: 'Project Four',
        category: 'UX Strategy',
        year: '2023',
        description: 'A brief description of the project and the role played in it.',
        tags: ['Strategy', 'Information Architecture', 'Testing'],
    },
];

export default function Works() {
    return (
        <section className="works-wrapper" id="works" data-name="section/works" data-node-id="16:46">
            <div className="works-inner">
                {/* Section header */}
                <div className="works-header">
                    <span className="works-label">Works</span>
                    <span className="works-count">({projects.length})</span>
                </div>

                {/* Project list */}
                <ul className="works-list">
                    {projects.map((project, index) => (
                        <li key={project.id} className="works-item">
                            <div className="works-item-index">{String(index + 1).padStart(2, '0')}</div>
                            <div className="works-item-main">
                                <div className="works-item-meta">
                                    <span className="works-item-category">{project.category}</span>
                                    <span className="works-item-year">{project.year}</span>
                                </div>
                                <h2 className="works-item-title">{project.title}</h2>
                                <p className="works-item-description">{project.description}</p>
                                <ul className="works-item-tags">
                                    {project.tags.map((tag) => (
                                        <li key={tag} className="works-item-tag">{tag}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="works-item-arrow">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
