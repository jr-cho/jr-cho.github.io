import { useEffect, useMemo, useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

const KEYWORDS = new Set(["while", "if", "else", "float", "break", "return", "int", "void"]);

type Token = { text: string; start: number; kind: "keyword" | "number" | "call" | "plain" };

// Split C source into a few token kinds, enough for quiet highlighting.
function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  const re = /([A-Za-z_]\w*)(?=\s*\()|([A-Za-z_]\w*)|(\d+(?:\.\d+)?f?)|(\s+)|(.)/g;
  for (const m of code.matchAll(re)) {
    const start = m.index;
    if (m[1]) tokens.push({ text: m[1], start, kind: KEYWORDS.has(m[1]) ? "keyword" : "call" });
    else if (m[2]) tokens.push({ text: m[2], start, kind: KEYWORDS.has(m[2]) ? "keyword" : "plain" });
    else if (m[3]) tokens.push({ text: m[3], start, kind: "number" });
    else tokens.push({ text: m[0], start, kind: "plain" });
  }
  return tokens;
}

const kindClass: Record<Token["kind"], string> = {
  keyword: "font-semibold text-foreground",
  call: "text-foreground",
  number: "text-foreground",
  plain: "text-muted-foreground",
};

// Types `code` out as `progress` runs from 0 to 1. Untyped characters stay
// in the layout but invisible, so the block never changes size. On short
// screens the block scales down to fit its container instead of clipping.
const CodeType = ({ code, progress, className }: { code: string; progress: MotionValue<number>; className?: string }) => {
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState(() => Math.round(progress.get() * code.length));
  useMotionValueEvent(progress, "change", (v) => setTyped(Math.round(Math.min(Math.max(v, 0), 1) * code.length)));
  const shown = reduce ? code.length : typed;

  const boxRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const [fit, setFit] = useState(1);
  useEffect(() => {
    const box = boxRef.current;
    const pre = preRef.current;
    if (!box || !pre) return;
    const measure = () => {
      // Measure at natural size. Height must always fit. Width may shrink
      // the text to 80% at most, and anything wider scrolls sideways.
      const current = pre.style.zoom;
      pre.style.zoom = "1";
      const byHeight = box.clientHeight / pre.offsetHeight;
      const byWidth = Math.max(0.8, box.clientWidth / pre.offsetWidth);
      pre.style.zoom = current;
      setFit(Math.min(1, byHeight, byWidth));
    };
    // Re-measure when the box resizes, and once web fonts load, since the
    // font changes the text's natural width.
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    measure();
    let alive = true;
    document.fonts?.ready.then(() => alive && measure());
    return () => {
      alive = false;
      observer.disconnect();
    };
  }, []);

  const tokens = useMemo(() => tokenize(code), [code]);
  const parts = tokens.map((token, i) => {
    const visible = Math.max(0, Math.min(token.text.length, shown - token.start));
    return (
      <span key={i} className={kindClass[token.kind]}>
        {token.text.slice(0, visible)}
        {visible < token.text.length && <span className="opacity-0">{token.text.slice(visible)}</span>}
      </span>
    );
  });

  return (
    <div ref={boxRef} className="h-full overflow-x-auto overflow-y-hidden">
      <pre
        ref={preRef}
        style={fit < 1 ? { zoom: fit } : undefined}
        className={cn("relative w-max font-mono text-[11px] leading-[1.5] [font-variant-ligatures:none] sm:text-[12px] 2xl:text-[13px]", className)}
      >
        <span className="sr-only">{code}</span>
        <code aria-hidden="true">{parts}</code>
      </pre>
    </div>
  );
};

export default CodeType;
