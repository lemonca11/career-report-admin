export const renderTemplate = (template: string, data: Record<string, unknown>): string => {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return String(data[key] ?? match);
  });
};
