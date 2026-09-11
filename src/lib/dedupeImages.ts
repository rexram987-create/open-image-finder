import type { CommonsImage } from '../types/image';

export function dedupeImages(images: CommonsImage[]): CommonsImage[] {
  const seen = new Set<number>();
  return images.filter((image) => {
    if (seen.has(image.id)) return false;
    seen.add(image.id);
    return true;
  });
}
