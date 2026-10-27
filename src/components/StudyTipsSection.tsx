import React from 'react';

export const StudyTipsSection: React.FC = () => {
  return (
    <section
      id="dicas-estudo"
      aria-labelledby="tips-heading"
      className="bg-white border border-slate-200 rounded-xl p-6"
    >
      <div className="mb-5">
        <h2 id="tips-heading" className="text-lg font-semibold text-slate-900">
          Como Definir Bons Objetivos de Estudo
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Dicas rápidas para estudantes iniciantes manterem a constância sem sobrecarga.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
        <div className="space-y-1.5">
          <h3 className="text-sm font-semibold text-slate-900">
            01. Divida em metas pequenas
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Em vez de cadastrar “Aprender Programação”, prefira metas específicas
            como “Estudar variáveis e laços de repetição”. Objetivos menores dão
            clareza do que fazer hoje.
          </p>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-sm font-semibold text-slate-900">
            02. Defina prazos realistas
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Escolha datas compatíveis com a sua rotina da semana. Concluir uma
            meta pequena no prazo motiva muito mais do que acumular vários itens
            atrasados.
          </p>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-sm font-semibold text-slate-900">
            03. Foque em um objetivo por vez
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Mantenha apenas 1 ou 2 objetivos com o status “Em andamento” ao mesmo
            tempo. Quando terminar, marque como “Concluído” e passe para o
            próximo.
          </p>
        </div>
      </div>
    </section>
  );
};
