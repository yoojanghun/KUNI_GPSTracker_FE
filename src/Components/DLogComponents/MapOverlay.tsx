export function makeOverlayHTML(type: "start" | "end", lat: number, lng: number): HTMLElement {
  const label = type === "start" ? "출발지" : "도착지";
  const content = document.createElement("div");
  content.innerHTML = `
    <div class="bg-white rounded-md shadow-md px-3 py-2 text-sm font-medium text-gray-800">
      <b>${label}</b>
      <div class="text-xs text-gray-500 mt-1">
        위도: ${lat}<br/>
        경도: ${lng}
      </div>
    </div>
  `;
  return content;
}