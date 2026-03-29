export const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN');
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleString('zh-CN');
};

export const formatMoney = (amount: number): string => {
  return `¥${amount.toFixed(2)}`;
};
