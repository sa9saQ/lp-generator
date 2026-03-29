export type Industry =
  | "fitness"
  | "beauty"
  | "restaurant"
  | "saas"
  | "ec"
  | "school"
  | "realestate"
  | "clinic"
  | "consulting"
  | "recruit"
  | "custom";

export type Purpose = "inquiry" | "purchase" | "signup";

export type Target = "btob" | "btoc" | "both";

export interface GeneratorInput {
  industry: Industry;
  customIndustry?: string;
  purpose: Purpose;
  target: Target;
}

export interface Section {
  id: string;
  name: string;
  purpose: string;
  content: string;
  reason: string;
  headline: string;
}

export interface GeneratorResult {
  industry: string;
  purpose: Purpose;
  target: Target;
  sections: Section[];
}

export const INDUSTRY_LABELS: Record<Industry, string> = {
  fitness: "フィットネスジム",
  beauty: "美容サロン",
  restaurant: "飲食店",
  saas: "SaaS / Webサービス",
  ec: "ECサイト / 物販",
  school: "スクール / 教育",
  realestate: "不動産",
  clinic: "クリニック / 医療",
  consulting: "コンサルティング",
  recruit: "採用 / 人材",
  custom: "その他（自由入力）",
};

export const PURPOSE_LABELS: Record<Purpose, string> = {
  inquiry: "問い合わせ獲得",
  purchase: "購入・申込",
  signup: "会員登録・無料体験",
};

export const TARGET_LABELS: Record<Target, string> = {
  btob: "BtoB（法人向け）",
  btoc: "BtoC（個人向け）",
  both: "両方",
};
