import type { CommonsImage } from '../types/image';

export type DownloadResult = 'download-started' | 'opened-original';

function fileNameFor(image: CommonsImage): string {
  return image.title.replace(/^File:/, '').replace(/[\\/:*?"<>|]/g, '_') || 'download';
}

export async function downloadOriginal(image: CommonsImage): Promise<DownloadResult> {
  try {
    const response = await fetch(image.originalUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = fileNameFor(image);
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
    return 'download-started';
  } catch {
    window.open(image.originalUrl, '_blank', 'noopener,noreferrer');
    return 'opened-original';
  }
}
