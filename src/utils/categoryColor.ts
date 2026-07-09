/**
 * Fixed category → color mapping so project/service badges are semantically
 * consistent everywhere they render, instead of each surface picking its own color.
 */
const categoryColors: Record<string, string> = {
  Web: 'bg-primary-600',
  Mobile: 'bg-secondary-600',
  Academic: 'bg-accent-600',
};

const DEFAULT_COLOR = 'bg-gray-600';

export function getCategoryColor(category: string): string {
  return categoryColors[category] ?? DEFAULT_COLOR;
}
