import API from "./axios";

/** GET /api/superadmin/ai/analytics */
export async function getAIAnalyticsRequest() {
  const res = await API.get("/superadmin/ai/analytics");
  if (res.data?.success === false) {
    throw new Error(res.data?.message || "Failed to load AI analytics");
  }
  return res.data?.data;
}

/** GET /api/superadmin/ai/generated-meals */
export async function getAIGeneratedMealsRequest(limit = 50) {
  const res = await API.get("/superadmin/ai/generated-meals", { params: { limit } });
  if (res.data?.success === false) {
    throw new Error(res.data?.message || "Failed to load generated meals");
  }
  return res.data?.data?.meals ?? [];
}
