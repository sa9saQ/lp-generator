import type {
  GeneratorInput,
  GeneratorResult,
  Industry,
  Purpose,
  Section,
  Target,
} from "./types";
import { BASE_SECTIONS, } from "./sections";
import { INDUSTRY_LABELS } from "./types";

// Decision table: industry -> section keys (order matters, hero/cta added automatically)
const INDUSTRY_SECTIONS: Record<Exclude<Industry, "custom">, string[]> = {
  fitness: [
    "pain",
    "solution",
    "features",
    "gallery",
    "testimonials",
    "pricing",
    "howItWorks",
    "faq",
  ],
  beauty: [
    "pain",
    "solution",
    "menu",
    "team",
    "gallery",
    "testimonials",
    "howItWorks",
    "faq",
  ],
  restaurant: [
    "gallery",
    "menu",
    "features",
    "team",
    "testimonials",
    "access",
    "faq",
  ],
  saas: [
    "pain",
    "solution",
    "demo",
    "features",
    "stats",
    "pricing",
    "testimonials",
    "faq",
  ],
  ec: [
    "pain",
    "solution",
    "features",
    "comparison",
    "testimonials",
    "pricing",
    "guarantee",
    "faq",
  ],
  school: [
    "pain",
    "solution",
    "features",
    "howItWorks",
    "testimonials",
    "pricing",
    "guarantee",
    "faq",
  ],
  realestate: [
    "gallery",
    "features",
    "stats",
    "howItWorks",
    "testimonials",
    "faq",
    "access",
  ],
  clinic: [
    "pain",
    "solution",
    "team",
    "features",
    "howItWorks",
    "testimonials",
    "gallery",
    "faq",
  ],
  consulting: [
    "pain",
    "solution",
    "features",
    "casestudy",
    "howItWorks",
    "team",
    "faq",
  ],
  recruit: [
    "culture",
    "features",
    "team",
    "testimonials",
    "recruitment",
    "howItWorks",
    "faq",
  ],
};

const CUSTOM_SECTIONS = [
  "pain",
  "solution",
  "features",
  "howItWorks",
  "testimonials",
  "pricing",
  "faq",
];

// Modifiers based on purpose
const PURPOSE_ADDITIONS: Record<Purpose, string[]> = {
  inquiry: [],
  purchase: ["pricing", "guarantee"],
  signup: ["pricing", "guarantee"],
};

// Modifiers based on target
const TARGET_ADDITIONS: Record<Target, string[]> = {
  btob: ["casestudy", "stats"],
  btoc: ["testimonials"],
  both: ["casestudy"],
};

const TARGET_REMOVALS: Record<Target, string[]> = {
  btob: ["gallery"],
  btoc: ["casestudy"],
  both: [],
};

// Headlines per industry x section
type HeadlineMap = Record<string, Record<string, string>>;

const HEADLINES: HeadlineMap = {
  fitness: {
    hero: "3ヶ月で体が変わる。結果に驚く自分に出会おう",
    pain: "こんな悩み、ありませんか？",
    solution: "パーソナルトレーニングで、確実に変わる",
    features: "選ばれる3つの理由",
    gallery: "施設を覗いてみる",
    testimonials: "実際に変わった人の声",
    pricing: "まずは体験から。料金プラン",
    howItWorks: "入会から初回トレーニングまで",
    faq: "はじめる前の疑問を解消",
    cta: "今日が一番若い日。まずは体験予約",
  },
  beauty: {
    hero: "鏡を見るたび、うれしくなる自分へ",
    pain: "こんなこと、気になっていませんか？",
    solution: "あなた専用のケアプランで根本から改善",
    menu: "メニュー・料金",
    team: "担当するスタイリスト",
    gallery: "サロンの雰囲気",
    testimonials: "お客様のリアルな変化",
    howItWorks: "ご予約から施術までの流れ",
    faq: "よくあるご質問",
    cta: "まずは無料カウンセリングから",
  },
  restaurant: {
    hero: "「また来たい」が止まらない味",
    gallery: "料理とお店の雰囲気",
    menu: "本日のおすすめ",
    features: "うちが大事にしていること",
    team: "料理人のこだわり",
    testimonials: "食べた人の感想",
    access: "お店へのアクセス",
    faq: "ご来店前に",
    cta: "席を予約する",
  },
  saas: {
    hero: "データ分析を、チームの当たり前に",
    pain: "レポート作成に何時間かけてる？",
    solution: "ワンクリックで全体像が見える",
    demo: "実際の画面を見てみる",
    features: "主要な機能",
    stats: "導入企業の成果",
    pricing: "プラン比較",
    testimonials: "導入企業の声",
    casestudy: "導入事例",
    faq: "よくある質問",
    cta: "14日間無料で試す",
  },
  ec: {
    hero: "あなたの暮らしを1つ、アップグレードする",
    pain: "「これでいいか」で選んでいませんか？",
    solution: "素材と設計にこだわった1品",
    features: "選ばれる理由",
    comparison: "他製品との違い",
    testimonials: "購入者レビュー",
    pricing: "価格・バリエーション",
    guarantee: "30日間返品保証",
    faq: "購入前のご質問",
    cta: "今すぐ購入する",
  },
  school: {
    hero: "6ヶ月後、履歴書に書けるスキルを手に入れる",
    pain: "独学の限界を感じていませんか？",
    solution: "実務直結のカリキュラムで確実にスキルアップ",
    features: "他のスクールとの違い",
    howItWorks: "受講開始までの流れ",
    testimonials: "卒業生のキャリア変化",
    pricing: "受講料",
    guarantee: "転職保証制度",
    faq: "入校前のご質問",
    cta: "無料カウンセリングを予約する",
  },
  realestate: {
    hero: "「ここに住みたい」を見つける",
    gallery: "物件ギャラリー",
    features: "この物件の特徴",
    stats: "エリアデータ",
    howItWorks: "ご購入までの流れ",
    testimonials: "ご購入者の声",
    faq: "物件に関するご質問",
    access: "現地見学",
    cta: "資料請求・見学予約",
  },
  clinic: {
    hero: "その痛み、原因から治す",
    pain: "こんな症状でお悩みではありませんか？",
    solution: "原因を特定し、根本から改善",
    team: "担当する医師・スタッフ",
    features: "当院の特徴",
    howItWorks: "初診の流れ",
    testimonials: "患者さんの声",
    gallery: "院内の様子",
    faq: "受診前のご質問",
    cta: "Web予約する",
  },
  consulting: {
    hero: "売上が伸びない原因は、1時間で特定できる",
    pain: "こんな課題を感じていませんか？",
    solution: "データに基づく改善提案",
    features: "支援の特徴",
    casestudy: "支援実績",
    howItWorks: "契約から改善までの流れ",
    team: "コンサルタント紹介",
    faq: "よくあるご質問",
    cta: "無料相談を予約する",
  },
  recruit: {
    hero: "一緒に、次の当たり前をつくる仲間を募集中",
    culture: "私たちのカルチャー",
    features: "この会社で働く魅力",
    team: "チームメンバー",
    testimonials: "社員インタビュー",
    recruitment: "募集要項",
    howItWorks: "選考の流れ",
    faq: "応募に関するご質問",
    cta: "エントリーする",
  },
};

const DEFAULT_HEADLINES: Record<string, string> = {
  hero: "あなたのビジネスを次のステージへ",
  pain: "こんなお悩みはありませんか？",
  solution: "その課題、解決できます",
  features: "選ばれる理由",
  howItWorks: "ご利用の流れ",
  pricing: "料金プラン",
  testimonials: "お客様の声",
  casestudy: "導入事例",
  faq: "よくあるご質問",
  cta: "まずはお問い合わせください",
  gallery: "雰囲気を見る",
  team: "スタッフ紹介",
  comparison: "他社との違い",
  guarantee: "安心保証",
  access: "アクセス",
  menu: "メニュー・料金",
  demo: "実際の画面",
  stats: "実績データ",
  media: "メディア掲載",
  recruitment: "募集要項",
  culture: "社風・カルチャー",
};

function getHeadline(
  industry: Exclude<Industry, "custom"> | "custom",
  sectionKey: string
): string {
  if (industry !== "custom" && HEADLINES[industry]?.[sectionKey]) {
    return HEADLINES[industry][sectionKey];
  }
  return DEFAULT_HEADLINES[sectionKey] ?? "";
}

function buildSection(
  key: string,
  industry: Exclude<Industry, "custom"> | "custom"
): Section {
  const base = BASE_SECTIONS[key];
  return {
    id: key,
    name: base.name,
    purpose: base.purpose,
    content: base.content,
    reason: base.reason,
    headline: getHeadline(industry, key),
  };
}

export function generateStructure(input: GeneratorInput): GeneratorResult {
  const { industry, customIndustry, purpose, target } = input;

  const industryLabel =
    industry === "custom"
      ? customIndustry?.trim() || "カスタム業種"
      : INDUSTRY_LABELS[industry];

  // Get base sections for this industry
  const baseSectionKeys =
    industry === "custom"
      ? [...CUSTOM_SECTIONS]
      : [...INDUSTRY_SECTIONS[industry]];

  // Apply purpose modifiers
  for (const key of PURPOSE_ADDITIONS[purpose]) {
    if (!baseSectionKeys.includes(key) && BASE_SECTIONS[key]) {
      // Insert before faq if exists, otherwise at end
      const faqIdx = baseSectionKeys.indexOf("faq");
      if (faqIdx >= 0) {
        baseSectionKeys.splice(faqIdx, 0, key);
      } else {
        baseSectionKeys.push(key);
      }
    }
  }

  // Apply target modifiers
  for (const key of TARGET_ADDITIONS[target]) {
    if (!baseSectionKeys.includes(key) && BASE_SECTIONS[key]) {
      const faqIdx = baseSectionKeys.indexOf("faq");
      if (faqIdx >= 0) {
        baseSectionKeys.splice(faqIdx, 0, key);
      } else {
        baseSectionKeys.push(key);
      }
    }
  }

  // Remove sections based on target
  const removals = TARGET_REMOVALS[target];
  const filteredKeys = baseSectionKeys.filter(
    (key) => !removals.includes(key)
  );

  // Build sections with hero first and cta last
  const industryKey = industry === "custom" ? "custom" : industry;
  const middleSections = filteredKeys
    .filter((key) => key !== "hero" && key !== "cta")
    .map((key) => buildSection(key, industryKey));

  const sections: Section[] = [
    buildSection("hero", industryKey),
    ...middleSections,
    buildSection("cta", industryKey),
  ];

  return {
    industry: industryLabel,
    purpose,
    target,
    sections,
  };
}
