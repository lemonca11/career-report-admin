import type { PromptItem, PromptVersion, PromptStatus } from '@/types/prompt';

const promptSeeds = [
  {
    id: 'P001',
    key: 'report_summary',
    name: '报告摘要生成',
    scene: '报告生成',
    description: '生成报告首页摘要，概括用户画像与关键建议。',
    versionCount: 4,
    status: '已上线',
  },
  {
    id: 'P002',
    key: 'career_persona',
    name: '职业画像生成',
    scene: '画像分析',
    description: '基于用户问卷生成职业特征标签。',
    versionCount: 3,
    status: '已上线',
  },
  {
    id: 'P003',
    key: 'major_fit',
    name: '专业匹配分析',
    scene: '专业分析',
    description: '结合专业与岗位能力要求输出匹配说明。',
    versionCount: 5,
    status: '测试中',
  },
  {
    id: 'P004',
    key: 'industry_trend',
    name: '行业趋势解读',
    scene: '行业洞察',
    description: '生成用户目标行业的趋势与风险提示。',
    versionCount: 4,
    status: '已上线',
  },
  {
    id: 'P005',
    key: 'action_plan',
    name: '90 天行动计划',
    scene: '行动建议',
    description: '按周输出职业规划执行计划。',
    versionCount: 3,
    status: '测试中',
  },
  {
    id: 'P006',
    key: 'interview_advice',
    name: '面试准备建议',
    scene: '求职辅导',
    description: '根据岗位方向生成面试准备重点。',
    versionCount: 4,
    status: '已上线',
  },
  {
    id: 'P007',
    key: 'risk_alert',
    name: '风险预警提示',
    scene: '风控校验',
    description: '识别用户报告中的高风险项并提示运营介入。',
    versionCount: 2,
    status: '测试中',
  },
  {
    id: 'P008',
    key: 'consulting_script',
    name: '咨询跟进话术',
    scene: '运营转化',
    description: '生成顾问回访与转化沟通话术。',
    versionCount: 3,
    status: '已上线',
  },
] as const;

const buildContent = (name: string, scene: string, version: number) => `# ${name} v${version}
你是大学生职业规划报告系统中的 ${scene} 专家顾问。
请根据用户信息：
- 姓名：{{user.name}}
- 学校：{{user.university}}
- 专业：{{user.major}}
- 求职方向：{{careerGoal}}

输出要求：
1. 语言专业、清晰、可执行。
2. 必须给出 3 条最关键建议。
3. 如果用户存在风险项，单独列出“风险提醒”模块。
4. 结尾提供一句鼓励性的行动提醒。`;

const buildVersions = (promptId: string, name: string, scene: string, count: number): PromptVersion[] =>
  Array.from({ length: count }, (_, index) => {
    const version = index + 1;

    return {
      id: `${promptId}-V${version}`,
      version,
      content: buildContent(name, scene, version),
      notes: version === 1 ? '初始化版本' : `补充 ${scene} 输出结构与风格约束`,
      operator: version === count ? '系统管理员' : 'Prompt 运营',
      updatedAt: `2026-03-${String(9 + index * 4).padStart(2, '0')} ${String(10 + index).padStart(2, '0')}:15`,
      isCurrent: version === count,
    };
  });

export const promptsMock: PromptItem[] = promptSeeds.map((seed) => {
  const versions = buildVersions(seed.id, seed.name, seed.scene, seed.versionCount);
  const current = versions[versions.length - 1];

  return {
    id: seed.id,
    key: seed.key,
    name: seed.name,
    scene: seed.scene,
    description: seed.description,
    status: seed.status as PromptStatus,
    currentVersion: current.version,
    updatedAt: current.updatedAt,
    content: current.content,
    versions,
  };
});
