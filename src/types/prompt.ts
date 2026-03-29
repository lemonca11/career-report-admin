export type PromptStatus = '已上线' | '测试中';

export interface PromptVersion {
  id: string;
  version: number;
  content: string;
  notes: string;
  operator: string;
  updatedAt: string;
  isCurrent: boolean;
}

export interface PromptItem {
  id: string;
  key: string;
  name: string;
  scene: string;
  description: string;
  status: PromptStatus;
  currentVersion: number;
  updatedAt: string;
  content: string;
  versions: PromptVersion[];
}
