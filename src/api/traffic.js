import API from "./axios";

function assertSuccess(res, fallbackMessage) {
  if (res.data?.success === false) {
    throw new Error(res.data?.message || fallbackMessage);
  }
  return res.data?.data;
}

export async function getTrafficSummaryRequest() {
  const res = await API.get("/superadmin/traffic/summary");
  return assertSuccess(res, "Failed to load traffic summary");
}

export async function getTrafficLogsRequest(params = {}) {
  const res = await API.get("/superadmin/traffic/logs", { params });
  return assertSuccess(res, "Failed to load traffic logs");
}

export async function getTrafficHistoryRequest(params = {}) {
  const res = await API.get("/superadmin/traffic/history", { params });
  return assertSuccess(res, "Failed to load traffic history");
}

export async function getUserActivityRequest(params = {}) {
  const res = await API.get("/superadmin/traffic/activity", { params });
  return assertSuccess(res, "Failed to load user activity");
}
