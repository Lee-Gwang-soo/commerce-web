import type { Category } from "@/types/product";

export interface CategoryInfo {
  slug: Category;
  label: string;
  description: string;
  icon: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: "ELECTRONIC",
    label: "전자기기",
    description: "최신 전자제품 및 IT기기",
    icon: "📱",
  },
  {
    slug: "FASHION",
    label: "패션",
    description: "의류, 신발, 액세서리",
    icon: "👔",
  },
  {
    slug: "FOOD",
    label: "식품",
    description: "신선식품 및 가공식품",
    icon: "🍎",
  },
  {
    slug: "SPORT",
    label: "스포츠",
    description: "운동용품 및 아웃도어",
    icon: "⚽",
  },
] as const;

export const getCategoryLabel = (slug: Category): string => {
  return CATEGORIES.find((cat) => cat.slug === slug)?.label || slug;
};

export const getCategoryInfo = (slug: Category): CategoryInfo | undefined => {
  return CATEGORIES.find((cat) => cat.slug === slug);
};
