import API from "./axios";

/** GET /api/user/me */
export async function getMeRequest() {
  const res = await API.get("/user/me");
  if (res.data?.success === false) {
    throw new Error(res.data?.message || "Failed to load profile");
  }
  return res.data?.data;
}

/** PUT /api/user/update */
export async function updateProfileRequest(body) {
  const res = await API.put("/user/update", body);
  if (res.data?.success === false) {
    throw new Error(res.data?.message || "Failed to update profile");
  }
  return res.data?.data;
}

/** GET /api/superadmin/me */
export async function getSuperadminMeRequest() {
  const res = await API.get("/superadmin/me");
  if (res.data?.success === false) {
    throw new Error(res.data?.message || "Failed to load profile");
  }
  return res.data?.data;
}

/** PUT /api/superadmin/profile */
export async function updateSuperadminProfileRequest(body) {
  const res = await API.put("/superadmin/profile", body);
  if (res.data?.success === false) {
    throw new Error(res.data?.message || "Failed to update profile");
  }
  return res.data?.data;
}
