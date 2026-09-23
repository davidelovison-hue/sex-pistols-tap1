import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findEntity } from '../data/planCatalog';
import { formatCartSelections, useCart, type CartItem } from '../lib/cartContext';
import {
  cartHasTicketsWithoutAddons,
  hasAddonCheckoutPromptBeenShown,
  markAddonCheckoutPromptShown,
} from '../lib/cartAddonPrompt';
import { buildCheckoutFromCart } from '../lib/buildCheckoutFromCart';
import { persistCheckoutBasket } from '../lib/checkoutFlowStorage';
import { connectPath } from '../lib/routes';
import { formatPrice } from '../lib/theme';
import { AddonCheckoutPrompt } from './AddonCheckoutPrompt';
import { AddToCartToast } from './AddToCartToast';
import './CartPanel.css';

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function BackArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function formatSummaryPrice(price: number) {
  return formatPrice(price);
}

function toCartEntity(item: CartItem) {
  return {
    id: item.entityId,
    name: item.name,
    price: item.price,
    type: 'configurable_single' as const,
  };
}

type CartPanelProps = {
  mode: 'desktop' | 'mobile';
  continueInsteadOfCheckout?: boolean;
  onContinue?: () => boolean | void;
  onBack?: () => void;
  onSelectPlanTab?: (tabId: string) => void;
};

export function CartPanel({
  mode,
  continueInsteadOfCheckout = false,
  onContinue,
  onBack,
  onSelectPlanTab,
}: CartPanelProps) {
  const navigate = useNavigate();
  const cartTitleId = useId();
  const { items, setQuantity, removeItem, totalItems, totalPrice } = useCart();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [showAddonPrompt, setShowAddonPrompt] = useState(false);
  const [hideMobileBarForHero, setHideMobileBarForHero] = useState(false);
  const cartBodyRef = useRef<HTMLDivElement | null>(null);
  const [cartHasOverflow, setCartHasOverflow] = useState(false);
  const [cartIsAtBottom, setCartIsAtBottom] = useState(true);

  const closeMobileDrawer = useCallback(() => {
    setIsMobileDrawerOpen(false);
  }, []);

  const updateScrollHint = useCallback(() => {
    const el = cartBodyRef.current;
    if (!el) return;
    const overflow = el.scrollHeight - el.clientHeight > 4;
    setCartHasOverflow(overflow);
    if (!overflow) {
      setCartIsAtBottom(true);
      return;
    }
    const remaining = el.scrollHeight - el.clientHeight - el.scrollTop;
    setCartIsAtBottom(remaining <= 4);
  }, []);

  useEffect(() => {
    if (mode !== 'mobile' || !isMobileDrawerOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMobileDrawer();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [closeMobileDrawer, isMobileDrawerOpen, mode]);

  useEffect(() => {
    updateScrollHint();
  }, [items.length, mode, isMobileDrawerOpen, updateScrollHint]);

  useEffect(() => {
    if (mode !== 'mobile' || items.length === 0) {
      setHideMobileBarForHero(false);
      return;
    }

    const hero = document.querySelector<HTMLElement>('.planHeroSlot--immersive');
    if (!hero) {
      setHideMobileBarForHero(false);
      return;
    }

    const syncHeroVisibility = () => {
      const heroBottom = hero.getBoundingClientRect().bottom;
      const nav = document.querySelector<HTMLElement>('.planStickyNav');
      const navH = nav?.getBoundingClientRect().height ?? 0;
      // Hide while the immersive hero still occupies most of the viewport.
      setHideMobileBarForHero(heroBottom > window.innerHeight - navH - 24);
    };

    syncHeroVisibility();

    const observer = new IntersectionObserver(
      () => syncHeroVisibility(),
      { threshold: [0, 0.15, 0.35, 0.5, 0.75, 1] },
    );
    observer.observe(hero);

    window.addEventListener('scroll', syncHeroVisibility, { passive: true });
    window.addEventListener('resize', syncHeroVisibility);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', syncHeroVisibility);
      window.removeEventListener('resize', syncHeroVisibility);
    };
  }, [items.length, mode]);

  useEffect(() => {
    const el = cartBodyRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => updateScrollHint());
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateScrollHint]);

  const showScrollHint = useMemo(
    () => cartHasOverflow && !cartIsAtBottom,
    [cartHasOverflow, cartIsAtBottom],
  );

  const proceedToCheckout = useCallback(() => {
    const returnHash = window.location.hash.replace(/^#/, '') || 'entry';
    const payload = buildCheckoutFromCart(items, returnHash);
    if (!payload) return;
    persistCheckoutBasket(payload.eventId, payload);
    navigate(connectPath(payload.eventId), { state: payload });
  }, [items, navigate]);

  const handleCheckoutClick = useCallback(() => {
    if (continueInsteadOfCheckout && onContinue) {
      const advanced = onContinue();
      if (advanced !== false) {
        closeMobileDrawer();
        return;
      }
    }
    if (
      onSelectPlanTab &&
      !hasAddonCheckoutPromptBeenShown() &&
      cartHasTicketsWithoutAddons(items)
    ) {
      markAddonCheckoutPromptShown();
      setShowAddonPrompt(true);
      return;
    }
    proceedToCheckout();
  }, [
    closeMobileDrawer,
    continueInsteadOfCheckout,
    items,
    onContinue,
    onSelectPlanTab,
    proceedToCheckout,
  ]);

  const handleAddonTabSelect = useCallback(
    (tabId: string) => {
      setShowAddonPrompt(false);
      closeMobileDrawer();
      onSelectPlanTab?.(tabId);
    },
    [closeMobileDrawer, onSelectPlanTab],
  );

  const handleAddonPromptContinue = useCallback(() => {
    setShowAddonPrompt(false);
    proceedToCheckout();
  }, [proceedToCheckout]);

  const handleAddonPromptDismiss = useCallback(() => {
    setShowAddonPrompt(false);
  }, []);

  const addonPrompt = (
    <AddonCheckoutPrompt
      open={showAddonPrompt}
      onSelectTab={handleAddonTabSelect}
      onContinueCheckout={handleAddonPromptContinue}
      onDismiss={handleAddonPromptDismiss}
    />
  );

  const cartHeader = (showClose = false) => (
    <div className="cartHeader">
      <div className="cartHeaderTitleRow">
        <span className="cartHeaderIcon">
          <CartIcon />
        </span>
        <h2 className="cartTitle" id={showClose ? cartTitleId : undefined}>
          Your Cart
        </h2>
        {showClose ? (
          <button
            type="button"
            className="cartDrawerCloseBtn"
            aria-label="Close cart"
            onClick={closeMobileDrawer}
          >
            ×
          </button>
        ) : null}
      </div>
    </div>
  );

  if (items.length === 0) {
    if (mode !== 'desktop') return null;

    return (
      <aside className="planCartColumn" aria-label="Shopping cart">
        <div className="cartPanelReveal">
          <div className="cartPanel cartPanelFloat cartPanelEmpty" role="complementary">
            {cartHeader()}
            <div className="cartEmptyState">
              <p className="cartEmptyTitle">Your cart is empty</p>
              <p className="cartEmptyHint">Add tickets to get started.</p>
            </div>
          </div>
        </div>
        <AddToCartToast variant="desktop" />
      </aside>
    );
  }

  const cartList = (
    <ul className="cartList">
      {items.map((item) => {
        const variantText = formatCartSelections(item.selections);
        const maxQuantity = findEntity(item.entityId)?.maxQuantity ?? 99;

        return (
          <li key={item.key} className="ticketCard">
            <div className="ticketInfo">
              <div className="ticketInfoTop">
                <div className="ticketName">{item.name}</div>
                {variantText ? <p className="ticketVariants">{variantText}</p> : null}
              </div>
              <div className="ticketPriceBlock">
                <div className="ticketLineTotal">{formatSummaryPrice(item.price * item.quantity)}</div>
              </div>
            </div>
            <div className="ticketStub">
              <div className="cartQtyTheme cartQty" aria-label={`Quantity for ${item.name}`}>
                {item.quantity > 1 ? (
                  <button
                    type="button"
                    className="cartQtyBtnMinus"
                    aria-label={`Decrease quantity for ${item.name}`}
                    onClick={() =>
                      setQuantity(toCartEntity(item), item.quantity - 1, item.selections)
                    }
                  >
                    −
                  </button>
                ) : (
                  <button
                    type="button"
                    className="ticketTrashBtn"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => removeItem(item.entityId, item.selections)}
                  >
                    <TrashIcon />
                  </button>
                )}
                <span className="cartQtyValue">{item.quantity}</span>
                <button
                  type="button"
                  className="cartQtyBtnPlus"
                  aria-label={`Increase quantity for ${item.name}`}
                  disabled={item.quantity >= maxQuantity}
                  onClick={() =>
                    setQuantity(
                      toCartEntity(item),
                      Math.min(maxQuantity, item.quantity + 1),
                      item.selections,
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );

  const cartSummary = (
    <div className="cartSummary">
      <span className="cartSummaryItems">
        {totalItems} item{totalItems === 1 ? '' : 's'}
      </span>
      <span className="cartSummaryTotal">{formatSummaryPrice(totalPrice)}</span>
    </div>
  );

  const checkoutButton = (
    <button type="button" className="cartCheckoutBtn" onClick={handleCheckoutClick}>
      {continueInsteadOfCheckout ? 'Continue' : 'Go to checkout'}
    </button>
  );

  const checkoutRow = (
    <div className={onBack ? 'cartCheckout cartCheckout--withBack' : 'cartCheckout'}>
      {onBack ? (
        <button type="button" className="cartBackBtn" aria-label="Back" onClick={onBack}>
          <BackArrowIcon />
        </button>
      ) : null}
      {checkoutButton}
    </div>
  );

  if (mode === 'desktop') {
    return (
      <>
      <aside className="planCartColumn" aria-label="Shopping cart">
        <div className="cartPanelReveal">
          <div className="cartPanel cartPanelFloat" role="complementary">
            {cartHeader()}
            <div
              ref={cartBodyRef}
              className={showScrollHint ? 'cartBody cartBodyHint' : 'cartBody'}
              aria-label="Cart items"
              onScroll={updateScrollHint}
            >
              {cartList}
              {showScrollHint ? (
                <div className="cartBodyMore" aria-hidden="true">
                  <span className="cartBodyMoreText">More tickets below</span>
                  <span className="cartBodyMoreArrow">⌄</span>
                </div>
              ) : null}
            </div>
            <div className="cartFooter" aria-label="Cart summary and checkout">
              {showScrollHint ? <div className="cartScrollHint">Scroll to see more tickets</div> : null}
              {cartSummary}
              {checkoutRow}
            </div>
          </div>
        </div>
        <AddToCartToast variant="desktop" />
      </aside>
      {addonPrompt}
      </>
    );
  }

  return (
    <>
      {!isMobileDrawerOpen ? (
        <div
          className={`cartMobileBar${hideMobileBarForHero ? ' cartMobileBar--heroImmersive' : ''}${onBack ? ' cartMobileBar--withBack' : ''}`}
          role="region"
          aria-label="Cart actions"
          aria-hidden={hideMobileBarForHero}
        >
          <button
            type="button"
            className="cartMobileTrigger"
            aria-label={`View cart, ${totalItems} item${totalItems === 1 ? '' : 's'}, ${formatPrice(totalPrice)} total`}
            onClick={() => setIsMobileDrawerOpen(true)}
          >
            <span className="cartMobileTriggerIconWrap">
              <span className="cartMobileTriggerIcon" aria-hidden="true">
                <CartIcon />
              </span>
              <span className="cartMobileTriggerBadge" aria-hidden="true">
                {totalItems}
              </span>
            </span>
            <span className="cartMobileTriggerPrice">{formatPrice(totalPrice)}</span>
          </button>
          {onBack ? (
            <button type="button" className="cartMobileBackBtn" aria-label="Back" onClick={onBack}>
              <BackArrowIcon />
            </button>
          ) : null}
          <button type="button" className="cartMobileCheckoutPill" onClick={handleCheckoutClick}>
            {continueInsteadOfCheckout ? 'Continue' : 'Go to checkout'}
          </button>
        </div>
      ) : null}

      {isMobileDrawerOpen ? (
        <>
          <button
            type="button"
            className="cartMobileBackdrop"
            aria-label="Close cart"
            onClick={closeMobileDrawer}
          />
          <div
            className="cartMobileDrawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={cartTitleId}
          >
            <div className="cartMobileDrawerPanel cartPanel">
              {cartHeader(true)}
              <div className="cartMobileDrawerBody cartBody">
                <div
                  ref={cartBodyRef}
                  className={showScrollHint ? 'cartMobileDrawerScroll cartBodyHint' : 'cartMobileDrawerScroll'}
                  onScroll={updateScrollHint}
                >
                  {cartList}
                  {showScrollHint ? (
                    <div className="cartBodyMore" aria-hidden="true">
                      <span className="cartBodyMoreText">More tickets below</span>
                      <span className="cartBodyMoreArrow">⌄</span>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="cartFooter">
                {showScrollHint ? <div className="cartScrollHint">Scroll to see more tickets</div> : null}
                {cartSummary}
                {checkoutRow}
              </div>
            </div>
          </div>
        </>
      ) : null}
      {addonPrompt}
    </>
  );
}
