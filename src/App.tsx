/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { GoalForm } from './components/GoalForm';
import { GoalList } from './components/GoalList';
import { GoalStats } from './components/GoalStats';
import { Header } from './components/Header';
import { StudyTipsSection } from './components/StudyTipsSection';
import { storageService } from './services/storageService';
import {
  GoalFormData,
  GoalStatus,
  StatusFilter,
  StudyGoal,
} from './types/goal';

export default function App() {
  const [goals, setGoals] = useState<StudyGoal[]>(() =>
    storageService.getGoals()
  );
  const [editingGoal, setEditingGoal] = useState<StudyGoal | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<StudyGoal | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const titleInputRef = useRef<HTMLInputElement | null>(null);

  // Sincroniza caso outra aba altere o localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setGoals(storageService.getGoals());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleFocusNewGoal = () => {
    setEditingGoal(null);
    const formElement = document.getElementById('formulario-objetivo');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 150);
  };

  const handleSaveGoal = (data: GoalFormData) => {
    if (editingGoal) {
      const updated = storageService.updateGoal(editingGoal.id, data);
      setGoals(updated);
      setEditingGoal(null);
    } else {
      const updated = storageService.createGoal(data);
      setGoals(updated);
    }
  };

  const handleStartEdit = (goal: StudyGoal) => {
    setEditingGoal(goal);
    const formElement = document.getElementById('formulario-objetivo');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 150);
  };

  const handleCancelEdit = () => {
    setEditingGoal(null);
  };

  const handleQuickStatusChange = (id: string, newStatus: GoalStatus) => {
    const updated = storageService.updateGoalStatus(id, newStatus);
    setGoals(updated);
    if (editingGoal && editingGoal.id === id) {
      setEditingGoal({ ...editingGoal, status: newStatus });
    }
  };

  const handleRequestDelete = (goal: StudyGoal) => {
    setGoalToDelete(goal);
  };

  const handleConfirmDelete = () => {
    if (!goalToDelete) return;

    const updated = storageService.deleteGoal(goalToDelete.id);
    setGoals(updated);

    if (editingGoal && editingGoal.id === goalToDelete.id) {
      setEditingGoal(null);
    }
    setGoalToDelete(null);
  };

  const handleCancelDelete = () => {
    setGoalToDelete(null);
  };

  const handleLoadStarterGoals = () => {
    const seeded = storageService.seedStarterGoals();
    setGoals(seeded);
  };

  return (
    <div id="topo" className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      <Header onNewGoalClick={handleFocusNewGoal} />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-6 py-8 space-y-8">
        {/* Apresentação acolhedora */}
        <section className="space-y-2 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
            Organize sua jornada de aprendizado passo a passo
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Bem-vindo ao StudyFlow. Cadastre seus objetivos de estudo, acompanhe
            seus prazos e celebre cada evolução. Todos os seus dados ficam salvos
            automaticamente neste navegador.
          </p>
        </section>

        {/* Quantidade de objetivos cadastrados e resumo */}
        <GoalStats goals={goals} />

        {/* Área principal: Formulário de Cadastro/Edição + Lista de Cartões */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <GoalForm
              editingGoal={editingGoal}
              onSubmit={handleSaveGoal}
              onCancelEdit={handleCancelEdit}
              titleInputRef={titleInputRef}
            />
          </div>

          <div className="lg:col-span-7">
            <GoalList
              goals={goals}
              statusFilter={statusFilter}
              searchQuery={searchQuery}
              editingGoalId={editingGoal ? editingGoal.id : null}
              onStatusFilterChange={setStatusFilter}
              onSearchQueryChange={setSearchQuery}
              onEditGoal={handleStartEdit}
              onRequestDeleteGoal={handleRequestDelete}
              onQuickStatusChange={handleQuickStatusChange}
              onFocusNewGoal={handleFocusNewGoal}
              onLoadStarterGoals={handleLoadStarterGoals}
            />
          </div>
        </div>

        {/* Seção educativa de apoio ao estudante iniciante */}
        <StudyTipsSection />
      </main>

      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-[1280px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>StudyFlow — Planejador de estudos para iniciantes.</p>
          <p>
            Seus objetivos ficam salvos localmente no navegador (localStorage).
          </p>
        </div>
      </footer>

      {/* Modal de confirmação antes de excluir */}
      <DeleteConfirmModal
        goalToDelete={goalToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
