import API from "./axios";

/** GET /api/superadmin/business/analytics */
export async function getBusinessAnalyticsRequest() {
  const res = await API.get("/superadmin/business/analytics");
  if (res.data?.success === false) {
    throw new Error(res.data?.message || "Failed to load business analytics");
  }
  return res.data?.data;
}
