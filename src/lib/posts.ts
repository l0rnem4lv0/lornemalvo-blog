import type { MarkdownHeading } from 'astro';

export function getReadingTime(body: string): number {
  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export type TocHeading = Pick<MarkdownHeading, 'depth' | 'slug' | 'text'>;

export function getHeadings(headings: MarkdownHeading[]): TocHeading[] {
  return headings
    .filter((h) => h.depth === 2 || h.depth === 3)
    .map(({ depth, slug, text }) => ({ depth, slug, text }));
}
