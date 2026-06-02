import API from "./axios";

/** GET /api/superadmin/nutrition/analytics */
export async function getNutritionAnalyticsRequest() {
  const res = await API.get("/superadmin/nutrition/analytics");
  if (res.data?.success === false) {
    throw new Error(res.data?.message || "Failed to load nutrition analytics");
  }
  return res.data?.data;
}
