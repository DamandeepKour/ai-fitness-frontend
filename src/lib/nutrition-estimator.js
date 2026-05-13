const FOOD_NUTRITION = {
  chicken: { kcal: 165, protein: 31, carbs: 0, fat: 4 },
  rice: { kcal: 130, protein: 3, carbs: 28, fat: 0 },
  egg: { kcal: 155, protein: 13, carbs: 1, fat: 11 },
  salad: { kcal: 40, protein: 2, carbs: 7, fat: 0 },
  banana: { kcal: 89, protein: 1, carbs: 23, fat: 0 },
  oats: { kcal: 380, protein: 13, carbs: 67, fat: 7 },
  salmon: { kcal: 208, protein: 20, carbs: 0, fat: 13 },
  bread: { kcal: 265, protein: 9, carbs: 49, fat: 3 },
  avocado: { kcal: 160, protein: 2, carbs: 9, fat: 15 },
  yogurt: { kcal: 60, protein: 10, carbs: 4, fat: 0 },
  almonds: { kcal: 579, protein: 21, carbs: 22, fat: 50 },
  pasta: { kcal: 131, protein: 5, carbs: 25, fat: 1 },
  beef: { kcal: 250, protein: 26, carbs: 0, fat: 15 },
  tofu: { kcal: 145, protein: 16, carbs: 4, fat: 9 },
  cheese: { kcal: 400, protein: 25, carbs: 3, fat: 33 },
  paneer: { kcal: 296, protein: 18, carbs: 4, fat: 23 },
  dal: { kcal: 116, protein: 9, carbs: 20, fat: 0 },
  rajma: { kcal: 127, protein: 9, carbs: 23, fat: 1 },
  roti: { kcal: 297, protein: 10, carbs: 46, fat: 8 },
  poha: { kcal: 180, protein: 4, carbs: 35, fat: 3 },
  upma: { kcal: 170, protein: 5, carbs: 30, fat: 4 },
  idli: { kcal: 120, protein: 4, carbs: 24, fat: 1 },
  dosa: { kcal: 168, protein: 4, carbs: 29, fat: 4 },
  sambar: { kcal: 76, protein: 4, carbs: 12, fat: 2 },
  curd: { kcal: 98, protein: 11, carbs: 4, fat: 4 },
  raita: { kcal: 80, protein: 5, carbs: 7, fat: 3 },
  peanuts: { kcal: 567, protein: 26, carbs: 16, fat: 49 },
  makhana: { kcal: 347, protein: 9, carbs: 77, fat: 0 },
  apple: { kcal: 52, protein: 0, carbs: 14, fat: 0 },
};

const DEFAULT_NUTRITION = { kcal: 150, protein: 6, carbs: 20, fat: 5 };

export function estimateNutrition(foodName, grams = 250, knownCalories) {
  const normalized = foodName.toLowerCase();
  const matches = Object.entries(FOOD_NUTRITION).filter(([key]) => normalized.includes(key));
  const entries = matches.length ? matches.map(([, value]) => value) : [DEFAULT_NUTRITION];
  const gramsPerEntry = grams / entries.length;

  const totals = entries.reduce(
    (acc, item) => ({
      calories: acc.calories + (item.kcal * gramsPerEntry) / 100,
      protein: acc.protein + (item.protein * gramsPerEntry) / 100,
      carbs: acc.carbs + (item.carbs * gramsPerEntry) / 100,
      fat: acc.fat + (item.fat * gramsPerEntry) / 100,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  if (knownCalories) {
    const ratio = knownCalories / Math.max(totals.calories, 1);
    totals.calories = knownCalories;
    totals.protein *= ratio;
    totals.carbs *= ratio;
    totals.fat *= ratio;
  }

  return {
    calories: Math.round(totals.calories),
    protein: Math.round(totals.protein),
    carbs: Math.round(totals.carbs),
    fat: Math.round(totals.fat),
    matchedFoods: matches.map(([key]) => key),
  };
}

export function toDailyLogMealType(mealType) {
  const normalized = mealType.toLowerCase().replace(/\s+/g, "_");
  if (normalized === "snack") return "evening_snack";
  if (normalized === "cheat_meal") return "dinner";
  return normalized;
}
