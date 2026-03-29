import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ResultView from "./ResultView";
import type { GeneratorResult } from "@/lib/types";

// Mock framer-motion
vi.mock("framer-motion", () => {
  const createMotionComponent = (tag: string) => {
    const Component = (props: Record<string, unknown>) => {
      const {
        initial: _i, animate: _a, transition: _t, exit: _e,
        whileTap: _wt, whileHover: _wh, variants: _v, layoutId: _l,
        children, ...domProps
      } = props;
      const Tag = tag as unknown as React.ElementType;
      return <Tag {...domProps}>{children as React.ReactNode}</Tag>;
    };
    Component.displayName = `motion.${tag}`;
    return Component;
  };
  return {
    motion: new Proxy({}, { get: (_t, p: string) => createMotionComponent(p) }),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

const mockResult: GeneratorResult = {
  industry: "SaaS / Webサービス",
  purpose: "signup",
  target: "btob",
  sections: [
    {
      id: "hero",
      name: "ヒーロー",
      purpose: "価値提案",
      content: "キャッチコピー",
      reason: "離脱防止",
      headline: "データ分析を始めよう",
    },
    {
      id: "features",
      name: "特徴・強み",
      purpose: "差別化",
      content: "3つの特徴",
      reason: "信頼構築",
      headline: "選ばれる理由",
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

Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
});

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

describe("ResultView", () => {
  it("全セクションカードが表示される", () => {
    render(<ResultView result={mockResult} onReset={vi.fn()} />);
    expect(screen.getAllByText("ヒーロー").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("特徴・強み").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("CTA").length).toBeGreaterThanOrEqual(1);
  });

  it("見出し例が表示される", () => {
    render(<ResultView result={mockResult} onReset={vi.fn()} />);
    expect(screen.getAllByText(/データ分析を始めよう/).length).toBeGreaterThanOrEqual(1);
  });

  it("配置理由が表示される", () => {
    render(<ResultView result={mockResult} onReset={vi.fn()} />);
    expect(screen.getAllByText(/離脱防止/).length).toBeGreaterThanOrEqual(1);
  });

  it("セクション番号が表示される", () => {
    render(<ResultView result={mockResult} onReset={vi.fn()} />);
    expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("2").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("3").length).toBeGreaterThanOrEqual(1);
  });
});
