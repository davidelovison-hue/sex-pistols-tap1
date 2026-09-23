import { GALLERY_IMAGES, POSTER_IMAGE } from '../data/festivalConfig';

export const FESTIVAL_EVENT_ID = 'sex-pistols-tap1-2026';

export const FESTIVAL_LOGO_SRC = `${import.meta.env.BASE_URL}event-logo.svg`;

export const FESTIVAL_EVENT = {
  id: FESTIVAL_EVENT_ID,
  title: 'Sex Pistols feat. Frank Carter',
  image: GALLERY_IMAGES[0]?.src ?? POSTER_IMAGE,
  venue: 'TAP1, København S',
  dateLine: 'Saturday 28 November 2026',
};

export function getFestivalEvent(eventId: string) {
  if (eventId === FESTIVAL_EVENT_ID) return FESTIVAL_EVENT;
  return null;
}
