import { io } from "socket.io-client";
import { getAuthToken } from "@/lib/auth-token";

let socket = null;

function resolveSocketUrl() {
  const explicit = (import.meta.env.VITE_SOCKET_URL || "").trim();
  if (explicit) return explicit.replace(/\/$/, "");

  let apiUrl = (import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/$/, "");
  if (apiUrl.endsWith("/api")) {
    apiUrl = apiUrl.slice(0, -4);
  }
  return apiUrl;
}

export function connectActivitySocket(handlers = {}) {
  const token = getAuthToken();
  if (!token) return null;

  const url = resolveSocketUrl();
  if (!url) return null;

  if (socket?.connected) {
    return socket;
  }

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(url, {
    path: "/socket.io",
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
  });

  socket.on("connect", () => handlers.onConnect?.());
  socket.on("disconnect", () => handlers.onDisconnect?.());
  socket.on("connect_error", (err) => handlers.onError?.(err?.message || "Socket connection failed"));

  socket.on("traffic:log", (payload) => handlers.onTrafficLog?.(payload));
  socket.on("activity:event", (payload) => handlers.onActivityEvent?.(payload));
  socket.on("traffic:summary:patch", (payload) => handlers.onSummaryPatch?.(payload));
  socket.on("traffic:history:patch", (payload) => handlers.onHistoryPatch?.(payload));

  return socket;
}

export function disconnectActivitySocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
