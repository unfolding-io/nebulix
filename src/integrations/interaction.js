/**
 * Hydrate on first click on the island host, with a long idle fallback
 * so cold-load Lighthouse can finish before Vue chrome downloads.
 * @type {import('astro').ClientDirective}
 */
export default (load, opts, el) => {
  const raw = opts?.value;
  let timeout = 8000;
  if (typeof raw === "number" && Number.isFinite(raw)) {
    timeout = raw;
  } else if (typeof raw === "string" && raw !== "" && Number.isFinite(Number(raw))) {
    timeout = Number(raw);
  } else if (raw && typeof raw === "object" && Number.isFinite(raw.timeout)) {
    timeout = raw.timeout;
  }

  let started = false;

  const hydrate = async () => {
    if (started) return;
    started = true;
    cleanup();
    const run = await load();
    await run();
  };

  const onInteract = (event) => {
    if (started) return;
    const target = event.target;
    event.preventDefault();
    event.stopPropagation();
    void hydrate().then(() => {
      // Re-fire after Vue handlers exist (first tap only hydrated).
      requestAnimationFrame(() => {
        const clickable =
          target instanceof Element
            ? target.closest('button, a, [role="button"]')
            : null;
        clickable?.click();
      });
    });
  };

  let idleId = 0;
  let timeoutId = 0;

  const cleanup = () => {
    el.removeEventListener("click", onInteract, true);
    if (idleId && "cancelIdleCallback" in window) {
      cancelIdleCallback(idleId);
    }
    if (timeoutId) clearTimeout(timeoutId);
  };

  el.addEventListener("click", onInteract, { capture: true });

  if ("requestIdleCallback" in window) {
    idleId = requestIdleCallback(() => {
      void hydrate();
    }, { timeout });
  } else {
    timeoutId = window.setTimeout(() => {
      void hydrate();
    }, timeout);
  }
};
