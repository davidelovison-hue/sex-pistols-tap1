import { GALLERY_IMAGES } from './festivalConfig';

export type FestivalArtist = {
  id: string;
  name: string;
  image: string;
  fallbackImage: string;
  day?: string;
};

const BASE = import.meta.env.BASE_URL;

export const LINEUP_FALLBACK_IMAGE = GALLERY_IMAGES[0]?.src ?? `${BASE}event-poster.svg`;

function artist(id: string, name: string, image: string): FestivalArtist {
  return { id, name, image, fallbackImage: LINEUP_FALLBACK_IMAGE };
}

/**
 * Live photos from Tons of Rock, Oslo, 2025.
 * Birgit Fostervold, CC BY-SA 4.0, via Wikimedia Commons.
 * Support is still unannounced, so that card stays a placeholder.
 */
export const FESTIVAL_ARTISTS: FestivalArtist[] = [
  artist('sex-pistols', 'Sex Pistols', `${BASE}artist-sex-pistols.jpg`),
  artist('frank-carter', 'Frank Carter', `${BASE}artist-frank-carter.jpg`),
  artist('steve-jones', 'Steve Jones', `${BASE}artist-steve-jones.jpg`),
  artist('paul-cook', 'Paul Cook', `${BASE}artist-paul-cook.jpg`),
  artist('glen-matlock', 'Glen Matlock', `${BASE}artist-glen-matlock.jpg`),
  artist('support', 'Support TBA', `${BASE}artist-support.svg`),
];
