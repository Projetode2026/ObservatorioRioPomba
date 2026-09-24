import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export type ViewTab = 'inicio' | 'monitoramento' | 'mapa' | 'pesca' | 'sobre';

interface NavbarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { key: ViewTab; label: string; tag?: string }[] = [
    { key: 'inicio', label: 'Início' },
    { key: 'monitoramento', label: 'Monitoramento' },
    { key: 'mapa', label: 'Mapa' },
    { key: 'pesca', label: 'Pesca Interativa' },
    { key: 'sobre', label: 'Sobre o Projeto' },
  ];

  const handleNav = (tab: ViewTab) => {
    onSelectTab(tab);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#dbe4dd]">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-17 flex items-center justify-between gap-6">
        {/* Brand identity */}
        <button
          onClick={() => handleNav('inicio')}
          className="flex items-center gap-3 text-left bg-transparent border-0 p-0 cursor-pointer group"
          aria-label="Ir para o início do Observatório Rio Pomba"
        >
          <div className="w-9 h-9 rounded-lg bg-[#164a2f] flex items-center justify-center shrink-0 shadow-xs">
            <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none">
              <path
                d="M6 24C10 18 14 28 18 22C22 16 26 26 34 18"
                stroke="#8fc7dd"
                strokeWidth="2.6"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M8 15C13 9 17 13 22 9"
                stroke="#6fb989"
                strokeWidth="2.4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-[18px] font-bold text-[#0e2b1c] tracking-tight">
              Observatório Rio Pomba
            </span>
            <span className="font-mono text-[11px] text-[#125575] tracking-normal">
              monitoramento &amp; biodiversidade
            </span>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5" aria-label="Navegação principal">
          {navItems.map((item) => {
            const isActive = currentTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNav(item.key)}
                className={`px-3.5 py-2 text-[14.5px] font-medium transition-colors cursor-pointer rounded-full ${
                  isActive
                    ? 'bg-[#164a2f] text-white font-semibold shadow-xs'
                    : 'text-[#48584f] hover:text-[#0e2b1c] hover:bg-[#c7e3d1]/40'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg border border-[#dbe4dd] text-[#0e2b1c] bg-white hover:bg-[#f5f8f4] cursor-pointer"
          aria-label={mobileOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 border-b border-[#dbe4dd] bg-white px-4 py-3 space-y-1 shadow-xl z-50">
          {navItems.map((item) => {
            const isActive = currentTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNav(item.key)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer flex items-center justify-between ${
                  isActive
                    ? 'bg-[#164a2f] text-white font-medium'
                    : 'text-[#48584f] hover:bg-[#f5f8f4] hover:text-[#0e2b1c]'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
