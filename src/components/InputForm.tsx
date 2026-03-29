"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { Industry, Purpose, Target, GeneratorInput } from "@/lib/types";
import { INDUSTRY_LABELS, PURPOSE_LABELS, TARGET_LABELS } from "@/lib/types";

interface InputFormProps {
  onGenerate: (input: GeneratorInput) => void;
  initialInput?: GeneratorInput | null;
}

const industryKeys = Object.keys(INDUSTRY_LABELS) as Industry[];
const purposeKeys = Object.keys(PURPOSE_LABELS) as Purpose[];
const targetKeys = Object.keys(TARGET_LABELS) as Target[];

export default function InputForm({ onGenerate, initialInput }: InputFormProps) {
  const [industry, setIndustry] = useState<Industry>(
    initialInput?.industry ?? "fitness"
  );
  const [customIndustry, setCustomIndustry] = useState(
    initialInput?.customIndustry ?? ""
  );
  const [purpose, setPurpose] = useState<Purpose>(
    initialInput?.purpose ?? "inquiry"
  );
  const [target, setTarget] = useState<Target>(
    initialInput?.target ?? "btoc"
  );
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (industry === "custom" && !customIndustry.trim()) {
        setError("業種名を入力してください");
        return;
      }
      setError("");
      onGenerate({
        industry,
        customIndustry: industry === "custom" ? customIndustry.trim() : undefined,
        purpose,
        target,
      });
    },
    [industry, customIndustry, purpose, target, onGenerate]
  );

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
      className="mx-auto w-full max-w-[640px]"
    >
      {/* Industry */}
      <fieldset className="mb-6">
        <legend
          className="mb-3 text-sm font-semibold"
          style={{ color: "var(--text-secondary)" }}
        >
          業種を選択
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {industryKeys.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setIndustry(key);
                setError("");
              }}
              className="px-3 py-2.5 text-sm font-medium transition-colors"
              style={{
                borderRadius: "8px",
                border: `1px solid ${industry === key ? "var(--cyan)" : "var(--border-subtle)"}`,
                background:
                  industry === key
                    ? "rgba(6, 182, 212, 0.08)"
                    : "var(--bg-card)",
                color:
                  industry === key
                    ? "var(--cyan)"
                    : "var(--text-secondary)",
                transitionTimingFunction: "var(--ease-spring)",
                transitionDuration: "150ms",
              }}
            >
              {INDUSTRY_LABELS[key]}
            </button>
          ))}
        </div>
        {industry === "custom" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
            className="mt-3"
          >
            <input
              type="text"
              value={customIndustry}
              onChange={(e) => {
                const val = e.target.value;
                if (val.length <= 30) {
                  setCustomIndustry(val);
                  setError("");
                }
              }}
              placeholder="業種名を入力（最大30文字）"
              className="w-full px-4 py-3 text-base transition-colors"
              style={{
                borderRadius: "8px",
                border: `1px solid ${error ? "#ef4444" : "var(--border-medium)"}`,
                background: "var(--bg-primary)",
                color: "var(--text-primary)",
                fontSize: "16px",
                transitionTimingFunction: "var(--ease-standard)",
                transitionDuration: "150ms",
              }}
              aria-label="カスタム業種名"
              aria-invalid={!!error}
            />
            <div className="mt-1 flex justify-between">
              {error ? (
                <span className="text-xs" style={{ color: "#ef4444" }}>
                  {error}
                </span>
              ) : (
                <span />
              )}
              <span
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                {customIndustry.length}/30
              </span>
            </div>
          </motion.div>
        )}
      </fieldset>

      {/* Purpose */}
      <fieldset className="mb-6">
        <legend
          className="mb-3 text-sm font-semibold"
          style={{ color: "var(--text-secondary)" }}
        >
          LPの目的
        </legend>
        <div className="flex flex-wrap gap-2">
          {purposeKeys.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setPurpose(key)}
              className="px-4 py-2.5 text-sm font-medium transition-colors"
              style={{
                borderRadius: "6px",
                border: `1px solid ${purpose === key ? "var(--cyan)" : "var(--border-subtle)"}`,
                background:
                  purpose === key
                    ? "rgba(6, 182, 212, 0.08)"
                    : "var(--bg-card)",
                color:
                  purpose === key
                    ? "var(--cyan)"
                    : "var(--text-secondary)",
                transitionTimingFunction: "var(--ease-spring)",
                transitionDuration: "150ms",
              }}
            >
              {PURPOSE_LABELS[key]}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Target */}
      <fieldset className="mb-8">
        <legend
          className="mb-3 text-sm font-semibold"
          style={{ color: "var(--text-secondary)" }}
        >
          ターゲット
        </legend>
        <div className="flex flex-wrap gap-2">
          {targetKeys.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTarget(key)}
              className="px-4 py-2.5 text-sm font-medium transition-colors"
              style={{
                borderRadius: "6px",
                border: `1px solid ${target === key ? "var(--cyan)" : "var(--border-subtle)"}`,
                background:
                  target === key
                    ? "rgba(6, 182, 212, 0.08)"
                    : "var(--bg-card)",
                color:
                  target === key
                    ? "var(--cyan)"
                    : "var(--text-secondary)",
                transitionTimingFunction: "var(--ease-spring)",
                transitionDuration: "150ms",
              }}
            >
              {TARGET_LABELS[key]}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Submit */}
      <motion.button
        type="submit"
        whileTap={{ scale: 0.97 }}
        className="w-full py-3.5 text-base font-semibold transition-colors"
        style={{
          borderRadius: "8px",
          backgroundColor: "var(--cyan)",
          color: "var(--bg-primary)",
          transitionTimingFunction: "var(--ease-spring)",
          transitionDuration: "200ms",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--cyan-dim)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--cyan)")
        }
      >
        構成を生成する
      </motion.button>
    </motion.form>
  );
}
