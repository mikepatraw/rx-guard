import type { ReviewFlag } from '../types/review.js';

export function mergeFlags(primary: ReviewFlag[], secondary: ReviewFlag[]): ReviewFlag[] {
  const seen = new Set<string>();
  const merged: ReviewFlag[] = [];

  for (const flag of [...primary, ...secondary]) {
    const key = `${flag.code}:${flag.message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(flag);
  }

  return merged;
}
