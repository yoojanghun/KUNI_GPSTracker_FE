// import { http, HttpResponse } from "msw";
// import currentCarList from "@/Api/currentCarList.json";
// import currentDLog from "@/Api/currentDLog.json";
// import detailLog from "@/Api/detailLog.json";
// import type { carList } from "@/Api/ManageApi/interfaces/getCarListResponse";

export const handlers = [
  // http.get("/api/vehicle", (req) => {
  //   const url = new URL(req.request.url);
  //   const page = parseInt(url.searchParams.get("page") ?? "0", 10);
  //   const pageSize = parseInt(url.searchParams.get("size") ?? "10", 10);

  //   let filtered = currentCarList.content || [];

  //   const vehicleNumber = url.searchParams.get("vehicleNumber");
  //   const sort = url.searchParams.get("sort");
  //   const status = url.searchParams.get("status");

  //   if (vehicleNumber) {
  //     filtered = filtered.filter((d) => d.carNumber.includes(vehicleNumber));
  //   }
  //   if (status) {
  //     filtered = filtered.filter((d) => d.status === status);
  //   }
  //   if (sort) {
  //     filtered = filtered.sort((a, b) => {
  //       const [sortType, direction] = sort.split(",") as [
  //         keyof carList,
  //         string
  //       ];
  //       const aVal = a[sortType];
  //       const bVal = b[sortType];

  //       if (typeof aVal === "number" && typeof bVal === "number") {
  //         return direction === "ASC" ? aVal - bVal : bVal - aVal;
  //       }

  //       if (typeof aVal === "string" && typeof bVal === "string") {
  //         return direction === "ASC"
  //           ? aVal.localeCompare(bVal)
  //           : bVal.localeCompare(aVal);
  //       }

  //       return 0;
  //     });
  //   }

  //   const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
  //   return HttpResponse.json(
  //     { ...currentCarList, content: paged },
  //     { status: 200 }
  //   );
  // }),

  // http.post("/api/vehicle", async (req) => {
  //   const requestBody = await req.request.json();
  //   return HttpResponse.json(requestBody, { status: 200 });
  // }),

  // http.delete("/api/vehicle", async (req) => {
  //   const url = new URL(req.request.url);
  //   const queryCar = url.searchParams.get("carNumber");
  //   const element = currentCarList.content.find((d) => {
  //     return d.carNumber === queryCar;
  //   });

  //   if (!element) {
  //     return HttpResponse.json({
  //       timeStamp: new Date().toISOString(),
  //       status: 500,
  //       error: "Internal Server Error",
  //       path: req.request.url,
  //     });

      
  //   }

  //   return HttpResponse.json({ status: 200 });
  // }),

  // http.get("/api/record", (req) => {
  //   const url = new URL(req.request.url);
  //   const page = parseInt(url.searchParams.get("page") ?? "0", 10);
  //   const pageSize = parseInt(url.searchParams.get("size") ?? "10", 10);

  //   let filtered = currentDLog.content || [];

  //   const vehicleNumber = url.searchParams.get("vehicleNumber");
  //   const startTime = url.searchParams.get("startTime");
  //   const endTime = url.searchParams.get("endTime");
  //   const sort = url.searchParams.get("sort");

  //   if (vehicleNumber) {
  //     filtered = filtered.filter((d) =>
  //       d.vehicleNumber.includes(vehicleNumber)
  //     );
  //   }
  //   if (startTime) {
  //     filtered = filtered.filter(
  //       (d) => new Date(d.onTime) >= new Date(startTime)
  //     );
  //   }
  //   if (endTime) {
  //     filtered = filtered.filter(
  //       (d) => new Date(d.offTime) <= new Date(endTime)
  //     );
  //   }
  //   if (sort) {
  //     filtered = filtered.sort((a, b) => {
  //       const aVal = new Date(a.onTime).getTime();
  //       const bVal = new Date(b.onTime).getTime();

  //       return sort === "asc" ? aVal - bVal : bVal - aVal;
  //     });
  //   }

  //   const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
  //   return HttpResponse.json(
  //     { ...currentDLog, content: paged },
  //     { status: 200 }
  //   );
  // }),

  // http.get("/api/record/:id", (req) => {
  //   const { id } = req.params;
  //   console.log("requested id: ",id);

  //   const detail = detailLog;
  //   if (!detail) {
  //     return HttpResponse.json(
  //       {
  //         timeStamp: new Date().toISOString(),
  //         status: 404,
  //         error: "GLOBAL-002",
  //         message: "값을 찾을 수 없습니다.",
  //         path: req.request.url,
  //       },
  //       { status: 404 }
  //     );
  //   }

  //   return HttpResponse.json(detail, { status: 200 });
  // }),

  // http.get("/api/dashboard", () => {
  //   return HttpResponse.json({ message: "ok" });
  // }),
];
