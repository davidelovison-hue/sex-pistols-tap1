import { useMemo, useState, type MouseEvent } from 'react';
import {
  FESTIVAL_MEDIA_HERO,
  GALLERY_IMAGE_URLS,
  GALLERY_IMAGES,
  HERO_FACTS,
  HERO_KICKER,
} from '../data/festivalConfig';
import { findEntity } from '../data/planCatalog';
import { FESTIVAL_EVENT } from '../lib/festivalEvent';
import { formatPrice } from '../lib/formatPrice';
import {
  buildGalleryItems,
  FestivalGalleryModal,
  galleryIndexForSrc,
} from './FestivalGalleryModal';
import './FestivalGallery.css';

function GalleryIcon() {
  return (
    <span className="eventMediaHero__galleryIcon" aria-hidden>
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

function GalleryButton({
  className,
  onClick,
}: {
  className: string;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button type="button" className={className} onClick={onClick}>
      <GalleryIcon />
      Gallery
    </button>
  );
}

type FestivalGalleryProps = {
  onBuyTickets?: () => void;
};

export function FestivalGallery({ onBuyTickets }: FestivalGalleryProps) {
  const config = FESTIVAL_MEDIA_HERO;
  const alt = GALLERY_IMAGES[0]?.alt ?? FESTIVAL_EVENT.title;
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  const galleryItems = useMemo(
    () => buildGalleryItems(GALLERY_IMAGE_URLS, config.video, config.videoPoster),
    [config.video, config.videoPoster],
  );
  const fromPrice = formatPrice(findEntity('ticket-standard')?.price ?? 790);

  const canOpenGallery = galleryItems.length > 0;

  const openGalleryAt = (index: number) => {
    if (!canOpenGallery) return;
    const i = Math.min(Math.max(0, index), galleryItems.length - 1);
    setGalleryStartIndex(i);
    setGalleryOpen(true);
  };

  return (
    <>
      <section className="festivalGalleryBand" aria-label="Festival media">
        <div className="eventMediaHero eventMediaHero--immersive">
          <div className="eventMediaHero__main">
            {config.video ? (
              <video
                className="eventMediaHero__video"
                src={config.video}
                poster={config.videoPoster}
                muted
                playsInline
                loop
                autoPlay
                preload="auto"
                aria-label={`${alt} video`}
              />
            ) : (
              <img
                className="eventMediaHero__video"
                src={config.videoPoster}
                alt={alt}
              />
            )}
            {canOpenGallery ? (
              <button
                type="button"
                className="eventMediaHero__mediaOpen"
                aria-label="Open gallery at video"
                onClick={() => openGalleryAt(0)}
              />
            ) : null}
            <div className="eventMediaHero__scrim" aria-hidden />
            <div className="eventMediaHero__overlay">
              <p className="eventMediaHero__exclusive">{HERO_KICKER}</p>
              <h1 className="eventMediaHero__title">{FESTIVAL_EVENT.title}</h1>
              <div className="eventMediaHero__metaRow">
                <p className="eventMediaHero__venue">{FESTIVAL_EVENT.venue}</p>
              </div>
              <div className="eventMediaHero__footer">
                <ul className="eventMediaHero__facts" aria-label="Event highlights">
                  {HERO_FACTS.map((fact) => (
                    <li key={fact.label} className="eventMediaHero__fact">
                      <span className="eventMediaHero__factLabel">{fact.label}</span>
                      <span className="eventMediaHero__factValue">{fact.value}</span>
                    </li>
                  ))}
                </ul>
                {onBuyTickets ? (
                  <div className="eventMediaHero__cta">
                    <p className="eventMediaHero__from">
                      <span className="eventMediaHero__fromLabel">From</span>
                      <span className="eventMediaHero__fromPrice">{fromPrice}</span>
                    </p>
                    <button
                      type="button"
                      className="eventMediaHero__buyBtn"
                      onClick={onBuyTickets}
                    >
                      Get tickets
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
            {canOpenGallery ? (
              <GalleryButton
                className="eventMediaHero__galleryBtn eventMediaHero__galleryBtn--onVideo"
                onClick={(e) => {
                  e.stopPropagation();
                  openGalleryAt(0);
                }}
              />
            ) : null}
            <div className="eventMediaHero__progress" aria-hidden>
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          {config.grid.map((src, index) => (
            <div key={`${src}-${index}`} className="eventMediaHero__cellWrap">
              <button
                type="button"
                className="eventMediaHero__cell"
                disabled={!canOpenGallery}
                aria-label={`Open gallery, image ${index + 1}`}
                onClick={() => openGalleryAt(galleryIndexForSrc(galleryItems, src))}
              >
                <img
                  className="eventMediaHero__img"
                  src={src}
                  alt=""
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </button>
              {index === 3 && canOpenGallery ? (
                <GalleryButton
                  className="eventMediaHero__galleryBtn eventMediaHero__galleryBtn--onTile"
                  onClick={(e) => {
                    e.stopPropagation();
                    openGalleryAt(galleryIndexForSrc(galleryItems, src));
                  }}
                />
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {galleryOpen && canOpenGallery ? (
        <FestivalGalleryModal
          images={GALLERY_IMAGE_URLS}
          alt={alt}
          videoSrc={config.video}
          videoPoster={config.videoPoster}
          initialIndex={galleryStartIndex}
          onClose={() => setGalleryOpen(false)}
        />
      ) : null}
    </>
  );
}
