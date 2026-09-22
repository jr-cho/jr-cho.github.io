import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// Grid spacing of the faint scope graticule, in CSS pixels.
const GRID = 80;
// How wide the cursor's pull on the trace reaches, in CSS pixels.
const PULL_WIDTH = 140;

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
      ctx.beginPath();
      for (let x = 0; x <= w; x += 3) {
        const wave = Math.sin(x * 0.012 - time * 0.0016) * 0.7 + Math.sin(x * 0.031 - time * 0.0027) * 0.3;
        let y = mid + wave * amp;
        const near = Math.exp(-((x - cursor.x) ** 2) / (2 * PULL_WIDTH ** 2)) * cursor.pull;
        y += (cursor.y - y) * near * 0.85;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = trace;
      ctx.lineWidth = 2;
      ctx.shadowColor = trace;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
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
