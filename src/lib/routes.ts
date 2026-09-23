/** Paths for React Router (basename applied by BrowserRouter). */

export const FORCED_STEPPER_PATH = '/ForcedStepper';

const PLAN_ORIGIN_KEY = 'sex-pistols-tap1.planOrigin';

export function isForcedStepperPath(pathname: string): boolean {
  return pathname.replace(/\/$/, '') === FORCED_STEPPER_PATH;
}

export function rememberPlanOrigin(pathname: string): void {
  const origin = isForcedStepperPath(pathname) ? FORCED_STEPPER_PATH : '/';
  try {
    sessionStorage.setItem(PLAN_ORIGIN_KEY, origin);
  } catch {
    /* ignore */
  }
}

export function planHomePath(): string {
  try {
    if (sessionStorage.getItem(PLAN_ORIGIN_KEY) === FORCED_STEPPER_PATH) {
      return FORCED_STEPPER_PATH;
    }
  } catch {
    /* ignore */
  }
  return '/';
}

export function planPath(hash?: string): string {
  const home = planHomePath();
  return hash ? `${home}#${hash.replace(/^#/, '')}` : home;
}

/** Stacked-category plan. Later this can ship as its own Pages path. */
export function scrollPlanPath(hash?: string): string {
  return hash ? `/scroll#${hash.replace(/^#/, '')}` : '/scroll';
}

/** Fever-style immersive overview + stacked tickets. */
export function immersivePlanPath(hash?: string): string {
  return hash ? `/immersive#${hash.replace(/^#/, '')}` : '/immersive';
}

export function eventPath(eventId: string, hash?: string): string {
  void eventId;
  return planPath(hash ?? 'entry');
}

export function connectPath(eventId: string): string {
  return `/event/${eventId}/connect`;
}

export function checkoutPath(eventId: string): string {
  return `/event/${eventId}/checkout`;
}

export function guestCheckoutPath(eventId: string): string {
  return `/event/${eventId}/guest-checkout`;
}

export function pmrPreBookingPath(eventId: string): string {
  return `/event/${eventId}/pmr-questions`;
}

export function orderConfirmationPath(eventId: string): string {
  return `/event/${eventId}/confirmation`;
}

export function postBookingPath(eventId: string): string {
  return `/event/${eventId}/post-booking`;
}

export function postBookingAbsolutePath(eventId: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const path = `/event/${encodeURIComponent(eventId)}/post-booking`;
  return base ? `${base}${path}` : path;
}

export function orderConfirmationAbsolutePath(eventId: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const path = `/event/${encodeURIComponent(eventId)}/confirmation`;
  return base ? `${base}${path}` : path;
}

export function accountPath(): string {
  return '/account';
}

/** @deprecated use planPath */
export function hubPath(hash?: string): string {
  return planPath(hash);
}
