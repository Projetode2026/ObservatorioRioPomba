import React, { useState, useEffect, useRef } from 'react';
import { Fish } from '../types';
import { FISH, WATER_FACTS } from '../data/riverData';
import { FishVector } from './FishVector';
import { BookOpen, Check, Compass, Fish as FishIcon, Info, Sparkles, X } from 'lucide-react';

export const FishingGame: React.FC = () => {
  const [caughtIds, setCaughtIds] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'biting' | 'resolved'>('idle');
  const [btnText, setBtnText] = useState<string>('Iniciar pescaria');
  const [gameMsg, setGameMsg] = useState<string>(
    'Toque em "Iniciar pescaria" e aguarde o peixe morder a isca.'
  );
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
  const [isBiting, setIsBiting] = useState<boolean>(false);
  const [selectedFish, setSelectedFish] = useState<Fish | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalFact, setModalFact] = useState<string>(WATER_FACTS[0]);
  const [factText, setFactText] = useState<string>(
    'A diversidade de peixes de um rio é um retrato vivo da qualidade da sua água. Comece a pescar para descobrir mais curiosidades.'
  );

  const biteTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (biteTimeoutRef.current) clearTimeout(biteTimeoutRef.current);
    };
  }, []);

  const handleBtnClick = () => {
    if (gameState === 'idle') {
      startWaiting();
    } else if (gameState === 'biting') {
      resolveCatch(true);
    }
  };

  const startWaiting = () => {
    setGameState('waiting');
    setBtnText('Aguardando...');
    setBtnDisabled(true);
    setIsBiting(false);
    setGameMsg('A isca está na água. Fique atento ao movimento…');
    const delay = 1400 + Math.random() * 2600;
    biteTimeoutRef.current = window.setTimeout(startBiting, delay);
  };

  const startBiting = () => {
    setGameState('biting');
    setBtnDisabled(false);
    setBtnText('Fisgar!');
    setIsBiting(true);
    setGameMsg('O peixe mordeu a isca — toque em "Fisgar!" agora!');
    biteTimeoutRef.current = window.setTimeout(() => resolveCatch(false), 1250);
  };

  const resolveCatch = (success: boolean) => {
    if (biteTimeoutRef.current) clearTimeout(biteTimeoutRef.current);
    setIsBiting(false);
    if (success) {
      setGameState('resolved');
      setBtnDisabled(true);
      setBtnText('Puxando...');
      setGameMsg('Boa! Puxando a linha…');
      setTimeout(() => {
        const f = pickFish();
        setCaughtIds((prev) => (prev.includes(f.id) ? prev : [...prev, f.id]));
        openModal(f);
        resetGame();
      }, 550);
    } else {
      setGameState('resolved');
      setBtnDisabled(true);
      setGameMsg('O peixe escapou dessa vez. Tente novamente!');
      setTimeout(resetGame, 900);
    }
  };

  const resetGame = () => {
    setGameState('idle');
    setBtnDisabled(false);
    setBtnText('Iniciar pescaria');
    setGameMsg('Toque em "Iniciar pescaria" e aguarde o peixe morder a isca.');
  };

  const pickFish = (): Fish => {
    const weighted = FISH.map((f) => ({
      f,
      w: caughtIds.includes(f.id) ? f.weight * 0.35 : f.weight,
    }));
    const total = weighted.reduce((s, x) => s + x.w, 0);
    let r = Math.random() * total;
    for (const x of weighted) {
      r -= x.w;
      if (r <= 0) return x.f;
    }
    return weighted[weighted.length - 1].f;
  };

  const openModal = (f: Fish) => {
    setSelectedFish(f);
    const fact = WATER_FACTS[Math.floor(Math.random() * WATER_FACTS.length)];
    setModalFact(fact);
    setFactText(fact);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Interactive Sampling Canvas */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative rounded-2xl overflow-hidden min-h-[380px] sm:min-h-[440px] bg-gradient-to-b from-[#eaf4ee] via-[#d6ebd9] via-35% to-[#70a887] shadow-sm border border-[#bcdbc7]">
            {/* Water and Riparian Landscape SVG */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 500 440"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Distant Mountains */}
              <path d="M0 220C100 120 200 240 300 180C400 120 500 220 500 220V440H0Z" fill="#88b598" opacity="0.6" />

              {/* River Water Surface */}
              <path d="M0 280C100 240 200 320 300 280C400 240 500 280 500 280V440H0Z" fill="#4a9fb8" opacity="0.8" />
              <path d="M0 320C100 280 200 360 300 320C400 280 500 320 500 320V440H0Z" fill="#3a8aa3" opacity="0.85" />

              {/* Water Ripples */}
              <g stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.3">
                <path d="M0 300q60-20 120 0t120 0 120 0 120 0" />
                <path d="M0 350q60-20 120 0t120 0 120 0 120 0" />
                <path d="M0 400q60-20 120 0t120 0 120 0 120 0" />
              </g>

              {/* Aquatic Reeds */}
              <g opacity="0.9">
                <path d="M40 440V350M55 440V340M70 440V360" stroke="#1c573c" strokeWidth="4" strokeLinecap="round" />
                <path d="M430 440V350M445 440V340M460 440V360" stroke="#1c573c" strokeWidth="4" strokeLinecap="round" />
              </g>
            </svg>

            {/* Scientific Canvas Overlays */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-mono text-[#0a2e1d] border border-[#bcdbc7] shadow-2xs">
              <Compass className="w-3.5 h-3.5 text-[#125575]" />
              <span>Amostragem Ictiológica</span>
            </div>

            {/* Interaction Center & Button */}
            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center justify-end p-4 sm:p-6 gap-3 bg-gradient-to-t from-[#0e2b1c]/40 via-transparent to-transparent">
              <div className="bg-white/95 text-[#0a2e1d] px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl text-xs sm:text-sm font-mono text-center max-w-[95%] sm:max-w-[90%] shadow-lg border border-[#bcdbc7]">
                {gameMsg}
              </div>

              <button
                onClick={handleBtnClick}
                disabled={btnDisabled}
                className={`w-full sm:w-auto py-3.5 px-8 rounded-xl font-sans font-semibold text-sm sm:text-base shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2.5 touch-manipulation ${
                  isBiting
                    ? 'bg-[#fbbf24] text-[#0f2d1e] scale-102 shadow-xl animate-pulse font-bold'
                    : 'bg-[#164a2f] text-white hover:bg-[#0e2b1c] active:scale-98'
                } ${btnDisabled ? 'opacity-70 cursor-default' : ''}`}
              >
                <FishIcon className="w-5 h-5" />
                <span>{btnText}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scientific Field Album / Notebook Card */}
        <div className="lg:col-span-5 bg-white border border-[#dbe4dd] rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#e9efe9] pb-3">
            <h3 className="text-xl font-display font-semibold text-[#0e2b1c]">
              Álbum de espécies
            </h3>
            <span className="font-mono text-xs text-[#7c8d83]">
              {caughtIds.length}/{FISH.length}
            </span>
          </div>
          {/* Progress Bar */}
          <div>
            <div className="h-2 bg-[#edf2ee] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#164a2f] transition-all duration-300"
                style={{ width: `${(caughtIds.length / FISH.length) * 100}%` }}
              />
            </div>
          </div>
          {/* 10 Species Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {FISH.map((fish) => {
              const found = caughtIds.includes(fish.id);
              return (
                <div
                  key={fish.id}
                  onClick={() => found && openModal(fish)}
                  className={`p-3 rounded-lg border transition-all text-left flex flex-col justify-between min-h-[92px] ${
                    found
                      ? 'bg-[#f4faf6] border-[#a3d4b6] cursor-pointer hover:border-[#164a2f] shadow-2xs'
                      : 'bg-[#fbfcfa] border-[#e9efe9] cursor-default opacity-70'
                  }`}
                  title={found ? `Ver ficha de ${fish.name}` : 'Ainda não descoberto'}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-xs font-semibold text-[#0e2b1c] line-clamp-1">
                      {found ? fish.name : 'Espécime ?'}
                    </span>
                    {found && <Check className="w-3.5 h-3.5 text-[#2c8a5b] shrink-0" />}
                  </div>

                  <span className="text-[10px] font-mono italic text-[#7c8d83] block truncate">
                    {found ? fish.sci : 'Não catalogado'}
                  </span>

                  <div className="h-8 flex items-center justify-center mt-1">
                    <FishVector fish={fish} isDiscovered={found} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fact Box */}
          <div className="bg-gradient-to-br from-[#0e2b1c] to-[#164a2f] border border-[#1b4b32] rounded-xl p-4 text-xs text-[#cfe3d6] space-y-1">
            <strong className="block font-display text-sm font-semibold text-white">
              Você sabia?
            </strong>
            <p className="leading-relaxed font-sans">{factText}</p>
          </div>
        </div>
      </div>

      {/* Biological Species Monograph Modal (Zero-Pill) */}
      {isModalOpen && selectedFish && (
        <div
          className="fixed inset-0 z-50 bg-[#071d12]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-[#dbe4dd]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#0e2b1c] px-6 pt-6 pb-20 text-center relative border-b border-[#1b4b32]">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-[#c7e3d1] hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Fechar ficha científica"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-xs font-mono uppercase tracking-wider text-[#6fb989] mb-1 font-semibold">
                Ficha Ictiológica de Campo
              </div>
              <h3 className="text-2xl font-display font-semibold text-white">
                {selectedFish.name}
              </h3>
              <p className="text-xs font-mono italic text-[#cfe3d6] mt-0.5">
                {selectedFish.sci}
              </p>

              {/* Fish Illustration Floating Circle */}
              <div className="w-24 h-24 mx-auto bg-white rounded-2xl p-3 absolute -bottom-10 left-1/2 -translate-x-1/2 shadow-lg border border-[#dbe4dd] flex items-center justify-center">
                <FishVector fish={selectedFish} isDiscovered={true} />
              </div>
            </div>

            {/* Modal Body: Biological Dossier */}
            <div className="pt-14 p-6 space-y-4 text-xs sm:text-sm">
              {/* Status and Conservation */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e9efe9] pb-3 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      selectedFish.status === 'good'
                        ? 'bg-[#2c8a5b]'
                        : selectedFish.status === 'attn'
                        ? 'bg-[#a3721f]'
                        : 'bg-[#a13d34]'
                    }`}
                  />
                  <span className="font-semibold text-[#0e2b1c]">
                    Sensibilidade: {selectedFish.status === 'good' ? 'Baixa / Resiliente' : 'Moderada / Exigente'}
                  </span>
                </div>
                <span className="text-[#6c8074]">
                  Conservação: <strong>{selectedFish.conservation}</strong>
                </span>
              </div>

              {/* Bio Details List */}
              <div className="space-y-3 text-xs leading-relaxed text-[#48584f]">
                <div>
                  <strong className="text-[#0e2b1c] font-mono uppercase text-[11px] block tracking-wider">
                    Habitat no Rio Pomba:
                  </strong>
                  <span>{selectedFish.habitat}</span>
                </div>

                <div>
                  <strong className="text-[#0e2b1c] font-mono uppercase text-[11px] block tracking-wider">
                    Guilda Trófica &amp; Alimentação:
                  </strong>
                  <span>{selectedFish.feeding}</span>
                </div>

                <div>
                  <strong className="text-[#0e2b1c] font-mono uppercase text-[11px] block tracking-wider">
                    Papel Ecológico &amp; Bioindicação:
                  </strong>
                  <span>{selectedFish.eco}</span>
                </div>

                <div className="bg-[#f5f8f4] border border-[#dbe4dd] rounded-lg p-3 text-xs text-[#2d3a33]">
                  <strong className="text-[#0e2b1c] font-mono block text-[11px] mb-1">
                    Curiosidade Biológica:
                  </strong>
                  <span>{selectedFish.curiosity}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold bg-[#164a2f] text-white hover:bg-[#0e2b1c] transition-colors cursor-pointer"
                >
                  Continuar Amostragem
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
