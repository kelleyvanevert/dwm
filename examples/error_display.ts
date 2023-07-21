import "./error_display_env.ts";
import {
  CanvasRenderingContext2D,
  Fonts,
  Position,
  Rect,
  mainloop,
  WindowCanvas,
} from "../ext/canvas.ts";
import { getPrimaryMonitor } from "../src/platform/glfw/monitor.ts";

// ➜  dwm git:(0.3.3) ✗ ./builds/error_display.darwin
// Downloading https://github.com/DjDeveloperr/skia_canvas/releases/download/0.5.2/libnative_canvas.dylib

Deno.env.set("DENO_SKIA_PATH", "lib/libnative_canvas.dylib");

Fonts.register("./RobotoSlab-Bold.ttf");
Fonts.register("./Roboto-Regular.ttf");

const monitor = getPrimaryMonitor();

const full = true;

const win = new WindowCanvas({
  title: "Error display",
  focused: true,
  autoExitEventLoop: true, // ?
  floating: true,
  ...(full
    ? {
        height: monitor.workArea.height,
        width: monitor.workArea.width,
        resizable: false,
        maximized: true,
        removeDecorations: true,
      }
    : {
        resizable: true,
        height: 500,
        width: 900,
      }),
});

if (full) {
  win.window.position = {
    x: 0,
    y: 0,
  };
  win.window.requestUserAttention();
}

win.window.setSizeLimits(900, 500, 3000, 3000);

const { x: sx, y: sy } = win.window.contentScale;

const cursor = {
  x: 0,
  y: 0,
  down: false,
};

let buttons: Record<string, [Rect, () => void]> = {};

addEventListener("click", (e) => {
  // console.log("click", e.x, e.y);
});

addEventListener("dblclick", () => {
  // console.log("dblclick");
});

addEventListener("mousedown", (e) => {
  if (!win.window.focused) {
    e.preventDefault();
    return;
  }

  // console.log("down", e.x, e.y);
  cursor.x = e.x;
  cursor.y = e.y;
  cursor.down = true;
});

addEventListener("mousemove", (e) => {
  if (!win.window.focused) {
    e.preventDefault();
    return;
  }

  // console.log("move", e.x, e.y);
  cursor.x = e.x;
  cursor.y = e.y;
});

addEventListener("mouseup", (e) => {
  if (!win.window.focused) {
    e.preventDefault();
    return;
  }

  // console.log("up", e.x, e.y);
  cursor.x = e.x;
  cursor.y = e.y;
  cursor.down = false;

  for (const [id, btn] of Object.entries(buttons)) {
    if (within(cursor, btn[0])) {
      btn[1]();
    }
  }
});

function restartApp() {
  console.log("RESTART APP");
}

function forceUpdate() {
  console.log("FORCE UPDATE");
}

win.onDraw = (ctx) => {
  buttons = {};
  ctx.save();
  ctx.scale(sx, sy);

  ctx.fillStyle = "#F3F2F0";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = "#454541";
  ctx.font = "bold 40px 'Roboto Slab'";
  ctx.textBaseline = "top";
  ctx.fillText("Warning!", 40, 40);

  ctx.fillStyle = "#78716c";
  ctx.font = "normal 18px Roboto";
  ctx.fillText(
    "This is a warning message. Something went wrong with the network",
    40,
    100
  );

  ctx.font = "normal 18px Roboto";
  ctx.fillText("connection and you need to take action.", 40, 124);

  let x = 40;
  x += drawButton(ctx, "restart_app", "Restart app", x, 180, restartApp).width;
  x += 20;
  x += drawButton(
    ctx,
    "force_update",
    "Force update",
    x,
    180,
    forceUpdate
  ).width;

  ctx.restore();
};

function drawButton(
  ctx: CanvasRenderingContext2D,
  id: string,
  text: string,
  x: number,
  y: number,
  handler: () => void
) {
  ctx.font = "bold 20px 'Roboto Slab'";

  const px = 20;
  const height = 40;
  const width = ctx.measureText(text).width + px * 2;

  const hovering = within(cursor, { x, y, width, height });
  const scale = cursor.down && hovering ? 0.9 : 1;

  ctx.save();
  {
    ctx.translate(x + width / 2, y + height / 2);
    ctx.scale(scale, scale);

    ctx.fillStyle = "#3DA9AD";
    ctx.beginPath();
    ctx.roundRect(-width / 2, -height / 2, width, height, 999);
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.textBaseline = "middle";
    ctx.fillText(text, px - width / 2, height * (18 / 40) - height / 2);
  }
  ctx.restore();

  const box = { x, y, width, height };
  buttons[id] = [box, handler];

  return box;
}

function within(p: Position, rect: Rect) {
  return (
    p.x >= rect.x &&
    p.x <= rect.x + rect.width &&
    p.y >= rect.y &&
    p.y <= rect.y + rect.height
  );
}

setInterval(() => {
  console.log("alive");
}, 1000);

await mainloop(() => {
  win.draw();
}, false);

globalThis.addEventListener("beforeunload", () => {
  console.log("beforeunload");
  win.window.close();
});

globalThis.addEventListener("unload", () => {
  console.log("unload");
});
