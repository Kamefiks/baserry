export interface User {
  id?: string;
  email?: string;
  name?: string;
}

export interface AppState {
  user: User | null;
  isLoading: boolean;
  theme: "light" | "dark";
  selected: null | string;
  inputPrompt: string;
  tablesCount: number;
}

export interface VapiConfig {
  publicKey: string;
  assistantId?: string;
}

export interface ChartData {
  id: string;
  label: string;
  value: number;
  color?: string;
}

export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
}
