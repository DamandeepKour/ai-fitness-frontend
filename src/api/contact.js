import API from "./axios";

/**
 * POST /api/contact — body: { name, email, message }
 */
export async function submitContactRequest(body) {
  const res = await API.post("/contact", body);
  if (res.data?.success === false) {
    throw new Error(res.data?.message || "Could not send message");
  }
  return res.data;
}
