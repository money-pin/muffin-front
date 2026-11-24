import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import { initAnalytics } from "@/lib/analytics";
import { initializeIosPush } from "@/lib/push/iosPush";
import { router } from "@/routes/router";

import "./index.css";

const queryClient = new QueryClient();

initAnalytics();
const disposeIosPush = initializeIosPush((path) => {
  void router.navigate(path, { replace: true });
});
if (import.meta.hot) import.meta.hot.dispose(disposeIosPush);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
