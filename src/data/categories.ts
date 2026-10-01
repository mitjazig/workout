import type { TaskCategory } from '../types';

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  warmup: 'Ogrevanje',
  strength: 'Moč',
  cardio: 'Kardio',
  mobility: 'Mobilnost',
  cooldown: 'Sprostitev',
};

export function categoryLabel(category: TaskCategory): string {
  return CATEGORY_LABELS[category];
}
