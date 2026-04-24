import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './DigitalCard.css';
import logoUrl from '../assets/logo.svg';

/* ── Sub-components ── */

function Logo({ color = '#fff' }) {
    return (
        <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
            <path
                d="M23.5497 4.2002C28.603 4.2002 32.6999 8.29638 32.7001 13.3496C32.7001 18.403 28.6031 22.5 23.5497 22.5C21.3935 22.4999 19.4133 21.7517 17.8495 20.5039V31.7998H14.4003V18.75L6.15027 9L6.29968 31.7998H2.99988V4.34961H7.04968L14.4052 13.1465C14.5134 8.1872 18.5645 4.20037 23.5497 4.2002ZM23.5497 7.5C20.3681 7.50018 17.781 10.0403 17.703 13.2031L17.7001 13.2002V16.7998C18.5139 17.5953 18.9742 17.8803 19.7997 18.2998C20.576 18.6943 21.0466 18.8784 21.9003 19.0498C22.2407 19.1181 22.691 19.1551 23.035 19.1758C23.2046 19.1906 23.3763 19.2002 23.5497 19.2002C26.7805 19.2002 29.4003 16.5805 29.4003 13.3496C29.4001 10.1189 26.7804 7.5 23.5497 7.5Z"
                fill={color}
            />
        </svg>
    );
}

function ContactRow({ label, value, onCopy, copied, link }) {
    const handleClick = (e) => {
        e.stopPropagation();
        if (link) {
            window.open(link, '_blank', 'noopener,noreferrer');
        } else {
            onCopy(value);
        }
    };

    return (
        <div className="dc-contact-row" onClick={handleClick}>
            <span className="dc-c-label">{label}</span>
            <span className="dc-c-val">{value}</span>
            {link ? (
                <span className="dc-c-action">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    OPEN
                </span>
            ) : (
                <span className={`dc-c-action ${copied ? 'done' : ''}`}>
                    {copied ? (
                        <>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                            DONE
                        </>
                    ) : 'COPY'}
                </span>
            )}
        </div>
    );
}

/* ── Card ── */

function Card() {
    const [flipped, setFlipped] = useState(false);
    const [copied, setCopied] = useState(null);

    const handleCopy = useCallback((val) => {
        navigator.clipboard.writeText(val).catch(() => { });
        setCopied(val);
        setTimeout(() => setCopied(null), 1800);
    }, []);

    return (
        <div className="dc-card-scene" onClick={() => setFlipped(f => !f)}>
            <div className={`dc-card-inner ${flipped ? 'flipped' : ''}`}>

                {/* ── FRONT ── */}
                <div className="dc-card-face">
                    <div className="dc-front">
                        <div className="dc-front-header">
                            <Logo color="#fff" />
                            <span className="dc-flip-hint">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                    <path d="M1 4v6h6M23 20v-6h-6" />
                                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                                </svg>
                                tap card
                            </span>
                        </div>

                        <div className="dc-front-body">
                            <div className="dc-front-text">
                                <div className="dc-name">Nayun<span className="dc-comma"> ,</span></div>
                                <div className="dc-line-regular"><span className="dc-a">a</span> designer</div>
                                <div className="dc-line-regular">who</div>
                                <div className="dc-connects-row">
                                    <span className="dc-connects">connects</span>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.6" className="dc-arrow">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="dc-front-footer">
                            <div className="dc-ftr-item">
                                <span className="dc-ftr-label">Based in</span>
                                <span className="dc-ftr-val">Seoul, KR</span>
                            </div>
                            <div className="dc-ftr-item">
                                <span className="dc-ftr-label">Discipline</span>
                                <span className="dc-ftr-val">Product / Systems</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── BACK ── */}
                <div className="dc-card-face dc-card-back-face">
                    <div className="dc-back">
                        <div className="dc-back-header">
                            <span className="dc-role-tag">Product Designer</span>
                            <Logo color="#2B2AFF" />
                        </div>

                        <div className="dc-name-block">
                            <span className="dc-name-kr">박나윤</span>
                            <span className="dc-name-en">Nayun Park</span>
                        </div>

                        <div className="dc-contact-list">
                            <ContactRow label="EMAIL" value="nypark115@gmail.com" onCopy={handleCopy} copied={copied === 'nypark115@gmail.com'} />
                            <ContactRow label="MOBILE" value="010.9239.2387" onCopy={handleCopy} copied={copied === '010.9239.2387'} />
                            <ContactRow label="WEB" value="nayunpark.me" onCopy={handleCopy} copied={copied === 'nayunpark.me'} link="https://nayunpark.me" />
                        </div>

                        <div className="dc-tagline-zone">
                            <div className="dc-tagline-continues">← connects</div>
                            <div>
                                <span className="dc-tagline-word">
                                    systems, <em className="dc-tagline-em">stories</em>
                                </span>
                                <span className="dc-tagline-word">
                                    <span className="dc-and">and </span>creative energy.
                                </span>
                            </div>
                        </div>

                        <div className="dc-back-footer">
                            <button className="dc-save-btn" onClick={e => e.stopPropagation()}>
                                ↓ Save Contact
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

/* ── Modal wrapper ── */

export default function DigitalCard({ trigger }) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // Lock body scroll when open
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    return (
        <>
            {/* Trigger — clone the passed element and attach onClick */}
            {trigger
                ? React.cloneElement(trigger, { onClick: () => setOpen(true) })
                : (
                    <button className="dc-default-trigger" onClick={() => setOpen(true)}>
                        디지털 명함
                    </button>
                )
            }

            {/* Overlay — portal to document.body so it escapes nav/header stacking context */}
            {ReactDOM.createPortal(
                <div
                    className={`dc-overlay ${open ? 'visible' : ''}`}
                    onClick={() => setOpen(false)}
                >
                    <button
                        className="dc-overlay-close"
                        onClick={(e) => { e.stopPropagation(); setOpen(false); }}
                        aria-label="닫기"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                    <div className="dc-card-wrapper" onClick={e => e.stopPropagation()}>
                        <Card />
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
