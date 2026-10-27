import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  CircleDashed,
  Pencil,
  Trash2,
} from 'lucide-react';
import { GOAL_STATUS_LABELS, GoalStatus, StudyGoal } from '../types/goal';

interface GoalCardProps {
  goal: StudyGoal;
  isBeingEdited: boolean;
  onEdit: (goal: StudyGoal) => void;
  onRequestDelete: (goal: StudyGoal) => void;
  onQuickStatusChange: (id: string, newStatus: GoalStatus) => void;
}

function formatDeadlinePtBr(dateStr: string): string {
  if (!dateStr) return 'Sem prazo';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

function getDeadlineRelativeInfo(
  dateStr: string,
  status: GoalStatus
): { label: string; isOverdue: boolean; isNear: boolean } {
  if (status === GoalStatus.COMPLETED) {
    return { label: 'Meta concluída', isOverdue: false, isNear: false };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) {
    return { label: '', isOverdue: false, isNear: false };
  }

  const deadlineDate = new Date(year, month - 1, day);
  deadlineDate.setHours(0, 0, 0, 0);

  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const absDays = Math.abs(diffDays);
    return {
      label: absDays === 1 ? 'Prazo venceu ontem' : `Atrasado há ${absDays} dias`,
      isOverdue: true,
      isNear: false,
    };
  }
  if (diffDays === 0) {
    return { label: 'Vence hoje', isOverdue: false, isNear: true };
  }
  if (diffDays === 1) {
    return { label: 'Vence amanhã', isOverdue: false, isNear: true };
  }
  if (diffDays <= 3) {
    return { label: `Restam ${diffDays} dias`, isOverdue: false, isNear: true };
  }
  return { label: `Restam ${diffDays} dias`, isOverdue: false, isNear: false };
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  isBeingEdited,
  onEdit,
  onRequestDelete,
  onQuickStatusChange,
}) => {
  const deadlineInfo = getDeadlineRelativeInfo(goal.deadline, goal.status);

  const renderStatusMeta = (status: GoalStatus) => {
    switch (status) {
      case GoalStatus.COMPLETED:
        return (
          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{GOAL_STATUS_LABELS[status]}</span>
          </span>
        );
      case GoalStatus.IN_PROGRESS:
        return (
          <span className="inline-flex items-center gap-1.5 font-semibold text-amber-700">
            <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{GOAL_STATUS_LABELS[status]}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 font-semibold text-slate-600">
            <CircleDashed className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{GOAL_STATUS_LABELS[status]}</span>
          </span>
        );
    }
  };

  return (
    <article
      className={`bg-white border rounded-xl p-6 transition-colors flex flex-col justify-between gap-4 ${
        isBeingEdited
          ? 'border-teal-600 ring-2 ring-teal-600/15'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="space-y-2.5">
        {/* Metadados em texto limpo com separadores tipográficos (Zero-Pill Discipline) */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          {renderStatusMeta(goal.status)}
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1 font-mono-tabular text-slate-600">
            <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-400" aria-hidden="true" />
            <span>Prazo: {formatDeadlinePtBr(goal.deadline)}</span>
          </span>
          {deadlineInfo.label && (
            <>
              <span aria-hidden="true">·</span>
              <span
                className={`font-medium ${
                  deadlineInfo.isOverdue
                    ? 'text-red-600'
                    : deadlineInfo.isNear
                    ? 'text-amber-700'
                    : 'text-slate-500'
                }`}
              >
                {deadlineInfo.label}
              </span>
            </>
          )}
        </div>

        {/* Título principal do cartão */}
        <h3
          className={`text-lg font-semibold leading-snug ${
            goal.status === GoalStatus.COMPLETED
              ? 'text-slate-500 line-through decoration-slate-300'
              : 'text-slate-900'
          }`}
        >
          {goal.title}
        </h3>

        {/* Descrição do objetivo */}
        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {goal.description}
        </p>
      </div>

      {/* Rodapé de ações do cartão */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Controle interativo rápido de status */}
        <div className="flex items-center gap-2">
          <label
            htmlFor={`status-select-${goal.id}`}
            className="text-xs font-medium text-slate-500 whitespace-nowrap"
          >
            Alterar status:
          </label>
          <select
            id={`status-select-${goal.id}`}
            value={goal.status}
            onChange={(e) =>
              onQuickStatusChange(goal.id, e.target.value as GoalStatus)
            }
            className="text-xs font-medium text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-600 cursor-pointer transition-colors"
          >
            {Object.values(GoalStatus).map((st) => (
              <option key={st} value={st}>
                {GOAL_STATUS_LABELS[st]}
              </option>
            ))}
          </select>
        </div>

        {/* Botões de Editar e Excluir */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => onEdit(goal)}
            aria-label={`Editar objetivo ${goal.title}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Pencil className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Editar</span>
          </button>

          <button
            type="button"
            onClick={() => onRequestDelete(goal)}
            aria-label={`Excluir objetivo ${goal.title}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Excluir</span>
          </button>
        </div>
      </div>
    </article>
  );
};
