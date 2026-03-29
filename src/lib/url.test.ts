import { describe, it, expect } from "vitest";
import { encodeInput, decodeInput } from "./url";
import type { GeneratorInput } from "./types";

describe("URL encoding/decoding", () => {
  it("入力をURLパラメータにエンコード・デコードできる", () => {
    const input: GeneratorInput = {
      industry: "saas",
      purpose: "signup",
      target: "btob",
    };
    const encoded = encodeInput(input);
    const decoded = decodeInput(encoded);
    expect(decoded).toEqual(input);
  });

  it("カスタム業種もエンコード・デコードできる", () => {
    const input: GeneratorInput = {
      industry: "custom",
      customIndustry: "ペットショップ",
      purpose: "inquiry",
      target: "btoc",
    };
    const encoded = encodeInput(input);
    const decoded = decodeInput(encoded);
    expect(decoded).toEqual(input);
  });

  it("不正なパラメータはnullを返す", () => {
    const decoded = decodeInput("invalid=params");
    expect(decoded).toBeNull();
  });
});
