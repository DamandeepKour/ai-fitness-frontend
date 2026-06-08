import API from "./axios";

export async function getSupportTicketsRequest({ status, limit } = {}) {
  const res = await API.get("/superadmin/support/tickets", {
    params: { status, limit },
  });
  if (res.data?.success === false) {
    throw new Error(res.data?.message || "Failed to load support tickets");
  }
  return res.data?.data;
}

export async function updateSupportTicketStatusRequest(id, status) {
  const res = await API.patch(`/superadmin/support/tickets/${id}`, { status });
  if (res.data?.success === false) {
    throw new Error(res.data?.message || "Failed to update ticket");
  }
  return res.data?.data;
}
