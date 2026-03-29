import { describe, it, expect } from "vitest";
import { BASE_SECTIONS } from "./sections";

describe("BASE_SECTIONS", () => {
  it("hero と cta は必須セクションとして存在する", () => {
    expect(BASE_SECTIONS.hero).toBeDefined();
    expect(BASE_SECTIONS.cta).toBeDefined();
  });

  it("全セクションに name, purpose, content, reason を持つ", () => {
    for (const [key, section] of Object.entries(BASE_SECTIONS)) {
      expect(section.name, `${key}.name`).toBeTruthy();
      expect(section.purpose, `${key}.purpose`).toBeTruthy();
      expect(section.content, `${key}.content`).toBeTruthy();
      expect(section.reason, `${key}.reason`).toBeTruthy();
    }
  });

  it("10種類以上のセクションが定義されている", () => {
    expect(Object.keys(BASE_SECTIONS).length).toBeGreaterThanOrEqual(10);
  });
});
