import type { GeneratorInput, Industry, Purpose, Target } from "./types";
import { INDUSTRY_LABELS, PURPOSE_LABELS, TARGET_LABELS } from "./types";

export function encodeInput(input: GeneratorInput): string {
  const params = new URLSearchParams();
  params.set("i", input.industry);
  if (input.industry === "custom" && input.customIndustry) {
    params.set("c", input.customIndustry);
  }
  params.set("p", input.purpose);
  params.set("t", input.target);
  return params.toString();
}

export function decodeInput(query: string): GeneratorInput | null {
  const params = new URLSearchParams(query);
  const industry = params.get("i") as Industry | null;
  const purpose = params.get("p") as Purpose | null;
  const target = params.get("t") as Target | null;

  if (!industry || !purpose || !target) return null;
  if (!(industry in INDUSTRY_LABELS)) return null;
  if (!(purpose in PURPOSE_LABELS)) return null;
  if (!(target in TARGET_LABELS)) return null;

  const result: GeneratorInput = { industry, purpose, target };
  if (industry === "custom") {
    const custom = params.get("c");
    if (custom) result.customIndustry = custom;
  }

  return result;
}
