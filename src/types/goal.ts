export enum GoalStatus {
  PENDING = 'pendente',
  IN_PROGRESS = 'em_andamento',
  COMPLETED = 'concluido',
}

export interface StudyGoal {
  id: string;
  title: string;
  description: string;
  deadline: string; // YYYY-MM-DD
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GoalFormData {
  title: string;
  description: string;
  deadline: string;
  status: GoalStatus;
}

export type StatusFilter = 'todos' | GoalStatus;

export const GOAL_STATUS_LABELS: Record<GoalStatus, string> = {
  [GoalStatus.PENDING]: 'Pendente',
  [GoalStatus.IN_PROGRESS]: 'Em andamento',
  [GoalStatus.COMPLETED]: 'Concluído',
};
