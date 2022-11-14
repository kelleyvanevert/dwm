import { createWindow } from "../mod.ts";

createWindow({
  title: "Deno Window Manager",
  width: 800,
  height: 600,
  resizable: false,
});

addEventListener("pointermove", (e) => {
  console.log(e.x, e.y);
});

addEventListener("resize", (event) => {
  console.log("Window resized", event.width, event.height);
});
