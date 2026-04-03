import { agentsMock } from '@/mock/agents';
import { usersMock } from '@/mock/users';
import type { Order, OrderStatus } from '@/types/order';

const statusCycle: OrderStatus[] = ['待生成', '生成中', '已完成', '生成失败', '异常'];
const products = ['职业规划标准版', '职业规划完整版', 'AI 岗位匹配加速包'];
const reportTypes = ['职业画像 + 岗位匹配', '升学与就业双通道分析', '行业趋势与行动计划'];
const genders = ['男', '女'];
const provinces = ['北京', '上海', '广东', '浙江', '江苏', '山东', '河南', '四川', '湖北', '湖南'];
const politicalStatuses = ['群众', '团员', '党员'];
const majorSatisfactions = ['是自己想学的专业', '非满意'];
const postgraduateIntents = ['一定要读研究生', '考虑读研', '不确定', '不读研'];
const postgraduatePreferences = ['国内读研优先', '出国读研优先', '都可以'];
const employmentPreferences = ['央国企就业', '外企就业', '互联网大厂', '创业公司', '公务员/事业单位'];
const cities = ['北京', '上海', '深圳', '杭州', '广州', '成都', '武汉', '西安', '南京', '苏州'];

export const ordersMock: Order[] = Array.from({ length: 30 }, (_, index) => {
  const user = usersMock[index % usersMock.length];
  const agent = agentsMock[index % agentsMock.length];
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
      studentName: user.name,
      gender: genders[index % 2],
      gaokaoProvince: provinces[index % provinces.length],
      householdRegistration: provinces[(index + 1) % provinces.length],
      undergraduateSchool: user.university,
      undergraduateDepartment: ['计算机学院', '经济管理学院', '文学院', '理学院', '工学院'][index % 5],
      undergraduateMajor: user.major,
      enrollmentYear: String(2020 + (index % 5)),
      politicalStatus: politicalStatuses[index % 3],
      majorSatisfaction: majorSatisfactions[index % 2],
      postgraduateIntent: postgraduateIntents[index % 4],
      postgraduatePreference: postgraduatePreferences[index % 3],
      employmentPreference: employmentPreferences[index % 5],
      expectedWorkCities: [cities[index % cities.length], cities[(index + 1) % cities.length], cities[(index + 2) % cities.length]].slice(0, 1 + (index % 3)),
    },
  };
});
