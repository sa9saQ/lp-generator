import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import InputForm from "./InputForm";

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

describe("InputForm", () => {
  it("業種ボタンが全て表示される", () => {
    render(<InputForm onGenerate={vi.fn()} />);
    expect(screen.getAllByText("フィットネスジム").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("SaaS / Webサービス").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("その他（自由入力）").length).toBeGreaterThanOrEqual(1);
  });

  it("生成ボタンをクリックするとonGenerateが呼ばれる", () => {
    const onGenerate = vi.fn();
    const { container } = render(<InputForm onGenerate={onGenerate} />);
    const form = container.querySelector("form")!;
    fireEvent.submit(form);
    expect(onGenerate).toHaveBeenCalledWith({
      industry: "fitness",
      customIndustry: undefined,
      purpose: "inquiry",
      target: "btoc",
    });
  });

  it("カスタム業種選択時に入力欄が表示される", () => {
    render(<InputForm onGenerate={vi.fn()} />);
    const customButtons = screen.getAllByText("その他（自由入力）");
    fireEvent.click(customButtons[0]);
    expect(screen.getAllByLabelText("カスタム業種名").length).toBeGreaterThanOrEqual(1);
  });

  it("カスタム業種が空の場合にエラーが表示される", () => {
    const onGenerate = vi.fn();
    render(<InputForm onGenerate={onGenerate} />);
    const customButtons = screen.getAllByText("その他（自由入力）");
    fireEvent.click(customButtons[0]);
    const submitButtons = screen.getAllByRole("button", { name: "構成を生成する" });
    fireEvent.click(submitButtons[0]);
    expect(screen.getAllByText("業種名を入力してください").length).toBeGreaterThanOrEqual(1);
    expect(onGenerate).not.toHaveBeenCalled();
  });
});
