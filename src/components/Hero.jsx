import HeadlineSvg from './HeadlineSvg.jsx';
import headlineDesigned from '../assets/hero-headline-designed.svg';
import headlineTo from '../assets/hero-headline-to.svg';
import headlineFunction from '../assets/hero-headline-function.svg';
import './Hero.css';

export default function Hero({ children }) {
  return (
    <section className="hero-wrapper" data-name="section/hero" data-node-id="14:25">
      {children}

      <div className="hero-content">
        <p className="hero-copyright" data-node-id="14:26">
          © Nayun Park. All rights reserved.
        </p>

        <div className="hero-intro" data-node-id="14:27">
          <p className="hero-intro-text">
            I'm Nayun Park — A curious and thoughtful product designer connects<br />
            systems, stories, creative energy and coherence.
          </p>
        </div>

        <div className="hero-headline hero-headline--desktop" data-name="hero/headline" data-node-id="14:28">
          <HeadlineSvg />
        </div>

        <div
          className="hero-headline hero-headline--mobile"
          data-name="hero/headline-mobile"
          data-node-id="341:13429"
          aria-hidden="true"
        >
          <img
            className="hero-headline-word hero-headline-word--designed"
            src={headlineDesigned}
            alt=""
          />
          <img
            className="hero-headline-word hero-headline-word--to"
            src={headlineTo}
            alt=""
          />
          <img
            className="hero-headline-word hero-headline-word--function"
            src={headlineFunction}
            alt=""
          />
        </div>
      </div>
    </section>
  );
}
