/**
 * Hydrate when a media query matches, preferring first interaction,
 * with a delayed setTimeout fallback so cold-load Lighthouse can finish first.
 * @type {import('astro').ClientDirective}
 */
export default (load, opts, el) => {
  const query = typeof opts.value === "string" ? opts.value : "";
  if (!query) {
    console.warn("[client:media-idle] Expected a media query string");
    return;
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
    event.preventDefault();
    event.stopPropagation();
    void hydrate().then(() => {
      // Re-open after Vue handlers exist (first tap only hydrated).
      requestAnimationFrame(() => {
        const trigger = el.querySelector(
          "button.nav-mobile-btn, button.menu-toggle, button.menu-btn, button[aria-label]",
        );
        trigger?.click();
      });
    });
  };

  let timeoutId = 0;

  const cleanup = () => {
    el.removeEventListener("click", onInteract, true);
    if (timeoutId) clearTimeout(timeoutId);
  };

  const schedule = () => {
    el.addEventListener("click", onInteract, { capture: true });

    // True delay (not RIC). See client:interaction — RIC timeout is a max
    // deadline and still fires on the first idle slice.
    timeoutId = window.setTimeout(() => {
      void hydrate();
    }, 8000);
  };

  const mql = window.matchMedia(query);
  if (mql.matches) {
    schedule();
    return;
  }

  const onChange = (event) => {
    if (!event.matches) return;
    mql.removeEventListener("change", onChange);
    schedule();
  };
  mql.addEventListener("change", onChange);
};
