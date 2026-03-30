export type AboutMeLang = 'en' | 'zh-cn'

export type AboutMeProfile = {
  name: string
  title: string
  bioLines: string[]
  careerSummary: string
}

export type CareerItem = {
  location: string
  date: string
  role: string
  company: string
  description?: string
}

export const aboutMeProfile: Record<AboutMeLang, AboutMeProfile> = {
  'en': {
    name: 'FreddieFu',
    title: 'HR (OC & LD) | Freelance Translator',
    bioLines: [
      'HR professional with 5 years of experience specializing in OC and L&D, with a proven track record in event planning and cross-cultural training for overseas business expansion.',
      'Freelance Localization Translator specializing in Gaming & Blockchain. Leveraging AI & CAT tools to deliver culturally resonant, technically precise translations, backed by 100k+ words of experience.',
    ],
    careerSummary: '5-Year HR Specialist (OC & L&D) | 100k+ Words Localization Translator',
  },
  'zh-cn': {
    name: 'FreddieFu',
    title: 'HR (企业文化&学习与发展) | 游戏本地化译员',
    bioLines: [
      '5年HR，深耕企业文化（OC）与人才发展（L&D），在活动策划及出海业务跨文化培训方面拥有丰富实战经验。',
      '游戏与区块链本地化译员。精通 AI 与 CAT 辅助工具，10万余字翻译经验，确保译文在文化与技术准确性上的双重高标准。',
    ],
    careerSummary: '5年HR (企业文化&学习与发展) | 10万字游戏本地化翻译经验',
  },
}

export const aboutMeCareer: Record<AboutMeLang, CareerItem[]> = {
  'en': [
    {
      location: 'Remote',
      date: 'Dec. 2024 — Present',
      role: 'Freelance Translator',
      company: 'Yeehe',
      description:
        'Managed 100k+ words of localization for several games, ensuring high-quality cross-cultural adaptation.\nUtilized MemoQ for terminology management and proofreading of UI/video assets to guarantee content consistency.',
    },
    {
      location: 'Beijing, China',
      date: 'Dec. 2023 — Mar. 2026',
      role: 'HR (OC and L&D)',
      company: 'BR Group',
      description:
        "Led overseas language training projects, managing vendor communication and course delivery via English.\nDeveloped cross-cultural training programs leveraging Hofstede's, Lewis, and Cultural Iceberg models, with customized designs for diverse global markets.",
    },
    {
      location: 'Beijing, China',
      date: 'Jul. 2020 — Apr. 2023',
      role: 'HR (OC)',
      company: 'Ziroom',
      description:
        'Spearheaded large-scale cultural events (1,000+ attendees) from planning to execution, enhancing team cohesion through cross-functional coordination.\nDrove a 13% increase in evaluation participation and strengthened core value adherence by building a data-driven, value-oriented training framework.',
    },
  ],
  'zh-cn': [
    {
      location: '远程',
      date: '2024.12 — 至今',
      role: '游戏本地化译员',
      company: '译禾',
      description:
        '主导知名游戏本地化翻译，累计处理10万余字，确保跨文化表达的准确性与专业度。\n运用 MemoQ 等 CAT 工具管理术语库，负责内容、UI文本及视频脚本的审校，提升内容一致性。',
    },
    {
      location: '中国 · 北京',
      date: '2023.12 — 2026.03',
      role: 'HR (培训文化)',
      company: '百融云创',
      description:
        '独立负责出海业务语言类培训项目，通过英文邮件及线上会议与海外培训供应商沟通，完成课程资源的筛选与交付。\n基于霍夫斯泰德、刘易斯及文化冰山模型，开发跨文化培训课件，并针对不同全球市场实施差异化课程设计。',
    },
    {
      location: '中国 · 北京',
      date: '2020.07 — 2023.04',
      role: 'HR (企业文化)',
      company: '自如',
      description:
        '统筹千人规模的大型文化活动全周期管理，通过跨部门高效协同，有效提升团队凝聚力。\n通过构建数据驱动的价值观评估体系，推动评估参与率提升13%，强化员工对价值观的践行。',
    },
  ],
}
