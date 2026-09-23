import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  FESTIVAL_COPY,
  FESTIVAL_MEDIA_HERO,
  GALLERY_IMAGE_URLS,
  IMMERSIVE_DAY_STEPS,
  IMMERSIVE_EXPECT,
  IMMERSIVE_FAQS,
  IMMERSIVE_HIGHLIGHT_CARDS,
  VENUE_IMAGE,
} from '../data/festivalConfig';
import { FestivalGalleryModal } from './FestivalGalleryModal';
import './ImmersiveOverview.css';

const SECTION_NAV = [
  { id: 'description-1', label: 'Overview' },
  { id: 'highlights-1', label: 'Highlights' },
  { id: 'gallery-1', label: 'Gallery' },
  { id: 'how-it-works-1', label: 'On the day' },
  { id: 'venue-1', label: 'Venue' },
  { id: 'faqs-1', label: 'FAQs' },
] as const;

function SectionHeader({
  overline,
  title,
  titleHref,
}: {
  overline: string;
  title: string;
  titleHref?: string;
}) {
  return (
    <header className="fvHead">
      <h2 className="fvHead__title">
        <span className="fvHead__overline">{overline}</span>
        {titleHref ? (
          <a className="fvHead__link" href={titleHref} target="_blank" rel="noopener noreferrer">
            {title}
          </a>
        ) : (
          title
        )}
      </h2>
    </header>
  );
}

function ReadMore({ children, lines }: { children: ReactNode; lines: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`fvReadMore ${open ? 'fvReadMore--open' : ''}`}>
      <div className="fvReadMore__content" style={{ ['--max-lines' as string]: String(lines) }}>
        <div className="fvReadMore__inner">{children}</div>
      </div>
      <button
        type="button"
        className="fvReadMore__btn"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{open ? 'Read less' : 'Read more'}</span>
        <svg width="12" height="12" viewBox="0 0 512 512" aria-hidden="true">
          {open ? (
            <path
              fill="currentColor"
              d="M273 111c-9.4-9.4-24.6-9.4-33.9 0L47 303c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l175-175 175 175c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9L273 111z"
            />
          ) : (
            <path
              fill="currentColor"
              d="M239 401c9.4 9.4 24.6 9.4 33.9 0L465 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-175 175L81 175c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9L239 401z"
            />
          )}
        </svg>
      </button>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="7.25" stroke="#fff" strokeWidth="1.9" />
      <path d="M12 8.2v4.1l2.8 1.7" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChairIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden="true">
      <path
        fill="#fff"
        d="M8 5.2c0-.7.6-1.2 1.2-1.2h5.6c.7 0 1.2.5 1.2 1.2V11H8V5.2Zm-1.8 6.3h11.6v1.7H6.2v-1.7Zm2 1.7v5.2h1.6v-5.2H8.2Zm6 0v5.2h1.6v-5.2H14.2ZM6.4 18.2h4.2v1.4H6.4v-1.4Zm7 0h4.2v1.4H13.4v-1.4Z"
      />
    </svg>
  );
}

function MusicIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden="true">
      <path
        fill="#fff"
        d="M9.6 16.7V7.4l8.2-1.8v9.3a2.55 2.55 0 1 1-1.8-2.44V8.05L11.4 9.3v7.4a2.55 2.55 0 1 1-1.8-2.44Z"
      />
    </svg>
  );
}

const STEP_ICONS = {
  violet: <ClockIcon />,
  orange: <ChairIcon />,
  blue: <MusicIcon />,
} as const;

function PinIcon() {
  return (
    <svg viewBox="0 0 384 512" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M352 192c0-88.4-71.6-160-160-160S32 103.6 32 192c0 15.6 5.4 37 16.6 63.4c10.9 25.9 26.2 54 43.6 82.1c34.1 55.3 74.4 108.2 99.9 140c25.4-31.8 65.8-84.7 99.9-140c17.3-28.1 32.7-56.3 43.6-82.1C346.6 229 352 207.6 352 192zm32 0c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0S384 86 384 192zm-240 0a48 48 0 1 0 96 0 48 48 0 1 0 -96 0zm48 80a80 80 0 1 1 0-160 80 80 0 1 1 0 160z"
      />
    </svg>
  );
}

function AccessIcon() {
  return (
    <svg viewBox="0 0 512 512" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M176 32a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm0 80A56 56 0 1 0 176 0a56 56 0 1 0 0 112zm-32.4 96c-2-8.6-10.5-14-19.1-12.1C53.2 212.1 0 275.8 0 352c0 88.4 71.6 160 160 160c69.7 0 128.9-44.5 150.9-106.7c2.9-8.3-1.4-17.5-9.8-20.4s-17.5 1.4-20.4 9.8C263.1 444.4 215.7 480 160 480C89.3 480 32 422.7 32 352c0-60.9 42.5-111.9 99.5-124.8c8.6-2 14-10.5 12.1-19.1zm56-51.6c-2-8.6-10.5-14-19.1-12.1s-14 10.5-12.1 19.1l34.3 151.1c5 21.9 24.4 37.4 46.8 37.4H358.1l59.6 119.2c1.9 3.8 5.2 6.7 9.3 8s8.4 1 12.2-.9l64-32c7.9-4 11.1-13.6 7.2-21.5s-13.6-11.1-21.5-7.2l-49.7 24.8L386.7 337.7c-5.4-10.8-16.5-17.7-28.6-17.7H249.5c-7.5 0-13.9-5.2-15.6-12.5L215 224H352c8.8 0 16-7.2 16-16s-7.2-16-16-16H207.7l-8.1-35.5z"
      />
    </svg>
  );
}

export function ImmersiveOverview() {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(SECTION_NAV[0].id);
  const navRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const visibleFaqs = showAllFaqs ? IMMERSIVE_FAQS : IMMERSIVE_FAQS.slice(0, 3);

  const galleryThumbs = useMemo(() => {
    const images = GALLERY_IMAGE_URLS.filter((src) => src !== FESTIVAL_MEDIA_HERO.videoPoster);
    const lead = FESTIVAL_MEDIA_HERO.video
      ? [{ kind: 'video' as const, src: FESTIVAL_MEDIA_HERO.videoPoster, video: FESTIVAL_MEDIA_HERO.video }]
      : [{ kind: 'image' as const, src: FESTIVAL_MEDIA_HERO.videoPoster }];
    return [...lead, ...images.map((src) => ({ kind: 'image' as const, src }))];
  }, []);

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(FESTIVAL_COPY.gettingThere.mapQuery)}`;
  const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(FESTIVAL_COPY.gettingThere.mapQuery)}&z=14&output=embed&hl=en`;

  useEffect(() => {
    const nodes = SECTION_NAV.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (nodes.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0.1, 0.35, 0.6] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const bar = navRef.current;
    const indicator = indicatorRef.current;
    if (!bar || !indicator) return;
    const active = bar.querySelector<HTMLElement>(`[data-nav-id="${activeSection}"]`);
    if (!active) return;
    indicator.style.width = `${active.offsetWidth}px`;
    indicator.style.transform = `translateX(${active.offsetLeft}px)`;
  }, [activeSection]);

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  const jumpTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="fvOverview">
      <nav className="fvNavTabs" aria-label="Experience sections">
        <div className="fvNavTabs__bar" ref={navRef}>
          <div className="fvNavTabs__scroll">
            {SECTION_NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                data-nav-id={item.id}
                className={`fvNavTabs__tab${activeSection === item.id ? ' fvNavTabs__tab--active' : ''}`}
                onClick={() => jumpTo(item.id)}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <span className="fvNavTabs__indicator" ref={indicatorRef} aria-hidden="true" />
        </div>
      </nav>

      <div className="fvSections">
        <div id="description-1" className="fvBlock">
          <section className="fvSection">
            <SectionHeader overline="In short" title="What to expect" />
            <div className="fvExpect">
              <ReadMore lines={4}>
                {IMMERSIVE_EXPECT.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </ReadMore>
            </div>
          </section>
        </div>

        <div id="highlights-1" className="fvBlock">
          <section className="fvSection">
            <SectionHeader overline="Experience highlights" title="The experience" />
            <div className="fvHighlights">
              <ul className="fvHighlights__list">
                {IMMERSIVE_HIGHLIGHT_CARDS.map((card) => (
                  <li key={card.title} className="fvHighlights__item">
                    <article className="fvHighlight">
                      <div className="fvHighlight__image">
                        <img src={card.image} alt={card.title} />
                      </div>
                      <div className="fvHighlight__caption">
                        <h3 className="fvHighlight__title">{card.title}</h3>
                        <p className="fvHighlight__desc">{card.text}</p>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <div id="gallery-1" className="fvBlock">
          <section className="fvGallerySection">
            <div className="fvGalleryCard">
              <SectionHeader overline="Gallery" title="Experience the show" />
              <div className="fvGalleryBody">
                <ul className="fvGallery">
                  {galleryThumbs.map((item, index) => (
                    <li key={item.src}>
                      <button
                        type="button"
                        className="fvGallery__btn"
                        aria-label="Gallery"
                        onClick={() => openGallery(index)}
                      >
                        {item.kind === 'video' ? (
                          <video
                            className="fvGallery__video"
                            muted
                            playsInline
                            loop
                            preload="none"
                            poster={item.src}
                            src={item.video}
                            aria-hidden="true"
                          />
                        ) : (
                          <img src={item.src} alt="" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>

        <div id="how-it-works-1" className="fvBlock">
          <section className="fvSection">
            <SectionHeader overline="On the day" title="How it works" />
            <ol className="fvSteps">
              {IMMERSIVE_DAY_STEPS.map((step) => (
                <li key={step.title}>
                  <div className="fvStep">
                    <div className={`fvStep__picture fvStep__picture--${step.tone}`}>{STEP_ICONS[step.tone]}</div>
                    <div className="fvStep__content">
                      <p className="fvStep__title">{step.title}</p>
                      <p className="fvStep__desc">{step.text}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div id="venue-1" className="fvBlock">
          <section className="fvVenueSection">
            <SectionHeader overline="About the venue" title={FESTIVAL_COPY.venue.name} titleHref={mapsUrl} />
            <div className="fvVenueBody">
              <div className="fvVenueHighlight">
                <div className="fvVenueHighlight__image">
                  <img src={VENUE_IMAGE} alt={FESTIVAL_COPY.venue.name} />
                </div>
                <div className="fvVenueHighlight__caption">
                  <ReadMore lines={6}>
                    <p>{FESTIVAL_COPY.venue.text}</p>
                  </ReadMore>
                </div>
              </div>
              <div className="fvVenueList">
                <div className="fvVenueMap">
                  <iframe
                    title="Venue location map"
                    src={mapEmbed}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <ul className="fvVenueFacts">
                  <li className="fvVenueFact">
                    <span className="fvVenueFact__icon">
                      <PinIcon />
                    </span>
                    <span className="fvVenueFact__content">
                      <p className="fvVenueFact__label">Address</p>
                      <p className="fvVenueFact__value">{FESTIVAL_COPY.gettingThere.address.replace(/\n/g, ', ')}</p>
                    </span>
                  </li>
                  <li className="fvVenueFact">
                    <span className="fvVenueFact__icon">
                      <AccessIcon />
                    </span>
                    <span className="fvVenueFact__content">
                      <p className="fvVenueFact__label">Accessibility</p>
                      <p className="fvVenueFact__value">{FESTIVAL_COPY.accessibility}</p>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <div id="faqs-1" className="fvBlock">
          <section className="fvSection">
            <SectionHeader overline="FAQs" title="Got questions? We've got answers" />
            <div className="fvFaqs">
              <div className="fvFaqs__list">
                {visibleFaqs.map((item, index) => (
                  <div key={item.q} className="fvFaqs__item">
                    <details className="fvFaq" open={index === 0}>
                      <summary className="fvFaq__dt">
                        <span className="fvFaq__q">{item.q}</span>
                        <span className="fvFaq__icon" aria-hidden="true">
                          <svg width="14" height="14" viewBox="0 0 448 512">
                            <path
                              fill="currentColor"
                              d="M241 337c-9.4 9.4-24.6 9.4-33.9 0L47 177c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l143 143L367 143c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L241 337z"
                            />
                          </svg>
                        </span>
                      </summary>
                      <div className="fvFaq__answerWrap">
                        <p className="fvFaq__a">{item.a}</p>
                      </div>
                    </details>
                  </div>
                ))}
              </div>
              {!showAllFaqs && IMMERSIVE_FAQS.length > 3 ? (
                <button type="button" className="fvReadMore__btn fvReadMore__btn--underline" onClick={() => setShowAllFaqs(true)}>
                  <span>See all {IMMERSIVE_FAQS.length} questions</span>
                  <svg width="12" height="12" viewBox="0 0 512 512" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M239 401c9.4 9.4 24.6 9.4 33.9 0L465 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-175 175L81 175c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9L239 401z"
                    />
                  </svg>
                </button>
              ) : null}
            </div>
          </section>
        </div>
      </div>

      {galleryOpen ? (
        <FestivalGalleryModal
          images={GALLERY_IMAGE_URLS}
          alt={FESTIVAL_COPY.venue.name}
          videoSrc={FESTIVAL_MEDIA_HERO.video}
          videoPoster={FESTIVAL_MEDIA_HERO.videoPoster}
          initialIndex={galleryIndex}
          onClose={() => setGalleryOpen(false)}
        />
      ) : null}
    </div>
  );
}
