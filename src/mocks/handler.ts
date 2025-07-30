import { http, HttpResponse } from "msw";
import currentDLog from "../Api/currentDLog.json"
import { detailLog } from "@/Api/detailLog";


export const handlers = [
  http.get("/api/record", (req) => {
    const url = new URL(req.request.url);
    const pageable = url.searchParams.get("pageable");
    const page = Number(pageable) || 0;
    const pageSize = 10;

    let filtered = currentDLog.content || [];

    const vehicleNumber = url.searchParams.get("vehicleNumber");
    const startTime = url.searchParams.get("startTime");
    const endTime = url.searchParams.get("endTime");

    if (vehicleNumber) {
      filtered = filtered.filter(d => d.vehicleNumber.includes(vehicleNumber));
    }
    if (startTime) {
      filtered = filtered.filter(d => new Date(d.onTime) >= new Date(startTime));
    }
    if (endTime) {
      filtered = filtered.filter(d => new Date(d.offTime) <= new Date(endTime));
    }

    const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
    return HttpResponse.json({ content: paged }, { status: 200 });
  }),

  http.get("/api/record/:id", (req) => { 
    const { id } = req.params;

    const detail = detailLog.find((d) => d.recordId === id)?.data;
    if (!detail) {
      return HttpResponse.json({
        timeStamp: new Date().toISOString(),
        status: 404,
        error: "GLOBAL-002",
        message: "값을 찾을 수 없습니다.",
        path: req.request.url,
      }, { status: 404 });
    }

    return HttpResponse.json(detail, {status: 200})
   }),

  http.get("/api/dashboard", () => {
    return HttpResponse.json({ message: "ok" });
  }),

  // Add other handlers here following the same pattern
];