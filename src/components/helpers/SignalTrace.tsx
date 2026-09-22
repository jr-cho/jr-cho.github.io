import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// Grid spacing of the faint scope graticule, in CSS pixels.
const GRID = 80;
// How wide the cursor's pull on the trace reaches, in CSS pixels.
const PULL_WIDTH = 140;

// Scope settings shown on screen. The readouts are computed from the drawn
// wave with these, so the numbers agree with what you see.
const VOLTS_PER_DIV = 0.5;
const MS_PER_DIV = 2;
const CENTER_VOLTS = 1.65; // half of a 3.3 V logic supply
// Spatial frequency of the wave's main component, in radians per pixel.
const MAIN_K = 0.012;
const FONT = "11px 'Geist Mono Variable', 'Geist Mono', ui-monospace, monospace";

// An oscilloscope-style trace drawn on a canvas. The wave travels on its
// own, and bends toward the cursor when the cursor comes near. Reduced
// motion draws one still frame. Drawing stops while the canvas is off screen.
const SignalTrace = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const styles = getComputedStyle(document.documentElement);
    const trace = styles.getPropertyValue("--accent-amber").trim() || "#F5A623";
    const grid = "rgba(10, 10, 10, 0.07)";
    const label = "rgba(10, 10, 10, 0.45)";
    // One full cycle of the main component spans this many divisions.
    const freqHz = 1000 / (((2 * Math.PI) / MAIN_K / GRID) * MS_PER_DIV);

    // Cursor position in canvas pixels, eased toward the real cursor.
    const cursor = { x: 0, y: 0, pull: 0 };
    const target = { x: 0, y: 0, pull: 0 };
    let frame = 0;
    let visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      // Graticule: vertical divisions and three horizontal lines.
      ctx.strokeStyle = grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = (w / 2) % GRID; x < w; x += GRID) {
        ctx.moveTo(Math.round(x) + 0.5, 0);
        ctx.lineTo(Math.round(x) + 0.5, h);
      }
      for (const f of [0.2, 0.5, 0.8]) {
        ctx.moveTo(0, Math.round(h * f) + 0.5);
        ctx.lineTo(w, Math.round(h * f) + 0.5);
      }
      ctx.stroke();

      cursor.x += (target.x - cursor.x) * 0.12;
      cursor.y += (target.y - cursor.y) * 0.12;
      cursor.pull += (target.pull - cursor.pull) * 0.06;

      const mid = h / 2;
      const amp = h * 0.16;
      // One vertical division is the gap between graticule lines.
      const div = h * 0.3;
      const toVolts = (y: number) => CENTER_VOLTS + ((mid - y) / div) * VOLTS_PER_DIV;

      // The trace's height at any x, including the cursor's pull.
      const yAt = (x: number) => {
        const wave = Math.sin(x * MAIN_K - time * 0.0016) * 0.7 + Math.sin(x * 0.031 - time * 0.0027) * 0.3;
        const y = mid + wave * amp;
        const near = Math.exp(-((x - cursor.x) ** 2) / (2 * PULL_WIDTH ** 2)) * cursor.pull;
        return y + (cursor.y - y) * near * 0.85;
      };

      let yMin = Infinity;
      let yMax = -Infinity;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 3) {
        const y = yAt(x);
        if (y < yMin) yMin = y;
        if (y > yMax) yMax = y;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const probeY = yAt(cursor.x);
      ctx.strokeStyle = trace;
      ctx.lineWidth = 2;
      ctx.shadowColor = trace;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Scope markings: voltage on each graticule line, channel and scale
      // top-left, live measurements top-right.
      // Line labels up with the page's side margins (the site's shell gutter).
      const pad = w >= 1024 ? 80 : w >= 640 ? 32 : 16;
      const left = Math.max(0, (w - 1440) / 2) + pad;
      const right = w - left;
      ctx.font = FONT;
      ctx.fillStyle = label;
      ctx.textBaseline = "bottom";
      ctx.textAlign = "left";
      for (const f of [0.2, 0.5, 0.8]) {
        ctx.fillText(`${toVolts(h * f).toFixed(2)} V`, left, Math.round(h * f) - 4);
      }
      const top = Math.round(h * 0.2) - 22;
      const scale = `CH1   ${VOLTS_PER_DIV * 1000} mV/div   ${MS_PER_DIV} ms/div`;
      const measure = `Vpp ${(toVolts(yMin) - toVolts(yMax)).toFixed(2)} V   f ${freqHz.toFixed(1)} Hz`;
      ctx.fillText(scale, left, top);
      if (w >= 560) {
        ctx.textAlign = "right";
        ctx.fillText(measure, right, top);
      } else {
        ctx.fillText(measure, left, top - 16);
      }

      // Cursor probe: a dashed line where the mouse is, and the trace's
      // voltage at that point.
      if (cursor.pull > 0.05) {
        const alpha = Math.min(cursor.pull, 1);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = label;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(Math.round(cursor.x) + 0.5, 0);
        ctx.lineTo(Math.round(cursor.x) + 0.5, h);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = trace;
        ctx.beginPath();
        ctx.arc(cursor.x, probeY, 3.5, 0, Math.PI * 2);
        ctx.fill();
        const text = `${toVolts(probeY).toFixed(2)} V`;
        const onLeft = cursor.x > w - 90;
        ctx.textAlign = onLeft ? "right" : "left";
        ctx.textBaseline = "middle";
        ctx.font = `600 ${FONT}`;
        ctx.fillText(text, cursor.x + (onLeft ? -10 : 10), probeY - 14);
        ctx.restore();
      }
    };

    const loop = (time: number) => {
      draw(time);
      if (visible) frame = requestAnimationFrame(loop);
    };

    resize();
    const onResize = () => {
      resize();
      if (reduce) draw(0);
    };
    window.addEventListener("resize", onResize);

    if (reduce) {
      draw(0);
      return () => window.removeEventListener("resize", onResize);
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const box = canvas.getBoundingClientRect();
      const inside = e.clientY > box.top - 60 && e.clientY < box.bottom + 60;
      target.x = e.clientX - box.left;
      target.y = Math.min(Math.max(e.clientY - box.top, 0), box.height);
      target.pull = inside ? 1 : 0;
    };
    const onLeave = () => {
      target.pull = 0;
    };
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);

    const observer = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      if (visible && !wasVisible) frame = requestAnimationFrame(loop);
    });
    observer.observe(canvas);
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  return <canvas ref={ref} aria-hidden="true" className={cn("block h-full w-full", className)} />;
};

export default SignalTrace;
