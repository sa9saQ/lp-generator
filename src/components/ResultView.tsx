"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { GeneratorInput, GeneratorResult, Section } from "@/lib/types";
import { PURPOSE_LABELS, TARGET_LABELS } from "@/lib/types";
import { toMarkdown } from "@/lib/export";
import { encodeInput } from "@/lib/url";

interface ResultViewProps {
  result: GeneratorResult;
  input?: GeneratorInput;
  onReset: () => void;
}

export default function ResultView({ result, input, onReset }: ResultViewProps) {
  const [sections, setSections] = useState<Section[]>(result.sections);
  const [copied, setCopied] = useState<"md" | "url" | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSections(result.sections);
  }, [result]);

  useEffect(() => {
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const moveSection = useCallback((index: number, direction: -1 | 1) => {
    setSections((prev) => {
      const next = [...prev];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= next.length) return prev;
      [next[index], next[newIndex]] = [next[newIndex], next[index]];
      return next;
    });
  }, []);

  const handleCopyMarkdown = useCallback(async () => {
    const modifiedResult = { ...result, sections };
    const md = toMarkdown(modifiedResult);
    await navigator.clipboard.writeText(md);
    setCopied("md");
    setTimeout(() => setCopied(null), 2000);
  }, [result, sections]);

  const handleCopyUrl = useCallback(async () => {
    if (!input) return;
    const params = encodeInput(input);
    const url = `${window.location.origin}${window.location.pathname}?${params}`;
    await navigator.clipboard.writeText(url);
    setCopied("url");
    setTimeout(() => setCopied(null), 2000);
  }, [input]);

  return (
    <div ref={resultRef} className="mx-auto w-full max-w-[800px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
        className="mb-8"
      >
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h2
            className="text-xl font-bold sm:text-2xl"
            style={{
              fontFamily: "var(--font-heading), system-ui, sans-serif",
              color: "var(--text-primary)",
            }}
          >
            {result.industry}のLP構成
          </h2>
          <span
            className="text-xs font-medium px-2.5 py-1"
            style={{
              borderRadius: "999px",
              background: "rgba(6, 182, 212, 0.1)",
              color: "var(--cyan)",
            }}
          >
            {sections.length}セクション
          </span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <span>目的: {PURPOSE_LABELS[result.purpose]}</span>
          <span>|</span>
          <span>ターゲット: {TARGET_LABELS[result.target]}</span>
        </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6 flex flex-wrap gap-2"
      >
        <button
          onClick={handleCopyMarkdown}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors"
          style={{
            borderRadius: "6px",
            border: "1px solid var(--border-subtle)",
            background: "var(--bg-card)",
            color: copied === "md" ? "var(--cyan)" : "var(--text-secondary)",
            transitionTimingFunction: "var(--ease-spring)",
            transitionDuration: "150ms",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="5" y="1" width="9" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 5v8.5a1.5 1.5 0 001.5 1.5H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {copied === "md" ? "コピーしました" : "Markdownをコピー"}
        </button>
        <button
          onClick={handleCopyUrl}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors"
          style={{
            borderRadius: "6px",
            border: "1px solid var(--border-subtle)",
            background: "var(--bg-card)",
            color: copied === "url" ? "var(--cyan)" : "var(--text-secondary)",
            transitionTimingFunction: "var(--ease-spring)",
            transitionDuration: "150ms",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6.5 9.5l3-3M7 6.5L5.5 8a2.5 2.5 0 003.5 3.5l.5-.5M9 9.5l1.5-1.5A2.5 2.5 0 007.5 4.5L7 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {copied === "url" ? "コピーしました" : "URLを共有"}
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm font-medium transition-colors"
          style={{
            borderRadius: "6px",
            border: "1px solid var(--border-subtle)",
            background: "var(--bg-card)",
            color: "var(--text-muted)",
            transitionTimingFunction: "var(--ease-standard)",
            transitionDuration: "150ms",
          }}
        >
          やり直す
        </button>
      </motion.div>

      {/* Section cards */}
      <div className="flex flex-col gap-3">
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.35,
              delay: index * 0.05,
              ease: [0.2, 0.8, 0.2, 1],
            }}
            className="relative overflow-hidden"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "12px",
            }}
          >
            <div className="flex items-start gap-4 p-4 sm:p-5">
              {/* Number */}
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center text-sm font-bold"
                style={{
                  borderRadius: "6px",
                  background: "rgba(6, 182, 212, 0.1)",
                  color: "var(--cyan)",
                }}
              >
                {index + 1}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <h3
                    className="text-base font-bold"
                    style={{
                      fontFamily: "var(--font-heading), system-ui, sans-serif",
                      color: "var(--text-primary)",
                    }}
                  >
                    {section.name}
                  </h3>
                </div>
                <p
                  className="mb-2 text-sm font-medium"
                  style={{ color: "var(--amber)" }}
                >
                  &ldquo;{section.headline}&rdquo;
                </p>
                <p
                  className="mb-2 text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {section.purpose}
                </p>
                <div
                  className="mb-2 text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span className="font-medium">推奨コンテンツ:</span>{" "}
                  {section.content}
                </div>
                <div
                  className="flex items-start gap-1.5 text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  >
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M6 8h4M8 6v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span>{section.reason}</span>
                </div>
              </div>

              {/* Move buttons */}
              <div className="flex shrink-0 flex-col gap-1">
                <button
                  onClick={() => moveSection(index, -1)}
                  disabled={index === 0}
                  aria-label={`${section.name}を上に移動`}
                  className="flex h-7 w-7 items-center justify-center transition-colors"
                  style={{
                    borderRadius: "4px",
                    border: "1px solid var(--border-subtle)",
                    color:
                      index === 0
                        ? "var(--border-subtle)"
                        : "var(--text-muted)",
                    transitionTimingFunction: "var(--ease-standard)",
                    transitionDuration: "100ms",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M3 7l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={() => moveSection(index, 1)}
                  disabled={index === sections.length - 1}
                  aria-label={`${section.name}を下に移動`}
                  className="flex h-7 w-7 items-center justify-center transition-colors"
                  style={{
                    borderRadius: "4px",
                    border: "1px solid var(--border-subtle)",
                    color:
                      index === sections.length - 1
                        ? "var(--border-subtle)"
                        : "var(--text-muted)",
                    transitionTimingFunction: "var(--ease-standard)",
                    transitionDuration: "100ms",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
