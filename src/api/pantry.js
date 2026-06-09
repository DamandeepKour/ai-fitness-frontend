import API from "./axios";

export async function getPantryItemsRequest() {
  const res = await API.get("/pantry");
  return res.data?.data?.items ?? [];
}

export async function addPantryItemRequest(payload) {
  const res = await API.post("/pantry", payload);
  return res.data?.data;
}

export async function removePantryItemRequest(id) {
  await API.delete(`/pantry/${id}`);
}

export async function getSwapSuggestionsRequest() {
  const res = await API.get("/pantry/swap-suggestions");
  return res.data?.data;
}

export async function swapMealRequest(payload) {
  const res = await API.post("/pantry/swap", payload);
  return res.data?.data;
}

export async function getCoachingRequest() {
  const res = await API.get("/pantry/coaching");
  return res.data?.data;
}

export async function getBudgetTiersRequest() {
  const res = await API.get("/pantry/budget-tiers");
  return res.data?.data?.tiers ?? {};
}
