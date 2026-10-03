import type { ImageMetadata } from "astro";
import { getImage } from "astro:assets";
import { resolveAsset } from "@util/assets";

export type LightboxImage = {
  href: string;
  width: number;
  height: number;
};

/** Full-size URL + dimensions for PhotoSwipe anchors. */
export async function getLightboxImage(
  src?: string | ImageMetadata | null,
): Promise<LightboxImage | null> {
  const image = typeof src === "string" ? resolveAsset(src) : src || undefined;
  if (!image) return null;

  const full = await getImage({
    src: image,
    width: image.width,
    height: image.height,
  });

  return {
    href: full.src,
    width: image.width,
    height: image.height,
  };
}
