import { describe, it, expect } from "vitest";
import { generateStructure } from "./generator";
import type { GeneratorInput } from "./types";

describe("generateStructure", () => {
  it("フィットネスジム + 問い合わせ + BtoCで6〜10セクション生成", () => {
    const input: GeneratorInput = {
      industry: "fitness",
      purpose: "inquiry",
      target: "btoc",
    };
    const result = generateStructure(input);
    expect(result.sections.length).toBeGreaterThanOrEqual(6);
    expect(result.sections.length).toBeLessThanOrEqual(10);
  });

  it("全プリセット業種で生成が成功する", () => {
    const industries = [
      "fitness",
      "beauty",
      "restaurant",
      "saas",
      "ec",
      "school",
      "realestate",
      "clinic",
      "consulting",
      "recruit",
    ] as const;
    for (const industry of industries) {
      const result = generateStructure({
        industry,
        purpose: "inquiry",
        target: "btoc",
      });
      expect(result.sections.length, `${industry}`).toBeGreaterThanOrEqual(6);
      expect(result.industry, `${industry}`).toBeTruthy();
    }
  });

  it("カスタム業種は汎用テンプレートで生成される", () => {
    const result = generateStructure({
      industry: "custom",
      customIndustry: "ペットショップ",
      purpose: "inquiry",
      target: "btoc",
    });
    expect(result.sections.length).toBeGreaterThanOrEqual(6);
    expect(result.industry).toBe("ペットショップ");
  });

  it("カスタム業種で名前未指定の場合はフォールバック名", () => {
    const result = generateStructure({
      industry: "custom",
      purpose: "inquiry",
      target: "btoc",
    });
    expect(result.industry).toBe("カスタム業種");
  });

  it("必ずheroが最初、ctaが最後に配置される", () => {
    const result = generateStructure({
      industry: "saas",
      purpose: "signup",
      target: "btob",
    });
    expect(result.sections[0].name).toBe("ヒーロー");
    expect(result.sections[result.sections.length - 1].name).toBe(
      "CTA（行動喚起）"
    );
  });

  it("全セクションにidが付与されている", () => {
    const result = generateStructure({
      industry: "beauty",
      purpose: "inquiry",
      target: "btoc",
    });
    const ids = result.sections.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("全セクションにheadlineが含まれる", () => {
    const result = generateStructure({
      industry: "consulting",
      purpose: "inquiry",
      target: "btob",
    });
    for (const section of result.sections) {
      expect(section.headline, `${section.name}.headline`).toBeTruthy();
    }
  });

  it("BtoBではcasestudyが含まれやすい", () => {
    const result = generateStructure({
      industry: "saas",
      purpose: "inquiry",
      target: "btob",
    });
    const names = result.sections.map((s) => s.name);
    expect(names).toContain("導入事例");
  });

  it("目的がpurchaseのときpricingが含まれる", () => {
    const result = generateStructure({
      industry: "ec",
      purpose: "purchase",
      target: "btoc",
    });
    const names = result.sections.map((s) => s.name);
    expect(names).toContain("料金プラン");
  });

  it("同じ入力で同じ結果が返る（決定的）", () => {
    const input: GeneratorInput = {
      industry: "school",
      purpose: "signup",
      target: "btoc",
    };
    const result1 = generateStructure(input);
    const result2 = generateStructure(input);
    expect(result1.sections.map((s) => s.id)).toEqual(
      result2.sections.map((s) => s.id)
    );
  });
});
