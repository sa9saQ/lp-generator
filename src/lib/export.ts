import type { GeneratorResult } from "./types";
import { PURPOSE_LABELS, TARGET_LABELS } from "./types";

export function toMarkdown(result: GeneratorResult): string {
  const lines: string[] = [];

  lines.push(`# LP構成: ${result.industry}`);
  lines.push("");
  lines.push(
    `- 目的: ${PURPOSE_LABELS[result.purpose]}`
  );
  lines.push(
    `- ターゲット: ${TARGET_LABELS[result.target]}`
  );
  lines.push(`- セクション数: ${result.sections.length}`);
  lines.push("");
  lines.push("---");
  lines.push("");

  result.sections.forEach((section, i) => {
    lines.push(`## ${i + 1}. ${section.name}`);
    lines.push("");
    lines.push(`> 見出し例: 「${section.headline}」`);
    lines.push("");
    lines.push(`**目的**: ${section.purpose}`);
    lines.push("");
    lines.push(`**推奨コンテンツ**: ${section.content}`);
    lines.push("");
    lines.push(`**配置理由**: ${section.reason}`);
    lines.push("");
    lines.push("---");
    lines.push("");
  });

  return lines.join("\n");
}
