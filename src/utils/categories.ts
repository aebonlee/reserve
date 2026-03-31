import type { Category } from '../types';

export const CATEGORIES: readonly Category[] = [
  { key: 'university', label: '대학강의', cssClass: 'cat-university' },
  { key: 'corp-offline', label: '기업 대면강의', cssClass: 'cat-corp-offline' },
  { key: 'corp-online', label: '기업 온라인강의', cssClass: 'cat-corp-online' },
  { key: 'special-offline', label: '특강 - 대면', cssClass: 'cat-special-offline' },
  { key: 'special-online', label: '특강 - 온라인', cssClass: 'cat-special-online' },
];

/** 카테고리 라벨(한글) 목록 */
export const CATEGORY_LABELS: string[] = CATEGORIES.map(c => c.label);

/** 카테고리 라벨 → CSS 클래스 매핑 */
const labelToCssMap: Record<string, string> = {};
CATEGORIES.forEach(c => { labelToCssMap[c.label] = c.cssClass; });

export const getCategoryClass = (categoryLabel: string): string => {
  return labelToCssMap[categoryLabel] ?? '';
};
