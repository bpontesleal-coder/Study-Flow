import React from 'react';
import { GoalStatus, StudyGoal } from '../types/goal';

interface GoalStatsProps {
  goals: StudyGoal[];
}

export const GoalStats: React.FC<GoalStatsProps> = ({ goals }) => {
  const totalCount = goals.length;
  const pendingCount = goals.filter((g) => g.status === GoalStatus.PENDING).length;
  const inProgressCount = goals.filter((g) => g.status === GoalStatus.IN_PROGRESS).length;
  const completedCount = goals.filter((g) => g.status === GoalStatus.COMPLETED).length;

  const completionPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <section
      id="resumo"
      aria-label="Quantidade de objetivos cadastrados"
      className="bg-white border border-slate-200 rounded-xl p-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Visão Geral dos seus Estudos
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            {totalCount === 0
              ? 'Você ainda não possui objetivos cadastrados. Comece criando sua primeira meta abaixo.'
              : totalCount === 1
              ? 'Você tem 1 objetivo de estudo cadastrado no momento.'
              : `Você tem ${totalCount} objetivos de estudo cadastrados no momento.`}
          </p>
        </div>

        <div className="flex items-baseline gap-2 text-sm text-slate-600">
          <span>Taxa de conclusão:</span>
          <span className="font-mono-tabular font-semibold text-slate-900 text-base">
            {completionPercentage}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500">
            Total Cadastrado
          </p>
          <p
            data-testid="total-goals-count"
            className="text-3xl font-bold text-slate-900 font-mono-tabular"
          >
            {totalCount}
          </p>
          <p className="text-xs text-slate-500">
            {totalCount === 1 ? 'objetivo ativo na lista' : 'objetivos na sua lista'}
          </p>
        </div>

        <div className="space-y-1 border-l border-slate-100 pl-6">
          <p className="text-xs font-medium text-slate-500">
            Pendentes
          </p>
          <p className="text-3xl font-bold text-slate-800 font-mono-tabular">
            {pendingCount}
          </p>
          <p className="text-xs text-slate-500">aguardando início</p>
        </div>

        <div className="space-y-1 border-l border-slate-100 pl-6">
          <p className="text-xs font-medium text-amber-800">
            Em Andamento
          </p>
          <p className="text-3xl font-bold text-amber-700 font-mono-tabular">
            {inProgressCount}
          </p>
          <p className="text-xs text-slate-500">foco de estudo atual</p>
        </div>

        <div className="space-y-1 border-l border-slate-100 pl-6">
          <p className="text-xs font-medium text-emerald-800">
            Concluídos
          </p>
          <p className="text-3xl font-bold text-emerald-700 font-mono-tabular">
            {completedCount}
          </p>
          <p className="text-xs text-slate-500">metas alcançadas</p>
        </div>
      </div>
    </section>
  );
};
