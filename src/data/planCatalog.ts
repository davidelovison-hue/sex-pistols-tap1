/**
 * Sex Pistols feat. Frank Carter at TAP1.
 * Inventory matches the United Tickets listing: STANDARD, KØRESTOLSBILLET, LEDSAGERBILLET.
 */
import { formatPrice } from '../lib/formatPrice';

export type VariantAxis = {
  id: string;
  label: string;
  options: string[];
  disabledOptions?: string[];
  defaultOption?: string;
};

export type PlanEntity = {
  id: string;
  name: string;
  price: number;
  type: 'configurable_single' | 'configurable_multi' | 'composite';
  variantAxes?: VariantAxis[];
  optionPrices?: Record<string, number>;
  date?: string;
  listingTag?: 'SELLING FAST' | 'SOLD OUT' | 'LIMITED';
  description?: string;
  includedItems?: string[];
  cardPreviewBullets?: string[];
  requires?: string[];
  displaySummary?: boolean;
  pricingMode?: 'dynamic';
  hideImage?: boolean;
  /** Maximum selectable quantity. The listing caps STANDARD at 10 and KØRESTOLSBILLET at 2. */
  maxQuantity?: number;
  /** Companion tickets are listed at kr. 0,00 and issued by contacting the venue. */
  purchaseMode?: 'online' | 'contact';
};

export type PlanGroup = {
  id: string;
  title: string;
  entities: PlanEntity[];
};

export type PlanCategory = {
  id: string;
  title: string;
  contentMode?: 'overview';
  cardLayout?: 'equalRow';
  groups: PlanGroup[];
};

export const ENTRY_TICKET_IDS = [
  'ticket-standard',
  'ticket-wheelchair',
  'ticket-companion',
] as const;

const TICKET_PRICE = 745;
const TICKET_TOTAL = 790;

export const PLAN_CATALOG: PlanCategory[] = [
  {
    id: 'overview',
    title: 'Overview',
    contentMode: 'overview',
    groups: [],
  },
  {
    id: 'entry',
    title: 'Tickets',
    groups: [
      {
        id: 'tickets',
        title: 'Choose your ticket',
        entities: [
          {
            id: 'ticket-standard',
            name: 'STANDARD',
            price: TICKET_TOTAL,
            type: 'configurable_single',
            maxQuantity: 10,
            description:
              'Total kr. 790,00. Ticket price kr. 745,00 plus booking fee. Valid for 1 person. Up to 10 per order.',
            cardPreviewBullets: [
              `Ticket price kr. ${TICKET_PRICE},00`,
              'Up to 10 per order',
            ],
            includedItems: ['1× STANDARD admission', 'Booking fee included in kr. 790,00'],
          },
          {
            id: 'ticket-wheelchair',
            name: 'KØRESTOLSBILLET',
            price: TICKET_TOTAL,
            type: 'configurable_single',
            listingTag: 'LIMITED',
            maxQuantity: 2,
            description:
              'Wheelchair ticket. Total kr. 790,00. Ticket price kr. 745,00 plus booking fee. Up to 2 per order.',
            cardPreviewBullets: [
              `Ticket price kr. ${TICKET_PRICE},00`,
              'Up to 2 per order',
            ],
            includedItems: ['1× wheelchair ticket', 'Booking fee included in kr. 790,00'],
          },
          {
            id: 'ticket-companion',
            name: 'LEDSAGERBILLET',
            price: 0,
            type: 'configurable_single',
            purchaseMode: 'contact',
            maxQuantity: 0,
            description:
              'kr. 0,00. Contact the venue for tickets. Companion tickets for other disabilities are issued by contacting Fan Care. Only a limited number are available.',
            cardPreviewBullets: ['kr. 0,00', 'Contact Fan Care'],
            includedItems: ['Companion ticket issued by Fan Care'],
          },
        ],
      },
    ],
  },
];

const BASE = import.meta.env.BASE_URL;

export const DEFAULT_TICKET_IMAGE = `${BASE}ticket-standard.svg`;

export const ENTITY_IMAGES: Record<string, string> = {
  'ticket-standard': `${BASE}ticket-standard.svg`,
  'ticket-wheelchair': `${BASE}ticket-wheelchair.svg`,
  'ticket-companion': `${BASE}ticket-companion.svg`,
};

export const ENTITY_GALLERIES: Record<string, string[]> = {};

export function getEntityImages(entityId: string): string[] {
  if (ENTITY_GALLERIES[entityId]) return ENTITY_GALLERIES[entityId];
  if (ENTITY_IMAGES[entityId]) return [ENTITY_IMAGES[entityId]];
  return [DEFAULT_TICKET_IMAGE];
}

export function findEntity(entityId: string): PlanEntity | undefined {
  for (const category of PLAN_CATALOG) {
    for (const group of category.groups) {
      const entity = group.entities.find((item) => item.id === entityId);
      if (entity) return entity;
    }
  }
  return undefined;
}

export const PLAN_CORE_CATEGORY_IDS = ['entry'] as const;

export const PLAN_ADDON_CATEGORIES: { id: string; label: string }[] = [];

export type PlanStepId = 'entry' | 'merch' | 'addons' | 'shuttle';

export type PlanStep = {
  id: PlanStepId;
  title: string;
  categoryIds: string[];
};

export const PLAN_CORE_STEP_IDS: PlanStepId[] = ['entry'];

export const DEFAULT_PLAN_STEP: PlanStepId = 'entry';

export const PLAN_STEPS: PlanStep[] = [
  { id: 'entry', title: 'Tickets', categoryIds: ['entry'] },
];

const CATEGORY_TO_STEP: Record<string, PlanStepId> = {
  entry: 'entry',
  merch: 'merch',
  addons: 'addons',
  shuttle: 'shuttle',
  tickets: 'entry',
  abonos: 'entry',
  extra: 'addons',
};

const HASH_TO_STEP: Record<string, PlanStepId> = {
  ...CATEGORY_TO_STEP,
  pass: 'entry',
  'entry-pass': 'entry',
  ga: 'entry',
  vip: 'entry',
  tshirt: 'merch',
  tees: 'merch',
  bar: 'addons',
  cashless: 'addons',
  'top-up': 'addons',
  bus: 'shuttle',
  navette: 'shuttle',
  paris: 'shuttle',
};

export function getPlanStep(stepId: string): PlanStep | undefined {
  return PLAN_STEPS.find((step) => step.id === stepId);
}

export function getPlanStepIndex(stepId: string): number {
  const index = PLAN_STEPS.findIndex((step) => step.id === stepId);
  return index >= 0 ? index : 0;
}

export function getCategoriesForStep(stepId: string): PlanCategory[] {
  const step = getPlanStep(stepId);
  if (!step) return [];
  return PLAN_CATALOG.filter((category) => step.categoryIds.includes(category.id));
}

export function shouldPrefixCategory(
  categories: PlanCategory[],
  category: PlanCategory,
  activeStepTitle?: string,
): boolean {
  return categories.length > 1 && category.title !== activeStepTitle;
}

export function formatCarouselTitle(
  categoryTitle: string,
  groupTitle: string,
  prefix: boolean,
): string {
  return prefix && groupTitle !== categoryTitle ? `${categoryTitle} - ${groupTitle}` : groupTitle;
}

export function getStepIdFromHash(hash: string): PlanStepId {
  return HASH_TO_STEP[hash] ?? DEFAULT_PLAN_STEP;
}

export function isPlanStepId(id: string): id is PlanStepId {
  return PLAN_STEPS.some((step) => step.id === id);
}

export function findCategoryIdForEntity(entityId: string): string | undefined {
  for (const category of PLAN_CATALOG) {
    for (const group of category.groups) {
      if (group.entities.some((item) => item.id === entityId)) return category.id;
    }
  }
  return undefined;
}

export function getEntityUnitPrice(
  entity: PlanEntity,
  selections: Record<string, string> = {},
): number {
  const prices = entity.optionPrices;
  if (prices) {
    const preferredKeys = ['option', 'camping', 'size', 'wave', 'day', 'weekend', 'route'];
    for (const key of preferredKeys) {
      const value = selections[key];
      if (value && prices[value] != null) return prices[value];
    }

    for (const value of Object.values(selections)) {
      if (value && prices[value] != null) return prices[value];
    }
  }

  return entity.price;
}

export function formatEntityPrice(price: number): string {
  return formatPrice(price);
}
