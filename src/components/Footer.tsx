import React from 'react';
import { ViewTab } from './Navbar';

interface FooterProps {
  onSelectTab: (tab: ViewTab) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-[#edf5f0] text-[#335640] py-8 sm:py-11 px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 border-t border-[#d3e3d7]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
        <div className="flex flex-col leading-tight">
          <strong className="text-[#0e2b1c] font-display text-base sm:text-lg font-bold">
            Observatório Rio Pomba
          </strong>
          <span className="text-xs text-[#52705e] font-mono mt-0.5">
            projeto de monitoramento ambiental e educação sobre a Mata Atlântica
          </span>
        </div>

        <p className="text-xs font-mono text-[#52705e] max-w-md leading-relaxed">
          Plataforma demonstrativa. Os dados de monitoramento exibidos são provisórios e serão substituídos pelos dados reais coletados em campo à medida que forem disponibilizados.
        </p>
      </div>
    </footer>
  );
};
