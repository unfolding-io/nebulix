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

async function openStandalone(el: HTMLAnchorElement) {
  await ensureStyles();

  if (!modulePromise) {
    modulePromise = import("photoswipe/lightbox");
  }

  const { default: Lightbox } = await modulePromise;

  if (el.dataset.pswpBound !== "true") {
    el.dataset.pswpBound = "true";

    const lightbox = new Lightbox({
      gallery: el,
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();
    instances.add(lightbox);
    lightbox.loadAndOpen(0);
  }
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const link = target.closest("a[data-pswp-width]");
  if (!isStandaloneTarget(link)) return;
  if (link.dataset.pswpBound === "true") return;

  event.preventDefault();
  void openStandalone(link);
}

/** Lazy-bind PhotoSwipe on first click of standalone `a[data-pswp-width]` links. */
export function initStandaloneLightboxes() {
  if (!listening) {
    listening = true;
    document.addEventListener("click", onDocumentClick);
    document.addEventListener("astro:before-swap", destroyAll);
  }
}
