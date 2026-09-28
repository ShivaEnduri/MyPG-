
export const INDIVIDUAL_CATEGORY_IDS = [1, 2, 3];


export const isIndividualCategory = (
  categoryId: number | ""
): boolean => {
  if (!categoryId) return false;
  return INDIVIDUAL_CATEGORY_IDS.includes(categoryId);
};
