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

/** Sex Pistols feat. Frank Carter, plus support still to be announced. */
export const FESTIVAL_ARTISTS: FestivalArtist[] = [
  artist('sex-pistols', 'Sex Pistols', `${BASE}artist-sex-pistols.svg`),
  artist('frank-carter', 'Frank Carter', `${BASE}artist-frank-carter.svg`),
  artist('steve-jones', 'Steve Jones', `${BASE}artist-steve-jones.svg`),
  artist('paul-cook', 'Paul Cook', `${BASE}artist-paul-cook.svg`),
  artist('glen-matlock', 'Glen Matlock', `${BASE}artist-glen-matlock.svg`),
  artist('support', 'Support TBA', `${BASE}artist-support.svg`),
];
