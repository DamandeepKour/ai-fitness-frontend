import API from "./axios";

export async function getPremiumOverviewRequest() {
  const res = await API.get("/premium/overview");
  return res.data?.data;
}

export {
  getNotificationPrefsRequest,
  updateNotificationPrefsRequest,
} from "./notifications.js";

export async function sendWhatsAppDemoRequest() {
  const res = await API.post("/premium/whatsapp/demo");
  return res.data?.data;
}

export async function requestCoachReviewRequest(payload) {
  const res = await API.post("/premium/coach-review", payload);
  return res.data?.data;
}

export async function getFamilyPlanRequest() {
  const res = await API.get("/premium/family");
  return res.data?.data;
}

export async function saveFamilyPlanRequest(payload) {
  const res = await API.put("/premium/family", payload);
  return res.data?.data;
}

export async function submitLabReportRequest(payload) {
  const res = await API.post("/premium/lab-report", payload);
  return res.data?.data;
}

export async function getLabReportsRequest() {
  const res = await API.get("/premium/lab-reports");
  return res.data?.data?.reports ?? [];
}

export async function connectWearableRequest(provider) {
  const res = await API.post("/premium/wearable/connect", { provider });
  return res.data?.data;
}

export async function disconnectWearableRequest() {
  const res = await API.post("/premium/wearable/disconnect");
  return res.data?.data;
}

export async function getGroceryListRequest(partnerId) {
  const res = await API.get("/premium/grocery", { params: { partnerId } });
  return res.data?.data;
}

export async function getCoachReviewQueueRequest() {
  const res = await API.get("/superadmin/coach-reviews");
  return res.data?.data?.reviews ?? [];
}

export async function updateCoachReviewAdminRequest(id, payload) {
  const res = await API.patch(`/superadmin/coach-reviews/${id}`, payload);
  return res.data?.data;
}
