import { agentsMock } from '@/mock/agents';
import { usersMock } from '@/mock/users';
import type { Order, OrderStatus } from '@/types/order';

const statusCycle: OrderStatus[] = ['待生成', '生成中', '已完成', '生成失败', '异常'];
const products = ['职业规划标准版', '职业规划完整版', 'AI 岗位匹配加速包'];
const reportTypes = ['职业画像 + 岗位匹配', '升学与就业双通道分析', '行业趋势与行动计划'];
const careerGoals = ['互联网产品岗', '金融分析岗', '选调生 / 公职', '品牌与内容方向', '制造业管培生'];
const industryTargets = ['互联网', '金融', '教育', '新能源', '消费品'];

export const ordersMock: Order[] = Array.from({ length: 25 }, (_, index) => {
  const user = usersMock[index % usersMock.length];
  const agent = agentsMock[(index * 2 + 3) % agentsMock.length];
  const status = statusCycle[index % statusCycle.length];
  const amount = index % 3 === 1 ? 299 : index % 3 === 2 ? 399 : 199;
  const createdDay = 29 - (index % 14);
  const updatedDay = createdDay + (status === '已完成' ? 0 : 1);

  return {
    id: `O${String(index + 1).padStart(3, '0')}`,
    orderNo: `CR${2026030001 + index}`,
    userId: user.id,
    userName: user.name,
    agentId: agent.id,
    agentName: agent.name,
    productName: products[index % products.length],
    reportType: reportTypes[index % reportTypes.length],
    amount,
    status,
    paymentStatus: index % 9 === 0 ? '待支付' : '已支付',
    retryCount: index % 5 === 0 ? 1 : index % 11 === 0 ? 2 : 0,
    createdAt: `2026-03-${String(createdDay).padStart(2, '0')} ${String(9 + (index % 10)).padStart(2, '0')}:${String((index * 17) % 60).padStart(2, '0')}`,
    updatedAt: `2026-03-${String(Math.min(updatedDay, 29)).padStart(2, '0')} ${String(10 + (index % 9)).padStart(2, '0')}:${String((index * 19) % 60).padStart(2, '0')}`,
    reportId: status === '已完成' ? `RPT-${String(9000 + index)}` : undefined,
    exceptionNote: status === '异常' ? '画像结构化结果缺失，需要人工复核。' : status === '生成失败' ? '模型超时，建议重试。' : undefined,
    formData: {
      careerGoal: careerGoals[index % careerGoals.length],
      interests: ['数据分析', '用户研究', '内容表达', '项目推进'].slice(0, 2 + (index % 2)),
      strengths: ['逻辑思维', '执行力', '表达能力', '团队协作'].slice(0, 2 + (index % 3)),
      concerns: ['就业竞争压力', '专业匹配度', '实习经历不足'].slice(0, 2 + (index % 2)),
      expectedIndustry: industryTargets[index % industryTargets.length],
      notes: `希望结合 ${user.university}${user.major} 背景提供更明确的岗位建议，并给出未来 90 天行动计划。`,
    },
  };
});
