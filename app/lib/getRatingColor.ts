export function getRatingColor(rating: number): string {
  if (rating >= 7) return '#66E900';
  if (rating >= 5) return '#E9D100';
  return '#E90000';
}
