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
  button.style.width = "62px";
  button.style.height = "62px";
  button.style.borderRadius = "999px";
  button.style.border = "none";
  button.style.background = "linear-gradient(135deg, #6039cf, #142e8e)";
  button.style.color = "#fff";
  button.style.fontWeight = "700";
  button.style.cursor = "pointer";
  button.style.boxShadow = "0 8px 24px rgba(20, 46, 142, 0.35)";

  var frame = document.createElement("iframe");
  frame.src = chatOrigin.replace(/\\/$/, "") + "/embed";
  frame.style.width = "360px";
  frame.style.maxWidth = "calc(100vw - 24px)";
  frame.style.height = "520px";
  frame.style.border = "1px solid #d6dcf4";
  frame.style.borderRadius = "14px";
  frame.style.boxShadow = "0 20px 45px rgba(17, 89, 148, 0.22)";
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
