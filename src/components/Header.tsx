import React from 'react';
import { Plus } from 'lucide-react';

interface HeaderProps {
  onNewGoalClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewGoalClick }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zona 1: Marca (1 linha, sem subtítulos ou badges acoplados) */}
        <a
          href="#topo"
          className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 rounded"
        >
          StudyFlow
        </a>

        {/* Zona 2: Links de navegação (texto limpo, 1 linha) */}
        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
        >
          <a
            href="#resumo"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Resumo
          </a>
          <a
            href="#formulario-objetivo"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Cadastro
          </a>
          <a
            href="#meus-objetivos"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Objetivos
          </a>
          <a
            href="#dicas-estudo"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Dicas
          </a>
        </nav>

        {/* Zona 3: 1 ação principal */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onNewGoalClick}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Novo Objetivo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
