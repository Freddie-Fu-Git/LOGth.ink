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
      'Around five years of experience in organizational culture and learning and development, covering cultural events, employee recognition, and language and cross-cultural training for overseas business teams.',
      'Freelance translator working on game localization from English to Chinese. Responsibilities include translation, review, terminology research, and localization testing.',
    ],
    careerSummary: 'Organizational culture, learning and development, and game localization.',
  },
  'zh-cn': {
    name: 'FreddieFu',
    title: 'HR (企业文化&学习与发展) | 游戏本地化译员',
    bioLines: [
      '约五年企业文化与学习发展工作经历，涉及文化活动、员工评优，以及出海团队的语言与跨文化培训。',
      '游戏本地化译员，负责英文至简体中文的翻译、审校、术语查证与本地化测试。',
    ],
    careerSummary: '围绕企业文化、学习发展与游戏本地化的工作经历。',
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
        'Translate game content from English to Chinese and review translations. Research terminology. Maintain termbases and translation memories.\nTest localized content for language and display issues. Track fixes and perform regression testing.',
    },
    {
      location: 'Beijing, China',
      date: 'Dec. 2023 — Mar. 2026',
      role: 'HR (Learning & Development)',
      company: 'BR Group',
      description:
        'Managed language and cross-cultural training for overseas business teams and contributed to training programs for graduate hires and managers.\nOrganized annual employee awards and cultural events and led improvements to employee incentive practices.',
    },
    {
      location: 'Beijing, China',
      date: 'Jul. 2020 — Apr. 2023',
      role: 'HR (Organizational Culture)',
      company: 'Ziroom',
      description:
        'Led cultural events and employee recognition programs and coordinated monthly assessments of employee alignment with company values.\nAnalyzed employee turnover, helped build an employee retention dashboard, and worked with local HR teams to implement retention initiatives across cities.',
    },
  ],
  'zh-cn': [
    {
      location: '远程',
      date: '2024.12 — 至今',
      role: '游戏本地化译员',
      company: '译禾',
      description:
        '负责游戏英译中翻译与审校，开展术语查证，维护术语库与翻译记忆库。\n参与本地化测试，检查语言与游戏内显示问题，跟进修改并进行回归验证。',
    },
    {
      location: '中国 · 北京',
      date: '2023.12 — 2026.03',
      role: 'HR（学习与发展）',
      company: '百融云创',
      description:
        '负责出海团队的语言与跨文化培训，参与校招生及管理者培养项目。\n组织年度评优与文化活动，主导员工激励机制的优化。',
    },
    {
      location: '中国 · 北京',
      date: '2020.07 — 2023.04',
      role: 'HR（企业文化）',
      company: '自如',
      description:
        '主导文化活动与员工评优，组织月度价值观测评。\n开展离职数据分析，协作搭建人才保留看板，联动城市 HR 推进人才保留项目。',
    },
  ],
}
