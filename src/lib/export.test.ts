import { describe, it, expect } from "vitest";
import { toMarkdown } from "./export";
import type { GeneratorResult } from "./types";

describe("toMarkdown", () => {
  it("結果をMarkdownに変換する", () => {
    const result: GeneratorResult = {
      industry: "SaaS",
      purpose: "signup",
      target: "btob",
      sections: [
        {
          id: "hero",
          name: "ヒーロー",
          purpose: "価値提案",
          content: "キャッチコピー",
          reason: "離脱防止",
          headline: "データ分析を、チームの当たり前に",
        },
        {
          id: "cta",
          name: "CTA",
          purpose: "行動喚起",
          content: "ボタン",
          reason: "最終目標",
          headline: "無料で試す",
        },
      ],
    };
    const md = toMarkdown(result);
    expect(md).toContain("# LP構成: SaaS");
    expect(md).toContain("## 1. ヒーロー");
    expect(md).toContain("## 2. CTA");
    expect(md).toContain("データ分析を、チームの当たり前に");
  });
});
