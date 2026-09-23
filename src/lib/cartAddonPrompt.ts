import {
  PLAN_ADDON_CATEGORIES,
  PLAN_CORE_CATEGORY_IDS,
  findCategoryIdForEntity,
} from '../data/planCatalog';

let lastPathname = '';
let shownThisPlanVisit = false;

export function cartHasTicketsWithoutAddons(items: { entityId: string }[]): boolean {
  const coreIds = new Set<string>(PLAN_CORE_CATEGORY_IDS);
  const addonIds = new Set<string>(PLAN_ADDON_CATEGORIES.map((tab) => tab.id));
  if (addonIds.size === 0) return false;
  let hasTicket = false;
  let hasAddon = false;

  for (const item of items) {
    const categoryId = findCategoryIdForEntity(item.entityId);
    if (!categoryId) continue;
    if (coreIds.has(categoryId)) hasTicket = true;
    if (addonIds.has(categoryId)) hasAddon = true;
  }

  return hasTicket && !hasAddon;
}

function isCheckoutFunnelPath(pathname: string): boolean {
  return pathname.startsWith('/event/');
}

function isPlanHomePath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, '') || '/';
  return path === '/' || path === '/scroll' || path === '/immersive';
}

/** Reset the one-time flag only after a real checkout → plan return. */
export function trackAddonPromptRoute(pathname: string): void {
  if (lastPathname && isCheckoutFunnelPath(lastPathname) && isPlanHomePath(pathname)) {
    shownThisPlanVisit = false;
  }
  lastPathname = pathname;
}

export function hasAddonCheckoutPromptBeenShown(): boolean {
  return shownThisPlanVisit;
}

export function markAddonCheckoutPromptShown(): void {
  shownThisPlanVisit = true;
}
