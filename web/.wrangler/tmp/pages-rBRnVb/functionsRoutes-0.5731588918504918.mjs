import { onRequestPost as __api_lead_ts_onRequestPost } from "C:\\Users\\FL\\Desktop\\silkpass\\web\\functions\\api\\lead.ts"

export const routes = [
    {
      routePath: "/api/lead",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_lead_ts_onRequestPost],
    },
  ]