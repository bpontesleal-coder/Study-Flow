import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { StudyGoal } from '../types/goal';

interface DeleteConfirmModalProps {
  goalToDelete: StudyGoal | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  goalToDelete,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (!goalToDelete) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goalToDelete, onCancel]);

  if (!goalToDelete) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
    >
      <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-xl space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="delete-modal-title"
                className="text-base font-semibold text-slate-900"
              >
                Confirmar exclusão do objetivo
              </h2>
              <p className="text-xs text-slate-500">
                Esta ação não poderá ser desfeita.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Fechar janela de confirmação"
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div id="delete-modal-description" className="space-y-2 text-sm text-slate-600">
          <p>
            Tem certeza de que deseja excluir o seguinte objetivo de estudo?
          </p>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-medium">
            “{goalToDelete.title}”
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Trash2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Sim, Excluir Objetivo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
