import API from "./axios";

/** GET /api/superadmin/health/analytics */
export async function getHealthAnalyticsRequest() {
  const res = await API.get("/superadmin/health/analytics");
  if (res.data?.success === false) {
    throw new Error(res.data?.message || "Failed to load health analytics");
  }
  return res.data?.data;
}
