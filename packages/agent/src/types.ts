export const agentStepTypes = ['text', 'action', 'observe'] as const;

export type AgentStepType =
  | (typeof agentStepTypes)[number]
  | AgentOutputStep['type'];

export interface ServerMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AgentServerCallbacks {
  ontext: (content: string) => void;
  onact: (content: string, title: string) => void;
  onactobserve: (content: string, title: string) => Promise<string>;
  onfinish?: () => void;
}

export interface AgentStep {
  type: AgentStepType;
  content: string;
}

export interface AgentTextStep extends AgentStep {
  type: 'text';
}

export interface AgentActionStep extends AgentStep {
  type: 'action';
  title: string;
  observe: boolean;
}

export interface AgentObserveStep extends AgentStep {
  type: 'observe';
}

export type AgentInputStep = AgentTextStep | AgentActionStep | AgentObserveStep;

export type AgentOutputStep = AgentTextStep | AgentActionStep;
