import { useMemo, useState } from "react";
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
// in the layout but invisible, so the block never changes size.
const CodeType = ({ code, progress, className }: { code: string; progress: MotionValue<number>; className?: string }) => {
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState(() => Math.round(progress.get() * code.length));
  useMotionValueEvent(progress, "change", (v) => setTyped(Math.round(Math.min(Math.max(v, 0), 1) * code.length)));
  const shown = reduce ? code.length : typed;

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
    <pre className={cn("relative overflow-x-auto overflow-y-hidden font-mono text-[11px] leading-[1.5] [font-variant-ligatures:none] sm:text-[12px] 2xl:text-[13px]", className)}>
      <span className="sr-only">{code}</span>
      <code aria-hidden="true">{parts}</code>
    </pre>
  );
};

export default CodeType;
