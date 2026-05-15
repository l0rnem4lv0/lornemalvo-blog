import type { CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'posts'>;

export function getAllTags(posts: Post[]): string[] {
  return [...new Set(posts.flatMap((post) => post.data.tags))].sort();
}

export function getPostsByTag(posts: Post[], tag: string): Post[] {
  return posts
    .filter((post) => post.data.tags.includes(tag))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function getTagCounts(posts: Post[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return counts;
}
