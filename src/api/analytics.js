import API from "./axios";

export async function getFunnelAnalyticsRequest() {
  const res = await API.get("/superadmin/funnel/analytics");
  if (res.data?.success === false) {
    throw new Error(res.data?.message || "Failed to load funnel analytics");
  }
  return res.data?.data;
}

export async function getRetentionAnalyticsRequest() {
  const res = await API.get("/superadmin/retention/analytics");
  if (res.data?.success === false) {
    throw new Error(res.data?.message || "Failed to load retention analytics");
  }
  return res.data?.data;
}

export async function getCohortAnalyticsRequest() {
  const res = await API.get("/superadmin/cohort/analytics");
  if (res.data?.success === false) {
    throw new Error(res.data?.message || "Failed to load cohort analytics");
  }
  return res.data?.data;
}

export async function getAIQualityAnalyticsRequest() {
  const res = await API.get("/superadmin/ai/quality");
  if (res.data?.success === false) {
    throw new Error(res.data?.message || "Failed to load AI quality analytics");
  }
  return res.data?.data;
}
