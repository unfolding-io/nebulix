import type PhotoSwipeLightbox from "photoswipe/lightbox";

const instances = new Set<PhotoSwipeLightbox>();
let listening = false;
let modulePromise: Promise<typeof import("photoswipe/lightbox")> | null = null;
let stylesReady: Promise<void> | null = null;

function destroyAll() {
  for (const instance of instances) {
    instance.destroy();
  }
  instances.clear();
  document.querySelectorAll<HTMLElement>("[data-pswp-bound]").forEach((el) => {
    delete el.dataset.pswpBound;
  });
}

function ensureStyles() {
  if (stylesReady) return stylesReady;
  stylesReady = (async () => {
    if (document.getElementById("pswp-css")) return;
    // ?url keeps CSS out of the page stylesheet (Astro inlines those).
    const cssUrl = (await import("photoswipe/style.css?url")).default;
    await new Promise<void>((resolve) => {
      const link = document.createElement("link");
      link.id = "pswp-css";
      link.rel = "stylesheet";
      link.href = cssUrl;
      link.onload = () => resolve();
      link.onerror = () => resolve();
      document.head.appendChild(link);
    });
  })();
  return stylesReady;
}

function isStandaloneTarget(el: Element | null): el is HTMLAnchorElement {
  if (!(el instanceof HTMLAnchorElement)) return false;
  if (!el.hasAttribute("data-pswp-width")) return false;
  if (el.closest("[data-pswp-gallery]")) return false;
  return true;
}

async function bindStandalone(el: HTMLAnchorElement) {
  if (el.dataset.pswpBound === "true") return;

  await ensureStyles();

  if (!modulePromise) {
    modulePromise = import("photoswipe/lightbox");
  }

  // Preload the core module so the first open has slide content ready.
  const [{ default: Lightbox }] = await Promise.all([
    modulePromise,
    import("photoswipe"),
  ]);

  if (el.dataset.pswpBound === "true") return;
  el.dataset.pswpBound = "true";

  const lightbox = new Lightbox({
    gallery: el,
    pswpModule: () => import("photoswipe"),
  });
  lightbox.init();
  instances.add(lightbox);
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const link = target.closest("a[data-pswp-width]");
  if (!isStandaloneTarget(link)) return;
  if (link.dataset.pswpBound === "true") return;

  // First click only binds; opening via loadAndOpen right after lazy init
  // often shows an empty stage. Replay the click once PhotoSwipe is bound.
  event.preventDefault();
  event.stopPropagation();

  void bindStandalone(link).then(() => {
    requestAnimationFrame(() => {
      link.click();
    });
  });
}

/** Lazy-bind PhotoSwipe on first click of standalone `a[data-pswp-width]` links. */
export function initStandaloneLightboxes() {
  if (!listening) {
    listening = true;
    document.addEventListener("click", onDocumentClick);
    document.addEventListener("astro:before-swap", destroyAll);
  }
}
