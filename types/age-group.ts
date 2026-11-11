export const AGE_GROUPS = ["3-6", "7-12", "13+"] as const;
export type AgeGroup = (typeof AGE_GROUPS)[number];

export function isAgeGroup(value: unknown): value is AgeGroup {
    return AGE_GROUPS.some((group) => group === value);


}