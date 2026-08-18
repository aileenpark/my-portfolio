import "./Footer.css";

const ASSETS = {
  logo: "/about/footer-logo.svg",
  instagram: "/about/instagram.svg",
  linkedin: "/about/linkedin.svg",
  mail: "/about/mail.svg",
};

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    icon: ASSETS.instagram,
    href: "https://www.instagram.com/nayuningg/",
  },
  {
    label: "LinkedIn",
    icon: ASSETS.linkedin,
    href: "https://www.linkedin.com/in/nayuningg",
  },
  {
    label: "e-mail",
    icon: ASSETS.mail,
    href: "mailto:nypark115@gmail.com",
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__message">
          Got something messy?
          <br />
          I’m into it.
        </p>

        <div className="site-footer__details">
          <div className="site-footer__brand">
            <img className="site-footer__logo" src={ASSETS.logo} alt="" />
            <span className="site-footer__name">Nayun Park</span>
          </div>

          <nav className="site-footer__socials" aria-label="Social links">
            {SOCIAL_LINKS.map(({ label, icon, href }) => (
              <a className="site-footer__social-link" href={href} key={label}>
                <img src={icon} alt="" />
                <span>{label}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
