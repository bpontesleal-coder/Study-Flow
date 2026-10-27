import { GoalFormData, GoalStatus, StudyGoal } from '../types/goal';

const STORAGE_KEY = 'studyflow:goals:v1';

function isValidGoalStatus(status: unknown): status is GoalStatus {
  return (
    status === GoalStatus.PENDING ||
    status === GoalStatus.IN_PROGRESS ||
    status === GoalStatus.COMPLETED
  );
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `goal_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export const storageService = {
  /**
   * Recupera todos os objetivos armazenados no localStorage.
   */
  getGoals(): StudyGoal[] {
    try {
      const rawData = window.localStorage.getItem(STORAGE_KEY);
      if (!rawData) {
        return [];
      }

      const parsed = JSON.parse(rawData);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter(
        (item): item is StudyGoal =>
          Boolean(item) &&
          typeof item.id === 'string' &&
          typeof item.title === 'string' &&
          typeof item.description === 'string' &&
          typeof item.deadline === 'string' &&
          isValidGoalStatus(item.status)
      );
    } catch (error) {
      console.error('Erro ao carregar objetivos do localStorage:', error);
      return [];
    }
  },

  /**
   * Salva a lista completa de objetivos no localStorage.
   */
  saveGoals(goals: StudyGoal[]): void {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Erro ao salvar objetivos no localStorage:', error);
    }
  },

  /**
   * Cria e persiste um novo objetivo de estudo.
   */
  createGoal(data: GoalFormData): StudyGoal[] {
    const currentGoals = this.getGoals();
    const now = new Date().toISOString();

    const newGoal: StudyGoal = {
      id: generateId(),
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline,
      status: data.status,
      createdAt: now,
      updatedAt: now,
    };

    const updatedGoals = [newGoal, ...currentGoals];
    this.saveGoals(updatedGoals);
    return updatedGoals;
  },

  /**
   * Atualiza um objetivo existente pelo ID e persiste no localStorage.
   */
  updateGoal(id: string, data: GoalFormData): StudyGoal[] {
    const currentGoals = this.getGoals();
    const now = new Date().toISOString();

    const updatedGoals = currentGoals.map((goal) =>
      goal.id === id
        ? {
            ...goal,
            title: data.title.trim(),
            description: data.description.trim(),
            deadline: data.deadline,
            status: data.status,
            updatedAt: now,
          }
        : goal
    );

    this.saveGoals(updatedGoals);
    return updatedGoals;
  },

  /**
   * Atualiza rapidamente apenas o status de um objetivo existente.
   */
  updateGoalStatus(id: string, status: GoalStatus): StudyGoal[] {
    const currentGoals = this.getGoals();
    const now = new Date().toISOString();

    const updatedGoals = currentGoals.map((goal) =>
      goal.id === id
        ? {
            ...goal,
            status,
            updatedAt: now,
          }
        : goal
    );

    this.saveGoals(updatedGoals);
    return updatedGoals;
  },

  /**
   * Exclui um objetivo pelo ID e persiste a lista atualizada.
   */
  deleteGoal(id: string): StudyGoal[] {
    const currentGoals = this.getGoals();
    const updatedGoals = currentGoals.filter((goal) => goal.id !== id);
    this.saveGoals(updatedGoals);
    return updatedGoals;
  },

  /**
   * Carrega exemplos iniciais caso a pessoa estudante queira inspiração.
   */
  seedStarterGoals(): StudyGoal[] {
    const today = new Date();
    const addDays = (days: number): string => {
      const date = new Date(today);
      date.setDate(date.getDate() + days);
      return date.toISOString().split('T')[0];
    };

    const now = today.toISOString();
    const starterGoals: StudyGoal[] = [
      {
        id: generateId(),
        title: 'Fundamentos de Lógica de Programação',
        description:
          'Praticar variáveis, estruturas condicionais (if/else) e laços de repetição resolvendo 10 exercícios práticos.',
        deadline: addDays(7),
        status: GoalStatus.IN_PROGRESS,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        title: 'Estrutura Semântica com HTML5 e CSS3',
        description:
          'Construir uma página simples de portfólio aplicando tags semânticas, Flexbox e responsividade básica.',
        deadline: addDays(14),
        status: GoalStatus.PENDING,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        title: 'Organizar Ambiente e Rotina de Estudos',
        description:
          'Separar 45 minutos diários sem distrações, configurar o editor de código e criar um caderno de resumos.',
        deadline: addDays(2),
        status: GoalStatus.COMPLETED,
        createdAt: now,
        updatedAt: now,
      },
    ];

    this.saveGoals(starterGoals);
    return starterGoals;
  },
};
