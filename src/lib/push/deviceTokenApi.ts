import { apiRequest } from "@/lib/api";
import type { ApnsEnvironment } from "./deviceTokenRegistration";

export function registerDeviceToken(
  token: string,
  environment: ApnsEnvironment,
  signal: AbortSignal,
) {
  return apiRequest<void>("/api/notifications/device-token", {
    method: "PUT",
    auth: true,
    body: { token, environment },
    signal,
  });
}
