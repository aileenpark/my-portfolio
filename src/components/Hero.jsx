import React from 'react';
import './Hero.css';
import headlineUrl from '../assets/headline.svg';

export default function Hero() {
    return (
        <section className="hero-wrapper" data-name="section/hero" data-node-id="14:25">
            <div className="hero-content">
                <p className="hero-copyright" data-node-id="14:26">
                    © Nayun Park. All rights reserved.
                </p>

                <div className="hero-intro" data-node-id="14:27">
                    <p className="hero-intro-text">I’m Nayun Park — A curious and thoughtful product designer connects<br />systems, stories, creative energy and coherence.</p>
                </div>

                <div className="hero-headline" data-name="hero/headline" data-node-id="14:28">
                    <img alt="Designed to Function" className="headline-img" src={headlineUrl} />
                </div>
            </div>
        </section>
    );
}
