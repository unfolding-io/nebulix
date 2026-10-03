import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

const instances = new Set<PhotoSwipeLightbox>();
let listening = false;

function destroyAll() {
  for (const instance of instances) {
    instance.destroy();
  }
  instances.clear();
}

function bindStandalone() {
  document.querySelectorAll<HTMLElement>("a[data-pswp-width]").forEach((el) => {
    if (el.closest("[data-pswp-gallery]")) return;
    if (el.dataset.pswpBound === "true") return;
    el.dataset.pswpBound = "true";

    const lightbox = new PhotoSwipeLightbox({
      gallery: el,
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();
    instances.add(lightbox);
  });
}

/** Bind PhotoSwipe to standalone `a[data-pswp-width]` links (not gallery items). */
export function initStandaloneLightboxes() {
  if (!listening) {
    listening = true;
    document.addEventListener("astro:before-swap", destroyAll);
    document.addEventListener("astro:page-load", bindStandalone);
  }
  bindStandalone();
}
