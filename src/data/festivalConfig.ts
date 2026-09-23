/**
 * Event branding and copy for Sex Pistols feat. Frank Carter at TAP1.
 * Facts and ticket inventory follow the United Tickets listing.
 */

export type PlanCategory = {
  id: string;
  title: string;
};

export const PLAN_CATEGORIES: PlanCategory[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'entry', title: 'Tickets' },
  { id: 'merch', title: 'Merch' },
  { id: 'shuttle', title: 'Transportation' },
];

/** Default plan tab (tickets). */
export const DEFAULT_PLAN_TAB = 'entry';

const BASE = import.meta.env.BASE_URL;

export const HERO_GRID_IMAGES = [
  `${BASE}event-crowd.svg`,
  `${BASE}event-stage.svg`,
  `${BASE}event-hall.svg`,
  `${BASE}venue-tap1.svg`,
] as const;

export const GALLERY_IMAGES = [
  {
    src: `${BASE}event-poster.svg`,
    alt: 'Sex Pistols feat. Frank Carter at TAP1, Copenhagen',
  },
  {
    src: HERO_GRID_IMAGES[0],
    alt: 'Sex Pistols at TAP1',
  },
  {
    src: HERO_GRID_IMAGES[1],
    alt: 'Show night at TAP1',
  },
  {
    src: HERO_GRID_IMAGES[2],
    alt: 'TAP1, København S',
  },
  {
    src: HERO_GRID_IMAGES[3],
    alt: 'TAP1, Prags Boulevard 47',
  },
];

// Mixkit free clip, 1080p: festival stage with moving lights and a crowd. Not this lineup.
export const FESTIVAL_HERO_VIDEO = `${BASE}hero-stage.mp4`;

export const FESTIVAL_MEDIA_HERO = {
  video: FESTIVAL_HERO_VIDEO,
  videoPoster: `${BASE}artist-sex-pistols.jpg`,
  grid: HERO_GRID_IMAGES,
};

export const GALLERY_IMAGE_URLS = GALLERY_IMAGES.map((image) => image.src);

export const POSTER_IMAGE = `${BASE}event-poster.svg`;

export const AVATAR_URL = `${BASE}event-logo.svg`;

export const VENUE_IMAGE = `${BASE}venue-tap1.svg`;

export const HERO_KICKER = 'Official ticketing platform';

export const HERO_FACTS = [
  { label: 'Date', value: '28 Nov' },
  { label: 'Doors', value: '18:30' },
  { label: 'Starts', value: '20:00' },
  { label: 'City', value: 'København' },
] as const;

export const LINEUP_TITLE = 'Lineup';
export const LINEUP_HINT = 'Saturday 28 November 2026';

export const IMMERSIVE_EXPECT = [
  'SEX PISTOLS (Steve Jones, Paul Cook, Glen Matlock) take over TAP1 in Copenhagen on 28 November 2026 for the band’s first Danish concert in 30 years.',
  'The night marks 50 years since Sex Pistols set fire to the musical landscape. On 26 November it is exactly 50 years since Anarchy In The UK was released. Tickets from kr. 790,00.',
] as const;

export const IMMERSIVE_HIGHLIGHT_CARDS = [
  {
    title: 'First Danish concert in 30 years',
    text: 'Steve Jones, Paul Cook and Glen Matlock at TAP1. The band has played Denmark only twice before, in 1977 and in 1996.',
    image: `${BASE}event-poster.svg`,
  },
  {
    title: '50 years of Anarchy In The UK',
    text: 'In 1976 the song landed like a cultural bomb. Fifty years later the songs are still here, with Frank Carter out front.',
    image: `${BASE}event-stage.svg`,
  },
  {
    title: 'Frank Carter up front',
    text: 'Steve Jones calls the current live band a well-oiled machine, with Frank Carter getting the crowd going on songs written 50 years ago.',
    image: `${BASE}event-crowd.svg`,
  },
  {
    title: 'The songs, live',
    text: 'Anarchy In The UK, God Save The Queen, Pretty Vacant and Holidays In The Sun. Support from young British punk bands, to be announced.',
    image: `${BASE}event-hall.svg`,
  },
] as const;

export const IMMERSIVE_DAY_STEPS = [
  {
    title: 'Doors at 18:30',
    text: 'Saturday 28 November 2026 at TAP1, København S. Insläpp 18:30.',
    tone: 'violet' as const,
  },
  {
    title: 'Show starts at 20:00',
    text: 'Sex Pistols feat. Frank Carter. Support from young British punk bands will be announced.',
    tone: 'orange' as const,
  },
  {
    title: 'A historic night',
    text: 'Fifty years after Anarchy In The UK changed the landscape, there is still something to rebel against.',
    tone: 'blue' as const,
  },
] as const;

export const IMMERSIVE_FAQS = [
  {
    q: 'What tickets are on sale?',
    a: 'STANDARD kr. 790,00 (ticket price kr. 745,00), up to 10 per order. KØRESTOLSBILLET kr. 790,00 (ticket price kr. 745,00), up to 2 per order. LEDSAGERBILLET kr. 0,00 is issued by contacting Fan Care, and only a limited number are available.',
  },
  {
    q: 'What is included in the price?',
    a: 'The ticket price is set by the organisers. The total is the ticket price plus the booking fee. That fee covers United Tickets service costs. The fee note on the listing says these charges are per transaction, not per ticket.',
  },
  {
    q: 'What time do doors open?',
    a: 'Doors at 18:30. The show starts at 20:00 on Saturday 28 November 2026.',
  },
  {
    q: 'How do I get a companion ticket?',
    a: 'LEDSAGERBILLET is kr. 0,00 and is not sold in the quantity selector. Companion tickets for other disabilities are issued by contacting Fan Care. Only a limited number are available.',
  },
  {
    q: 'Where is the venue?',
    a: 'TAP1, Prags Boulevard 47, 2300 København S.',
  },
  {
    q: 'When did tickets go on sale?',
    a: 'The official sale started on 17 September via UnitedTickets.dk.',
  },
] as const;

export const OVERVIEW_INFO = [
  {
    icon: '📅',
    label: 'Date',
    text: 'Saturday 28 November 2026. Doors 18:30. Show starts 20:00.',
  },
  {
    icon: '📍',
    label: 'Location',
    text: 'TAP1, Prags Boulevard 47, 2300 København S',
  },
  {
    icon: '🎫',
    label: 'Tickets',
    text: 'STANDARD and KØRESTOLSBILLET kr. 790,00 (ticket price kr. 745,00). LEDSAGERBILLET kr. 0,00 via Fan Care.',
  },
  {
    icon: '🎸',
    label: 'Lineup',
    text: 'Sex Pistols (Steve Jones, Paul Cook, Glen Matlock) feat. Frank Carter. Support to be announced.',
  },
];

export const FESTIVAL_CURRENCY = {
  locale: 'da-DK',
  currency: 'DKK',
} as const;

export const FESTIVAL_COPY = {
  intro:
    'SEX PISTOLS (Steve Jones, Paul Cook, Glen Matlock) take over TAP1 in Copenhagen on 28 November 2026 for the band’s first Danish concert in 30 years. The concert marks 50 years since Sex Pistols set fire to the musical landscape and became a defining force in punk history. On 26 November it is exactly 50 years since Anarchy In The UK was released.',
  introCta: 'Tickets from kr. 790,00.',
  ticketTabs:
    'STANDARD kr. 790,00 (ticket price kr. 745,00), up to 10. KØRESTOLSBILLET kr. 790,00 (ticket price kr. 745,00), up to 2. LEDSAGERBILLET kr. 0,00 by contacting Fan Care.',
  supportEmail: 'www.UnitedTickets.dk',
  privacyUrl:
    'https://billet.unitedtickets.dk/event/sex-pistols-feat-frank-carter/tap1/3715855?lang=sv-SE',
  officialSiteUrl:
    'https://billet.unitedtickets.dk/event/sex-pistols-feat-frank-carter/tap1/3715855?lang=sv-SE',
  officialSiteLabel: 'UnitedTickets.dk',
  marketingBrand: 'United Tickets',
  venue: {
    name: 'TAP1',
    text: 'TAP1, København S. Sex Pistols feat. Frank Carter play here on 28 November 2026. The band has visited Denmark only twice before, in 1977 and in 1996.',
  },
  gettingThere: {
    name: 'TAP1',
    address: 'TAP1\nPrags Boulevard 47\n2300 København S',
    mapQuery: 'TAP1, Prags Boulevard 47, 2300 København S',
  },
  accessibility:
    'KØRESTOLSBILLET is kr. 790,00 (ticket price kr. 745,00), maximum 2 per order. LEDSAGERBILLET is kr. 0,00 and is issued by contacting Fan Care. Only a limited number of companion tickets for other disabilities are available.',
} as const;
