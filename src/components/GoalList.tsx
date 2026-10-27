import React from 'react';
import { BookOpen, Plus, Search, Sparkles, X } from 'lucide-react';
import {
  GOAL_STATUS_LABELS,
  GoalStatus,
  StatusFilter,
  StudyGoal,
} from '../types/goal';
import { GoalCard } from './GoalCard';

interface GoalListProps {
  goals: StudyGoal[];
  statusFilter: StatusFilter;
  searchQuery: string;
  editingGoalId: string | null;
  onStatusFilterChange: (filter: StatusFilter) => void;
  onSearchQueryChange: (query: string) => void;
  onEditGoal: (goal: StudyGoal) => void;
  onRequestDeleteGoal: (goal: StudyGoal) => void;
  onQuickStatusChange: (id: string, newStatus: GoalStatus) => void;
  onFocusNewGoal: () => void;
  onLoadStarterGoals: () => void;
}

const FILTER_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'todos', label: 'Todos' },
  { value: GoalStatus.PENDING, label: GOAL_STATUS_LABELS[GoalStatus.PENDING] },
  {
    value: GoalStatus.IN_PROGRESS,
    label: GOAL_STATUS_LABELS[GoalStatus.IN_PROGRESS],
  },
  {
    value: GoalStatus.COMPLETED,
    label: GOAL_STATUS_LABELS[GoalStatus.COMPLETED],
  },
];

export const GoalList: React.FC<GoalListProps> = ({
  goals,
  statusFilter,
  searchQuery,
  editingGoalId,
  onStatusFilterChange,
  onSearchQueryChange,
  onEditGoal,
  onRequestDeleteGoal,
  onQuickStatusChange,
  onFocusNewGoal,
  onLoadStarterGoals,
}) => {
  const filteredGoals = goals.filter((goal) => {
    const matchesStatus =
      statusFilter === 'todos' || goal.status === statusFilter;
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !normalizedQuery ||
      goal.title.toLowerCase().includes(normalizedQuery) ||
      goal.description.toLowerCase().includes(normalizedQuery);

    return matchesStatus && matchesSearch;
  });

  return (
    <section
      id="meus-objetivos"
      aria-labelledby="goals-list-heading"
      className="space-y-5"
    >
      {/* Cabeçalho da lista + Barra de filtros e busca */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2
              id="goals-list-heading"
              className="text-lg font-semibold text-slate-900"
            >
              Meus Objetivos de Estudo
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Exibindo{' '}
              <span className="font-mono-tabular font-semibold text-slate-800">
                {filteredGoals.length}
              </span>{' '}
              de{' '}
              <span className="font-mono-tabular font-semibold text-slate-800">
                {goals.length}
              </span>{' '}
              {goals.length === 1 ? 'objetivo cadastrado' : 'objetivos cadastrados'}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {/* Controles interativos de filtro por status */}
          <div
            role="group"
            aria-label="Filtrar objetivos por status"
            className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto"
          >
            {FILTER_OPTIONS.map((option) => {
              const isActive = statusFilter === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onStatusFilterChange(option.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {/* Campo de busca */}
          <div className="relative w-full md:w-64">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Buscar por título ou tema..."
              aria-label="Buscar objetivos de estudo"
              className="w-full pl-9 pr-8 py-1.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-teal-600 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchQueryChange('')}
                aria-label="Limpar busca"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Estado vazio 1: Nenhum objetivo cadastrado ainda */}
      {goals.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center max-w-2xl mx-auto my-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Nenhum objetivo de estudo cadastrado ainda
          </h3>
          <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
            Sua lista está vazia! Comece cadastrando o seu primeiro objetivo no
            formulário ao lado ou carregue 3 metas de exemplo para conhecer o
            StudyFlow.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onFocusNewGoal}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Criar Primeiro Objetivo</span>
            </button>

            <button
              type="button"
              onClick={onLoadStarterGoals}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Carregar Exemplos para Iniciantes</span>
            </button>
          </div>
        </div>
      ) : filteredGoals.length === 0 ? (
        /* Estado vazio 2: Existem objetivos, mas o filtro/busca não retornou resultados */
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
          <h3 className="text-base font-semibold text-slate-900">
            Nenhum objetivo encontrado para este filtro
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Tente mudar o filtro de status ou limpar o termo pesquisado para ver
            todos os seus objetivos cadastrados.
          </p>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                onStatusFilterChange('todos');
                onSearchQueryChange('');
              }}
              className="px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      ) : (
        /* Lista de cartões de objetivos */
        <div className="grid grid-cols-1 gap-4">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              isBeingEdited={editingGoalId === goal.id}
              onEdit={onEditGoal}
              onRequestDelete={onRequestDeleteGoal}
              onQuickStatusChange={onQuickStatusChange}
            />
          ))}
        </div>
      )}
    </section>
  );
};
