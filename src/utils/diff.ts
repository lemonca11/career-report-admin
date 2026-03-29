export const buildTextDiff = (oldText: string, newText: string): string => {
  // Simple diff implementation
  return `旧版本:\n${oldText}\n\n新版本:\n${newText}`;
};
