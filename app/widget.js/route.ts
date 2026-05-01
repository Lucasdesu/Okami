import { NextResponse } from "next/server";

const widgetScript = `(function () {
  var script = document.currentScript;
  var chatOrigin = (script && script.getAttribute("data-chat-origin")) || window.location.origin;

  var root = document.createElement("div");
  root.style.position = "fixed";
  root.style.right = "20px";
  root.style.bottom = "20px";
  root.style.zIndex = "999999";
  document.body.appendChild(root);

  var button = document.createElement("button");
  button.innerText = "Chat";
  button.style.width = "60px";
  button.style.height = "60px";
  button.style.borderRadius = "999px";
  button.style.border = "none";
  button.style.background = "#111827";
  button.style.color = "#fff";
  button.style.fontWeight = "700";
  button.style.cursor = "pointer";

  var frame = document.createElement("iframe");
  frame.src = chatOrigin.replace(/\/$/, "") + "/embed";
  frame.style.width = "360px";
  frame.style.maxWidth = "calc(100vw - 24px)";
  frame.style.height = "520px";
  frame.style.border = "1px solid #d1d5db";
  frame.style.borderRadius = "14px";
  frame.style.boxShadow = "0 20px 45px rgba(0,0,0,0.2)";
  frame.style.display = "none";
  frame.style.background = "#fff";

  button.addEventListener("click", function () {
    frame.style.display = frame.style.display === "none" ? "block" : "none";
  });

  root.appendChild(frame);
  root.appendChild(button);
})();`;

export async function GET() {
  return new NextResponse(widgetScript, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=300"
    }
  });
}
