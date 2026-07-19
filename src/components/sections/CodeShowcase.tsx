import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { GitBranch, Check, Cpu, Zap } from 'lucide-react';

/**
 * CodeShowcase — an animated glass "IDE" window for the hero's right column.
 *
 * A syntax-highlighted snippet types itself out line-by-line with a blinking
 * caret, framed by window chrome, a file tab, line numbers and a green build
 * status bar — plus a couple of floating stat chips. Pure eye-candy to impress
 * visitors; freezes fully-typed when the user prefers reduced motion.
 */

type Tok = [text: string, cls: string];

const C = {
  kw: 'text-fuchsia-400',
  fn: 'text-sky-400',
  str: 'text-emerald-400',
  com: 'text-neutral-500 italic',
  pun: 'text-neutral-500',
  vr: 'text-neutral-200',
  prop: 'text-violet-300',
};

// Each line is a list of coloured tokens.
const LINES: Tok[][] = [
  [['// AiTechWorlds — shipping in progress', C.com]],
  [],
  [['import ', C.kw], ['{ deploy }', C.vr], [' from ', C.kw], ["'@aitechworlds/cloud'", C.str], [';', C.pun]],
  [],
  [['async function ', C.kw], ['shipProduct', C.fn], ['() {', C.pun]],
  [['  const ', C.kw], ['app', C.vr], [' = ', C.pun], ['await ', C.kw], ['build', C.fn], ['({', C.pun]],
  [['    stack', C.prop], [': [', C.pun], ["'React'", C.str], [', ', C.pun], ["'Node'", C.str], [', ', C.pun], ["'AI'", C.str], ['],', C.pun]],
  [['    status', C.prop], [': ', C.pun], ["'production-ready'", C.str], [',', C.pun]],
  [['  });', C.pun]],
  [],
  [['  return ', C.kw], ['deploy', C.fn], ['(app, { ', C.pun], ['region', C.prop], [': ', C.pun], ["'global'", C.str], [' });', C.pun]],
  [['}', C.pun]],
];

const lineLen = (line: Tok[]) => line.reduce((n, [t]) => n + t.length, 0);
const lineCost = (line: Tok[]) => Math.max(lineLen(line), 1); // blank lines still advance
const TOTAL = LINES.reduce((n, l) => n + lineCost(l), 0);

const CHAR_MS = 18;
const HOLD_MS = 2600;

const CodeShowcase: React.FC = () => {
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState(0);
  const started = useRef(false);

  // One timer per render: type a char, or hold at the end then loop back to 0.
  useEffect(() => {
    if (reduce) return;
    const delay = typed >= TOTAL ? HOLD_MS : started.current ? CHAR_MS : 600;
    started.current = true;
    const t = setTimeout(() => setTyped((c) => (c >= TOTAL ? 0 : c + 1)), delay);
    return () => clearTimeout(t);
  }, [typed, reduce]);

  const shown = reduce ? TOTAL : typed;

  // Which lines have started, and how many chars of each are visible.
  let acc = 0;
  const lastStarted = (() => {
    let idx = -1;
    let run = 0;
    LINES.forEach((l, i) => {
      if (shown > run) idx = i;
      run += lineCost(l);
    });
    return idx;
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
      className="relative mx-auto w-full max-w-md lg:max-w-none"
    >
      {/* Glow */}
      <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-primary-500/20 blur-3xl" />

      <motion.div
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/80 shadow-2xl backdrop-blur-xl"
      >
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-400/90" />
          <span className="h-3 w-3 rounded-full bg-yellow-400/90" />
          <span className="h-3 w-3 rounded-full bg-green-400/90" />
          <div className="ml-3 flex items-center gap-2 rounded-md bg-white/5 px-3 py-1 text-xs font-medium text-neutral-300">
            <Cpu size={12} className="text-primary-400" />
            ship.ts
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-neutral-500">
            <GitBranch size={12} />
            main
          </div>
        </div>

        {/* Code body */}
        <div className="max-h-[22rem] overflow-hidden px-4 py-4 font-mono text-[13px] leading-relaxed sm:text-sm">
          {LINES.map((line, i) => {
            const start = acc;
            acc += lineCost(line);
            if (i > lastStarted) return (
              <div key={i} className="flex gap-4">
                <span className="w-5 select-none text-right text-neutral-700">{i + 1}</span>
                <span>&nbsp;</span>
              </div>
            );
            const visible = Math.min(shown - start, lineLen(line));
            let used = 0;
            const isActive = i === lastStarted && shown < TOTAL;
            return (
              <div key={i} className="flex gap-4">
                <span className="w-5 select-none text-right text-neutral-700">{i + 1}</span>
                <code className="whitespace-pre">
                  {line.length === 0 ? ' ' : line.map(([text, cls], j) => {
                    const startIdx = used;
                    used += text.length;
                    const show = Math.max(0, Math.min(text.length, visible - startIdx));
                    if (show <= 0) return null;
                    return (
                      <span key={j} className={cls}>{text.slice(0, show)}</span>
                    );
                  })}
                  {isActive && (
                    <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] animate-pulse bg-primary-400" />
                  )}
                </code>
              </div>
            );
          })}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between border-t border-white/10 bg-emerald-500/10 px-4 py-2.5 text-xs">
          <div className="flex items-center gap-2 font-medium text-emerald-400">
            <Check size={14} />
            Build passed · Deployed in 42s
          </div>
          <div className="flex items-center gap-1.5 text-neutral-400">
            <Zap size={12} className="text-yellow-400" />
            99.9% uptime
          </div>
        </div>
      </motion.div>

      {/* Floating chips */}
      <motion.div
        animate={reduce ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}
        className="absolute -right-3 -top-4 hidden rounded-xl border border-white/10 bg-neutral-900/90 px-3 py-2 shadow-xl backdrop-blur sm:block"
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-white">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          CI/CD live
        </div>
      </motion.div>

      <motion.div
        animate={reduce ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity }}
        className="absolute -bottom-5 -left-4 hidden rounded-xl border border-white/10 bg-neutral-900/90 px-3 py-2 shadow-xl backdrop-blur sm:block"
      >
        <div className="text-[10px] uppercase tracking-wider text-neutral-500">Test coverage</div>
        <div className="text-sm font-bold text-white">98.6%</div>
      </motion.div>
    </motion.div>
  );
};

export default CodeShowcase;
