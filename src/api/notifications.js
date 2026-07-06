import API from "./axios";

export async function getNotificationPrefsRequest() {
  const res = await API.get("/user/notifications");
  return res.data?.data;
}

export async function updateNotificationPrefsRequest(payload) {
  const res = await API.put("/user/notifications", payload);
  return res.data?.data;
}
