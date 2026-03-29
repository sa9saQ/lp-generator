"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import InputForm from "@/components/InputForm";
import ResultView from "@/components/ResultView";
import { generateStructure } from "@/lib/generator";
import { decodeInput, encodeInput } from "@/lib/url";
import type { GeneratorInput, GeneratorResult } from "@/lib/types";

function GeneratorApp() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<GeneratorResult | null>(null);
  const [currentInput, setCurrentInput] = useState<GeneratorInput | null>(null);
  const [initialInput, setInitialInput] = useState<GeneratorInput | null>(null);

  useEffect(() => {
    const query = searchParams.toString();
    if (query) {
      const decoded = decodeInput(query);
      if (decoded) {
        setInitialInput(decoded);
        setCurrentInput(decoded);
        setResult(generateStructure(decoded));
      }
    }
  }, [searchParams]);

  const handleGenerate = useCallback((input: GeneratorInput) => {
    const generated = generateStructure(input);
    setCurrentInput(input);
    setResult(generated);

    const params = encodeInput(input);
    window.history.pushState(null, "", `?${params}`);
  }, []);

  const handleReset = useCallback(() => {
    setResult(null);
    setCurrentInput(null);
    setInitialInput(null);
    window.history.pushState(null, "", window.location.pathname);
  }, []);

  return (
    <>
      {/* Header */}
      <header className="px-6 pt-12 pb-8 text-center sm:pt-16 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
          className="mb-4 inline-flex items-center gap-2 px-3 py-1 text-xs font-medium"
          style={{
            borderRadius: "999px",
            border: "1px solid var(--border-medium)",
            color: "var(--cyan)",
            background: "rgba(6, 182, 212, 0.06)",
          }}
        >
          <span
            className="inline-block h-1.5 w-1.5"
            style={{
              borderRadius: "999px",
              backgroundColor: "var(--cyan)",
            }}
          />
          無料ツール
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0, 0, 0.2, 1] }}
          className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
          style={{
            fontFamily: "var(--font-heading), system-ui, sans-serif",
            color: "var(--text-primary)",
          }}
        >
          LP構成ジェネレーター
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0, 0, 0.2, 1] }}
          className="mx-auto max-w-md text-sm leading-relaxed sm:text-base"
          style={{ color: "var(--text-secondary)" }}
        >
          業種・目的・ターゲットを選ぶだけ。
          <br className="sm:hidden" />
          配置理由と見出し例つきで、最適なLP構成を提案する。
        </motion.p>
      </header>

      {/* Main */}
      <main className="flex-1 px-6 pb-16 md:px-8">
        {result ? (
          <ResultView result={result} input={currentInput ?? undefined} onReset={handleReset} />
        ) : (
          <InputForm onGenerate={handleGenerate} initialInput={initialInput} />
        )}
      </main>

      {/* Footer */}
      <footer
        className="px-6 py-6 text-center text-xs"
        style={{
          borderTop: "1px solid var(--border-subtle)",
          color: "var(--text-muted)",
        }}
      >
        LP構成ジェネレーター by{" "}
        <a
          href="https://my-portfolio-mocha-three-93.vercel.app/"
          className="transition-colors"
          style={{
            color: "var(--text-secondary)",
            transitionTimingFunction: "var(--ease-standard)",
            transitionDuration: "150ms",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--cyan)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--text-secondary)")
          }
        >
          Iori Kobayashi
        </a>
      </footer>
    </>
  );
}

export default function Home() {
  return (
    <Suspense>
      <div className="grain fixed inset-0 pointer-events-none" />
      <div className="relative z-10 flex min-h-full flex-col">
        <GeneratorApp />
      </div>
    </Suspense>
  );
}
