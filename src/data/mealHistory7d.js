const dayTemplates = [
  [
    { tag: "Breakfast", name: "Avocado Toast & Eggs", kcal: 420, time: "8:05 AM" },
    { tag: "Lunch", name: "Quinoa Chicken Bowl", kcal: 560, time: "12:45 PM" },
    { tag: "Snack", name: "Greek Yogurt Parfait", kcal: 240, time: "4:20 PM" },
    { tag: "Dinner", name: "Salmon, Rice & Greens", kcal: 620, time: "7:15 PM" },
  ],
  [
    { tag: "Breakfast", name: "Oatmeal, Berries & Almonds", kcal: 380, time: "7:50 AM" },
    { tag: "Lunch", name: "Turkey Wrap & Side Salad", kcal: 510, time: "1:10 PM" },
    { tag: "Dinner", name: "Lean Beef Stir-fry", kcal: 590, time: "6:50 PM" },
  ],
  [
    { tag: "Breakfast", name: "Protein Smoothie Bowl", kcal: 340, time: "8:20 AM" },
    { tag: "Lunch", name: "Mediterranean Chickpea Bowl", kcal: 480, time: "12:30 PM" },
    { tag: "Snack", name: "Apple & Peanut Butter", kcal: 200, time: "3:40 PM" },
    { tag: "Dinner", name: "Baked Cod with Roasted Veg", kcal: 540, time: "7:40 PM" },
  ],
  [
    { tag: "Breakfast", name: "Scrambled Eggs & Sourdough", kcal: 410, time: "7:35 AM" },
    { tag: "Lunch", name: "Sushi Roll Set (mixed)", kcal: 620, time: "1:00 PM" },
    { tag: "Dinner", name: "Chicken Tikka with Cauliflower Rice", kcal: 560, time: "7:05 PM" },
  ],
  [
    { tag: "Breakfast", name: "Cottage Cheese & Fruit", kcal: 290, time: "8:00 AM" },
    { tag: "Lunch", name: "Lentil Soup & Wholegrain Roll", kcal: 450, time: "12:15 PM" },
    { tag: "Snack", name: "Rice Cakes & Hummus", kcal: 180, time: "4:00 PM" },
    { tag: "Dinner", name: "Grilled Steak & Asparagus", kcal: 640, time: "7:25 PM" },
  ],
  [
    { tag: "Breakfast", name: "Banana Pancakes (protein)", kcal: 440, time: "9:10 AM" },
    { tag: "Lunch", name: "Tofu Poke Bowl", kcal: 520, time: "12:50 PM" },
    { tag: "Dinner", name: "Shrimp Pasta (light cream)", kcal: 680, time: "8:00 PM" },
  ],
  [
    { tag: "Breakfast", name: "Egg White Veg Omelette", kcal: 320, time: "7:45 AM" },
    { tag: "Lunch", name: "Chicken Caesar (dressing on side)", kcal: 490, time: "1:20 PM" },
    { tag: "Snack", name: "Protein Bar", kcal: 210, time: "5:10 PM" },
    { tag: "Dinner", name: "Turkey Meatballs & Zoodles", kcal: 530, time: "6:45 PM" },
  ],
];

/** @typedef {'today' | '7days' | 'this_month' | 'last_month'} MealHistoryFilter */

/**
 * @param {MealHistoryFilter} filter
 * @param {Date} [now]
 * @returns {{ date: Date, meals: typeof dayTemplates[0], totalKcal: number }[]}
 * Newest calendar day first (today at top when in range).
 */
export function getMealHistoryForFilter(filter, now = new Date()) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  let start;
  let end = new Date(today);

  switch (filter) {
    case "today":
      start = new Date(today);
      break;
    case "7days":
      start = new Date(today);
      start.setDate(start.getDate() - 6);
      break;
    case "this_month":
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    case "last_month":
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    default:
      start = new Date(today);
      start.setDate(start.getDate() - 6);
  }

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const ascending = [];
  for (let d = new Date(start); d.getTime() <= end.getTime(); d.setDate(d.getDate() + 1)) {
    const date = new Date(d);
    const dayIndex = Math.floor(date.getTime() / 86400000);
    const templateIndex = Math.abs(dayIndex) % dayTemplates.length;
    const meals = dayTemplates[templateIndex].map((m) => ({ ...m }));
    const totalKcal = meals.reduce((acc, m) => acc + m.kcal, 0);
    ascending.push({ date, meals, totalKcal });
  }

  ascending.reverse();
  return ascending;
}

export function formatHistoryDayTitle(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today - d) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return new Intl.DateTimeFormat(undefined, { weekday: "long", month: "short", day: "numeric" }).format(d);
}
