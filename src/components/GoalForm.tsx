import React, { useEffect, useState } from 'react';
import { Check, RotateCcw, Save, PlusCircle } from 'lucide-react';
import {
  GOAL_STATUS_LABELS,
  GoalFormData,
  GoalStatus,
  StudyGoal,
} from '../types/goal';

interface GoalFormProps {
  editingGoal: StudyGoal | null;
  onSubmit: (data: GoalFormData) => void;
  onCancelEdit: () => void;
  titleInputRef: React.RefObject<HTMLInputElement | null>;
}

const QUICK_SUGGESTIONS: Array<{
  title: string;
  description: string;
  daysOffset: number;
}> = [
  {
    title: 'Revisar conceitos básicos de HTML e CSS',
    description: 'Estudar estrutura de páginas web, tags semânticas e criar um layout simples.',
    daysOffset: 7,
  },
  {
    title: 'Praticar 15 exercícios de Lógica',
    description: 'Resolver problemas de condicionais e repetições para ganhar confiança.',
    daysOffset: 10,
  },
  {
    title: 'Ler 1 capítulo de livro técnico por semana',
    description: 'Fazer anotações das ideias principais com minhas próprias palavras.',
    daysOffset: 14,
  },
];

function getDefaultDeadline(daysFromToday = 7): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().split('T')[0];
}

export const GoalForm: React.FC<GoalFormProps> = ({
  editingGoal,
  onSubmit,
  onCancelEdit,
  titleInputRef,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(getDefaultDeadline(7));
  const [status, setStatus] = useState<GoalStatus>(GoalStatus.PENDING);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title);
      setDescription(editingGoal.description);
      setDeadline(editingGoal.deadline);
      setStatus(editingGoal.status);
      setErrorMessage(null);
      setSuccessFeedback(null);
    } else {
      setTitle('');
      setDescription('');
      setDeadline(getDefaultDeadline(7));
      setStatus(GoalStatus.PENDING);
      setErrorMessage(null);
    }
  }, [editingGoal]);

  const handleApplySuggestion = (suggestion: {
    title: string;
    description: string;
    daysOffset: number;
  }) => {
    setTitle(suggestion.title);
    setDescription(suggestion.description);
    setDeadline(getDefaultDeadline(suggestion.daysOffset));
    setStatus(GoalStatus.PENDING);
    setErrorMessage(null);
    titleInputRef.current?.focus();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      setErrorMessage('Por favor, informe um título claro para o seu objetivo de estudo.');
      titleInputRef.current?.focus();
      return;
    }

    if (!trimmedDescription) {
      setErrorMessage(
        'Adicione uma breve descrição do que você pretende estudar ou praticar.'
      );
      return;
    }

    if (!deadline) {
      setErrorMessage('Defina um prazo para ajudar no seu planejamento.');
      return;
    }

    setErrorMessage(null);
    const isEditing = Boolean(editingGoal);

    onSubmit({
      title: trimmedTitle,
      description: trimmedDescription,
      deadline,
      status,
    });

    if (!isEditing) {
      setTitle('');
      setDescription('');
      setDeadline(getDefaultDeadline(7));
      setStatus(GoalStatus.PENDING);
      setSuccessFeedback('Objetivo cadastrado e salvo com sucesso!');
      setTimeout(() => {
        setSuccessFeedback(null);
      }, 3000);
    }
  };

  return (
    <section
      id="formulario-objetivo"
      aria-labelledby="form-heading"
      className="bg-white border border-slate-200 rounded-xl p-6"
    >
      <div className="mb-5">
        <div className="flex items-center justify-between gap-2">
          <h2 id="form-heading" className="text-lg font-semibold text-slate-900">
            {editingGoal ? 'Editar Objetivo de Estudo' : 'Novo Objetivo de Estudo'}
          </h2>
          {editingGoal && (
            <span className="text-xs font-medium text-amber-800">
              Modo de edição ativo
            </span>
          )}
        </div>
        <p className="text-sm text-slate-600 mt-1">
          {editingGoal
            ? 'Atualize as informações abaixo e salve para registrar as mudanças.'
            : 'Defina um passo concreto do que você deseja aprender e estipule uma data realista.'}
        </p>
      </div>

      {!editingGoal && (
        <div className="mb-5 pb-5 border-b border-slate-100">
          <p className="text-xs font-medium text-slate-500 mb-2">
            Sem ideia de como começar? Clique para preencher com um exemplo:
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_SUGGESTIONS.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => handleApplySuggestion(item)}
                className="text-left text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 transition-colors cursor-pointer whitespace-nowrap truncate max-w-full"
              >
                + {item.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {errorMessage && (
          <div
            role="alert"
            className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-800"
          >
            {errorMessage}
          </div>
        )}

        {successFeedback && (
          <div
            role="status"
            className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 flex items-center gap-2"
          >
            <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{successFeedback}</span>
          </div>
        )}

        <div>
          <label
            htmlFor="goal-title"
            className="block text-sm font-medium text-slate-800 mb-1.5"
          >
            Título do objetivo <span className="text-red-600">*</span>
          </label>
          <input
            ref={titleInputRef}
            id="goal-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Ex.: Aprender funções em JavaScript"
            maxLength={100}
            required
            className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="goal-description"
            className="block text-sm font-medium text-slate-800 mb-1.5"
          >
            Descrição detalhada <span className="text-red-600">*</span>
          </label>
          <textarea
            id="goal-description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Descreva o que você vai estudar, quais materiais usará ou como saberá que concluiu este objetivo..."
            rows={3}
            maxLength={400}
            required
            className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-colors resize-y"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="goal-deadline"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              Prazo <span className="text-red-600">*</span>
            </label>
            <input
              id="goal-deadline"
              type="date"
              value={deadline}
              onChange={(e) => {
                setDeadline(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              required
              className="w-full px-3.5 py-2.5 text-sm text-slate-900 font-mono-tabular bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="goal-status"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              Status atual <span className="text-red-600">*</span>
            </label>
            <select
              id="goal-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as GoalStatus)}
              className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-colors cursor-pointer"
            >
              {Object.values(GoalStatus).map((statusValue) => (
                <option key={statusValue} value={statusValue}>
                  {GOAL_STATUS_LABELS[statusValue]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            {editingGoal ? (
              <>
                <Save className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Salvar Alterações</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Cadastrar Objetivo</span>
              </>
            )}
          </button>

          {editingGoal && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Cancelar Edição</span>
            </button>
          )}
        </div>
      </form>
    </section>
  );
};
