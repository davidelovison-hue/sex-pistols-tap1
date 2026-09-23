import { useEffect, useId, useRef } from 'react';
import { PLAN_CORE_STEP_IDS, PLAN_STEPS } from '../data/planCatalog';
import './AddonCheckoutPrompt.css';

type AddonCheckoutPromptProps = {
  open: boolean;
  onSelectTab: (tabId: string) => void;
  onContinueCheckout: () => void;
  onDismiss: () => void;
};

export function AddonCheckoutPrompt({
  open,
  onSelectTab,
  onContinueCheckout,
  onDismiss,
}: AddonCheckoutPromptProps) {
  const titleId = useId();
  const firstOptionRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timeoutId = window.setTimeout(() => firstOptionRef.current?.focus(), 40);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timeoutId);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onDismiss]);

  if (!open) return null;

  return (
    <div className="addonCheckoutPrompt" role="presentation">
      <button
        type="button"
        className="addonCheckoutPrompt__backdrop"
        aria-label="Close"
        onClick={onDismiss}
      />
      <div
        className="addonCheckoutPrompt__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h2 id={titleId} className="addonCheckoutPrompt__title">
          Want to add merch or transportation?
        </h2>
        <div className="addonCheckoutPrompt__options">
          {PLAN_STEPS.filter((step) => !PLAN_CORE_STEP_IDS.includes(step.id)).map((step, index) => (
            <button
              key={step.id}
              ref={index === 0 ? firstOptionRef : undefined}
              type="button"
              className="addonCheckoutPrompt__option"
              onClick={() => onSelectTab(step.id)}
            >
              {step.title}
            </button>
          ))}
        </div>
        <button type="button" className="addonCheckoutPrompt__skip" onClick={onContinueCheckout}>
          No thanks, continue to checkout
        </button>
      </div>
    </div>
  );
}
