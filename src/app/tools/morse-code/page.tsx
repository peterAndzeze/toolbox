"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

const MORSE_MAP: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....",
  I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.",
  Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....",
  "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--",
  "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...",
  ";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-",
  '"': ".-..-.", "$": "...-..-", "@": ".--.-.", " ": "/",
};

const REVERSE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_MAP).map(([k, v]) => [v, k])
);

const DIT_MS = 80;
const DAH_MS = DIT_MS * 3;
const SYMBOL_GAP_MS = DIT_MS;
const LETTER_GAP_MS = DIT_MS * 3;
const WORD_GAP_MS = DIT_MS * 7;

function isMorseLike(str: string): boolean {
  const s = str.trim();
  if (!s) return false;
  const chars = /^[\s.\-\/]+$/;
  return chars.test(s) && /[.\-]/.test(s);
}

export default function MorseCodePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode" | "auto">("auto");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const detectMode = useMemo(() => {
    if (!input.trim()) return "encode";
    return isMorseLike(input) ? "decode" : "encode";
  }, [input]);

  const effectiveMode = mode === "auto" ? detectMode : mode;

  const convert = useCallback(() => {
    setError("");
    const text = input.trim();
    if (!text) {
      setOutput("");
      return;
    }
    try {
      if (effectiveMode === "encode") {
        const result = text
          .toUpperCase()
          .split("")
          .map((c) => MORSE_MAP[c] ?? (c === " " ? "/" : ""))
          .filter(Boolean)
          .join(" ");
        setOutput(result || "(无法编码的字符已忽略)");
      } else {
        const words = text.split(/\s+\/\s+|\s{2,}/);
        const result = words
          .map((word) =>
            word
              .split(/\s+/)
              .map((sym) => REVERSE_MAP[sym] ?? "")
              .join("")
          )
          .join(" ");
        setOutput(result || "(无法解码)");
      }
    } catch {
      setError("转换失败");
      setOutput("");
    }
  }, [input, effectiveMode]);

  const playMorse = useCallback(async () => {
    const toPlay = effectiveMode === "decode" ? input.trim() : output;
    if (!toPlay || !/[\s.\-\/]/.test(toPlay)) return;

    setIsPlaying(true);
    const ctx = audioCtxRef.current ?? new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    audioCtxRef.current = ctx;
    if (ctx.state === "suspended") await ctx.resume();

    const playBeep = (durationMs: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 600;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + durationMs / 1000);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + durationMs / 1000);
    };

    const symbols = toPlay.split(/\s+/);
    let delay = 0;

    for (let i = 0; i < symbols.length; i++) {
      const sym = symbols[i];
      if (sym === "/") {
        delay += WORD_GAP_MS;
        continue;
      }
      for (const char of sym) {
        if (char === ".") {
          setTimeout(() => playBeep(DIT_MS), delay);
          delay += DIT_MS + SYMBOL_GAP_MS;
        } else if (char === "-") {
          setTimeout(() => playBeep(DAH_MS), delay);
          delay += DAH_MS + SYMBOL_GAP_MS;
        }
      }
      delay += LETTER_GAP_MS - SYMBOL_GAP_MS;
    }

    setTimeout(() => setIsPlaying(false), delay);
  }, [input, output, effectiveMode]);

  const copyResult = () => {
    const toCopy = effectiveMode === "encode" ? output : output;
    if (toCopy) {
      navigator.clipboard.writeText(toCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const REFERENCE_ITEMS = useMemo(() => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((c) => ({ char: c, code: MORSE_MAP[c] }));
    const digits = "0123456789".split("").map((c) => ({ char: c, code: MORSE_MAP[c] }));
    const punct = [".", ",", "?", "'", "!", "/", "(", ")", "&", ":", ";", "=", "+", "-", "_", '"', "$", "@"];
    return { letters, digits, punct: punct.map((c) => ({ char: c, code: MORSE_MAP[c] })) };
  }, []);

  return (
    <ToolPageWrapper>
      <h1 className="page-title text-2xl font-bold sm:text-3xl">摩斯密码转换器</h1>
      <p className="page-subtitle mt-2 text-[var(--muted)]">
        文本与摩斯密码互转，支持自动识别、播放音频，附完整编码对照表
      </p>

      <div className="card mt-6 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {(["auto", "encode", "decode"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setOutput("");
                setError("");
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mode === m ? "btn-primary" : "border border-[var(--card-border)] bg-[var(--card-bg)]"
              }`}
            >
              {m === "auto" ? "自动识别" : m === "encode" ? "编码（文本→摩斯）" : "解码（摩斯→文本）"}
            </button>
          ))}
        </div>

        {mode === "auto" && input.trim() && (
          <p className="mb-3 text-xs text-[var(--muted)]">
            当前识别为：{effectiveMode === "encode" ? "文本" : "摩斯密码"} → {effectiveMode === "encode" ? "摩斯" : "文本"}
          </p>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--muted)]">输入</label>
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setOutput("");
                setError("");
              }}
              placeholder={
                effectiveMode === "encode"
                  ? "输入要转换为摩斯密码的文本..."
                  : "输入摩斯密码（. - 空格分隔，/ 表示词间隔）..."
              }
              className="textarea-tool h-40 w-full rounded-lg p-4 font-mono text-sm"
              spellCheck={false}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--muted)]">输出</label>
            <textarea
              value={output}
              readOnly
              placeholder="转换结果..."
              className="textarea-tool h-40 w-full rounded-lg p-4 font-mono text-sm"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={convert} className="btn-primary rounded-lg px-6 py-2 text-sm font-medium">
            {effectiveMode === "encode" ? "编码" : "解码"}
          </button>
          <button
            onClick={playMorse}
            disabled={effectiveMode === "decode" ? !input.trim() : !output}
            className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium hover:border-[var(--primary)] disabled:opacity-50"
          >
            {isPlaying ? "播放中..." : "播放摩斯音频"}
          </button>
          {(output || (effectiveMode === "decode" && input.trim())) && (
            <button
              onClick={copyResult}
              className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium hover:border-[var(--primary)]"
            >
              {copied ? "已复制 ✓" : "复制结果"}
            </button>
          )}
        </div>
      </div>

      <div className="card mt-8 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-4 text-lg font-semibold">摩斯密码对照表</h2>
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-medium text-[var(--muted)]">字母 A-Z</h3>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-9">
              {REFERENCE_ITEMS.letters.map(({ char, code }) => (
                <div
                  key={char}
                  className="flex items-center justify-between rounded-lg border border-[var(--card-border)] px-3 py-2 text-sm"
                >
                  <span className="font-bold">{char}</span>
                  <span className="font-mono text-xs text-[var(--primary)]">{code}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-[var(--muted)]">数字 0-9</h3>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
              {REFERENCE_ITEMS.digits.map(({ char, code }) => (
                <div
                  key={char}
                  className="flex items-center justify-between rounded-lg border border-[var(--card-border)] px-3 py-2 text-sm"
                >
                  <span className="font-bold">{char}</span>
                  <span className="font-mono text-xs text-[var(--primary)]">{code}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-[var(--muted)]">常用标点</h3>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-9">
              {REFERENCE_ITEMS.punct.map(({ char, code }) => (
                <div
                  key={char}
                  className="flex items-center justify-between rounded-lg border border-[var(--card-border)] px-3 py-2 text-sm"
                >
                  <span className="font-bold">{char === " " ? "空格" : char}</span>
                  <span className="font-mono text-xs text-[var(--primary)]">{code}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs text-[var(--muted)]">
          字母间用空格分隔，词与词之间用 " / " 分隔
        </p>
      </div>

      <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">关于摩斯密码</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          摩斯密码（Morse Code）是一种用短信号（点）和长信号（划）表示字母和数字的编码方式，由 Samuel Morse 于 1830 年代发明。广泛应用于电报通信。本工具采用国际电信联盟（ITU）标准编码。
        </p>
      </div>
    </ToolPageWrapper>
  );
}
