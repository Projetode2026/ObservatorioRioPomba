import { useState } from 'react';
import { ViewTab, Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { MonitoringView } from './components/MonitoringView';
import { RiverMap } from './components/RiverMap';
import { FishingGame } from './components/FishingGame';
import { AboutView } from './components/AboutView';
import { Footer } from './components/Footer';
import { PointId, ParamKey } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ViewTab>('inicio');
  const [selectedPointId, setSelectedPointId] = useState<PointId>('p2');
  const [selectedParamKey, setSelectedParamKey] = useState<ParamKey>('ph');

  const handleNavigate = (tab: ViewTab, param?: ParamKey, point?: PointId) => {
    if (param) setSelectedParamKey(param);
    if (point) setSelectedPointId(point);
    setCurrentTab(tab);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f8f4] text-[#16241d] font-sans antialiased">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {currentTab === 'inicio' && <HomeView onNavigate={handleNavigate} />}

        {currentTab === 'monitoramento' && (
          <MonitoringView initialParam={selectedParamKey} initialPoint={selectedPointId} />
        )}

        {currentTab === 'mapa' && (
          <div className="space-y-6">
            <div className="max-w-3xl">
              <span className="font-mono text-xs text-[#125575] uppercase tracking-wider block font-semibold">
                Pontos de coleta
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0e2b1c] mt-1">
                Mapa do monitoramento
              </h2>
              <p className="text-sm sm:text-base text-[#48584f] mt-1.5 leading-relaxed">
                Um retrato esquemático do trecho monitorado do Rio Pomba, do ponto mais preservado ao mais urbanizado. Toque em um ponto para ver seus dados mais recentes.
              </p>
            </div>

            <RiverMap
              selectedPointId={selectedPointId}
              onSelectPoint={(ptId) => setSelectedPointId(ptId)}
              onNavigateToMonitoring={(ptId) => handleNavigate('monitoramento', undefined, ptId)}
            />
          </div>
        )}

        {currentTab === 'pesca' && (
          <div className="space-y-6">
            <div className="max-w-3xl">
              <span className="font-mono text-xs text-[#125575] uppercase tracking-wider block font-semibold">
                Jogo educativo
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0e2b1c] mt-1">
                Pesca Interativa
              </h2>
              <p className="text-sm sm:text-base text-[#48584f] mt-1.5 leading-relaxed">
                Espere o peixe fisgar a isca e toque no botão na hora certa para conhecer as espécies que vivem no Rio Pomba. O objetivo aqui é conhecer, não capturar de verdade — nada de pesca predatória.
              </p>
            </div>

            <FishingGame />
          </div>
        )}

        {currentTab === 'sobre' && <AboutView />}
      </main>

      {/* Environmental & Academic Footer */}
      <Footer onSelectTab={(tab) => setCurrentTab(tab)} />
    </div>
  );
}
