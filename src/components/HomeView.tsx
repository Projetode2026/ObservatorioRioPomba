import React from 'react';
import { ViewTab } from './Navbar';
import { PointId, ParamKey } from '../types';
import { POINTS, PARAM_DEF, PARAM_ORDER, latestVal, statusOf, statusLabel, fmtDate, TODAY } from '../data/riverData';
import { ArrowRight, Check } from 'lucide-react';
import { LiquidMarquee } from './LiquidMarquee';

interface HomeViewProps {
  onNavigate: (tab: ViewTab, param?: ParamKey, point?: PointId) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  // Overall status: aggregate latest reading across points + params
  const counts = { good: 0, attn: 0, crit: 0 };
  PARAM_ORDER.forEach((pk) => {
    POINTS.forEach((pt) => {
      const s = statusOf(pk, latestVal(pk, pt.id));
      counts[s]++;
    });
  });

  let overall = 'good';
  if (counts.crit > 0) overall = 'crit';
  else if (counts.attn >= 4) overall = 'attn';

  const overallTitle =
    overall === 'good'
      ? 'Qualidade geral: dentro do esperado'
      : overall === 'attn'
      ? 'Qualidade geral: pontos de atenção'
      : 'Qualidade geral: alerta em ao menos um parâmetro';

  const overallSub = 'Com base na leitura mais recente dos três pontos de coleta.';

  return (
    <div className="space-y-0 -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 sm:-mt-10">
      <style>{`
        @keyframes riverFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .river-gradient-bg {
          background: linear-gradient(270deg, #1a4b32, #0e2b1c, #0d5c45, #05100a, #113824);
          background-size: 400% 400%;
          animation: riverFlow 18s ease infinite;
        }
        .river-gradient-blue {
          background: linear-gradient(270deg, #0f3c5c, #0a2538, #13587c, #061722, #0e314a);
          background-size: 400% 400%;
          animation: riverFlow 18s ease infinite;
        }
      `}</style>
      {/* ===================== HERO ===================== */}
      <section className="river-gradient-bg text-[#cfe3d6] border-b border-[#1b4b32]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-8 sm:pb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <span className="font-mono text-xs sm:text-[13px] text-[#cfe3d6] block tracking-wide">
                Zona da Mata Mineira · Bacia do Paraíba do Sul
              </span>

              <h1 className="font-display text-3xl sm:text-5xl lg:text-[54px] font-semibold text-white leading-[1.14]">
                O Rio Pomba, observado de perto
              </h1>

              <p className="text-[15px] sm:text-[17px] text-[#a3c3b0] leading-relaxed max-w-xl font-sans">
                Uma plataforma aberta para acompanhar a qualidade da água do Rio Pomba ao longo do tempo e conhecer a biodiversidade da Mata Atlântica que vive às suas margens.
              </p>

              {/* Hero Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-3">
                <button
                  onClick={() => onNavigate('monitoramento')}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-xs sm:text-sm bg-[#34d399] text-[#05100a] hover:bg-[#10b981] transition-colors cursor-pointer shadow-xs touch-manipulation"
                >
                  <span>Ver monitoramento</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('pesca')}
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-semibold text-xs sm:text-sm bg-white text-[#164a2f] border border-[#dbe4dd] hover:bg-[#f5f8f4] transition-colors cursor-pointer shadow-xs touch-manipulation"
                >
                  <span>Pesca interativa</span>
                </button>
              </div>
            </div>

            {/* Clean River Schematic - ONLY THE RIVER AND POINTS */}
            <div className="lg:col-span-5 relative select-none">
              <div className="bg-white border border-[#dbe4dd] rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="text-[11px] font-mono text-[#7c8d83] mb-2 flex items-center justify-between">
                  <span>Trecho monitorado</span>
                  <span className="text-[#125575]">Toque nos pontos P1, P2, P3</span>
                </div>
                <svg viewBox="0 0 460 360" className="w-full h-auto block select-none touch-manipulation" fill="none">
                  {/* Main River Course */}
                  <path
                    d="M20 20C80 40 50 120 120 145C200 175 140 230 200 250C280 275 220 330 440 330"
                    stroke="#2d7b9d"
                    strokeWidth="10"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.9"
                  />

                  {/* Marker P1: Camargo */}
                  <g
                    className="cursor-pointer group touch-manipulation"
                    onClick={() => onNavigate('mapa', undefined, 'p1')}
                    transform="translate(120,145)"
                  >
                    <circle r="36" fill="transparent" />
                    <circle r="14" fill="#17698f" />
                    <circle r="5" fill="#ffffff" />
                    <text x="20" y="5" className="font-mono text-xs fill-[#0e2b1c] font-bold">P1</text>
                  </g>

                  {/* Marker P2: Balneário */}
                  <g
                    className="cursor-pointer group touch-manipulation"
                    onClick={() => onNavigate('mapa', undefined, 'p2')}
                    transform="translate(200,250)"
                  >
                    <circle r="36" fill="transparent" />
                    <circle r="14" fill="#17698f" />
                    <circle r="5" fill="#ffffff" />
                    <text x="20" y="5" className="font-mono text-xs fill-[#0e2b1c] font-bold">P2</text>
                  </g>

                  {/* Marker P3: Empa */}
                  <g
                    className="cursor-pointer group touch-manipulation"
                    onClick={() => onNavigate('mapa', undefined, 'p3')}
                    transform="translate(320,320)"
                  >
                    <circle r="36" fill="transparent" />
                    <circle r="14" fill="#17698f" />
                    <circle r="5" fill="#ffffff" />
                    <text x="20" y="5" className="font-mono text-xs fill-[#0e2b1c] font-bold">P3</text>
                  </g>
                </svg>
              </div>
            </div>
          </div>

          {/* Hero Stats */}
          <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-[#dbe4dd]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 bg-white border border-[#dbe4dd] rounded-xl p-3.5 sm:p-5 shadow-xs">
              <div className="space-y-0.5">
                <div className="font-mono text-xl sm:text-3xl font-semibold text-[#0e2b1c]">3</div>
                <div className="text-xs sm:text-sm text-[#48584f]">pontos de coleta monitorados</div>
              </div>

              <div className="space-y-0.5">
                <div className="font-mono text-xl sm:text-3xl font-semibold text-[#0e2b1c]">7</div>
                <div className="text-xs sm:text-sm text-[#48584f]">parâmetros físico-químicos</div>
              </div>

              <div className="space-y-0.5">
                <div className="font-mono text-xl sm:text-3xl font-semibold text-[#0e2b1c]">400+</div>
                <div className="text-xs sm:text-sm text-[#48584f]">dias de série histórica</div>
              </div>

              <div className="space-y-0.5">
                <div className="font-mono text-xl sm:text-3xl font-semibold text-[#0e2b1c]">10</div>
                <div className="text-xs sm:text-sm text-[#48584f]">espécies de peixes catalogadas</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <LiquidMarquee />
      {/* ===================== PANORAMA ATUAL ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-5 sm:space-y-6">
        <div className="max-w-2xl">
          <span className="font-mono text-xs text-[#125575] uppercase tracking-wider font-semibold block">
            Panorama atual
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-semibold text-[#0e2b1c] mt-1">
            Como está o rio agora
          </h2>
          <p className="text-xs sm:text-[15px] text-[#48584f] mt-1.5 sm:mt-2 leading-relaxed">
            Um resumo dos parâmetros físico-químicos monitorados nos três pontos de coleta. Toque em qualquer parâmetro para abrir o histórico completo.
          </p>
        </div>

        {/* Status Band */}
        <div className="river-gradient-bg border border-[#1b4b32] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 text-[#cfe3d6]">
          <div className="flex items-center gap-3">
            <span
              className={`w-3.5 h-3.5 rounded-full shrink-0 ${
                overall === 'good'
                  ? 'bg-[#34d399]'
                  : overall === 'attn'
                  ? 'bg-[#fbbf24]'
                  : 'bg-[#f87171]'
              }`}
            />
            <div>
              <strong className="block font-display text-base sm:text-[18px] text-white font-semibold">
                {overallTitle}
              </strong>
              <span className="text-xs sm:text-[13.5px] text-[#a3c3b0] block mt-0.5">
                {overallSub}
              </span>
            </div>
          </div>

          <span className="font-mono text-[11px] sm:text-xs text-[#a3c3b0] shrink-0">
            atualizado em {fmtDate(TODAY)}
          </span>
        </div>

        {/* Parameter Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 pt-1">
          {PARAM_ORDER.map((pk) => {
            const def = PARAM_DEF[pk];
            const v = latestVal(pk, 'p2');
            const st = statusOf(pk, v);
            const tagStyle =
              st === 'good'
                ? 'bg-[#e6f3ea] text-[#2c8a5b]'
                : st === 'attn'
                ? 'bg-[#faf1de] text-[#a3721f]'
                : 'bg-[#f8e7e4] text-[#a13d34]';

            return (
              <button
                key={pk}
                onClick={() => onNavigate('monitoramento', pk, 'p2')}
                className="bg-white border border-[#dbe4dd] hover:border-[#3a91b6] rounded-xl p-3 sm:p-5 text-left transition-all cursor-pointer shadow-xs hover:-translate-y-0.5 group flex flex-col justify-between touch-manipulation"
              >
                <div>
                  <div className="text-[11px] sm:text-xs text-[#48584f] font-medium truncate">{def.name}</div>
                  <div className="font-mono text-lg sm:text-2xl font-semibold text-[#0e2b1c] mt-1 leading-none truncate">
                    {v.toFixed(def.decimals)}
                    <small className="text-[10.5px] sm:text-xs font-medium text-[#7c8d83] ml-1">
                      {def.unit}
                    </small>
                  </div>
                </div>

                <div className="mt-3">
                  <span className={`inline-block text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-semibold ${tagStyle}`}>
                    {statusLabel(st)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-1">
          <span className="inline-flex items-center gap-2 bg-[#faf1de] text-[#a3721f] border border-[#ecd9ae] px-3 py-1.5 rounded-full text-xs font-semibold font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a3721f]" />
            Dados demonstrativos — série provisória para fins de apresentação da plataforma
          </span>
        </div>
      </section>

      {/* ===================== O RIO ===================== */}
      <section className="bg-[#f0f4ee] border-y border-[#dbe4dd] py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-start">
            <div className="space-y-3 sm:space-y-4">
              <span className="font-mono text-xs text-[#125575] uppercase tracking-wider font-semibold block">
                O rio
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-semibold text-[#0e2b1c]">
                Um curso d'água da Zona da Mata mineira
              </h2>
              <p className="text-xs sm:text-[15px] text-[#48584f] leading-relaxed">
                O Rio Pomba nasce na Serra da Mantiqueira e percorre municípios da Zona da Mata de Minas Gerais até desaguar no Rio Paraíba do Sul. Ao longo do seu curso, atravessa remanescentes de Mata Atlântica, áreas de pastagem e trechos urbanos — um mosaico que influencia diretamente a qualidade da água e a vida que ela sustenta.
              </p>
              <p className="text-xs sm:text-[15px] text-[#48584f] leading-relaxed">
                Este observatório acompanha três pontos ao longo do rio, do trecho mais preservado ao mais urbanizado, permitindo comparar como diferentes usos do solo se refletem nos parâmetros medidos.
              </p>
            </div>

            <div className="space-y-2.5 sm:space-y-3">
              <div className="bg-white border border-[#dbe4dd] rounded-xl p-4 sm:p-5 shadow-xs space-y-1">
                <h4 className="font-display font-semibold text-[#0e2b1c] text-sm sm:text-[16px]">
                  Mata Atlântica remanescente
                </h4>
                <p className="text-xs sm:text-[13.8px] text-[#48584f] leading-relaxed">
                  Fragmentos de mata ciliar ao longo do curso do rio abrigam parte da biodiversidade que o projeto busca documentar e proteger.
                </p>
              </div>

              <div className="bg-white border border-[#dbe4dd] rounded-xl p-4 sm:p-5 shadow-xs space-y-1">
                <h4 className="font-display font-semibold text-[#0e2b1c] text-sm sm:text-[16px]">
                  Bacia do Paraíba do Sul
                </h4>
                <p className="text-xs sm:text-[13.8px] text-[#48584f] leading-relaxed">
                  O Rio Pomba é um dos principais afluentes do Paraíba do Sul, contribuindo para o abastecimento de várias cidades da região.
                </p>
              </div>

              <div className="bg-white border border-[#dbe4dd] rounded-xl p-4 sm:p-5 shadow-xs space-y-1">
                <h4 className="font-display font-semibold text-[#0e2b1c] text-sm sm:text-[16px]">
                  Indicador biológico
                </h4>
                <p className="text-xs sm:text-[13.8px] text-[#48584f] leading-relaxed">
                  A presença e diversidade de peixes nativos funciona como um retrato vivo das condições ambientais do rio.
                </p>
              </div>
            </div>
          </div>

          {/* Why Box */}
          <div className="river-gradient-blue text-[#d6ecf8] rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start border border-[#1b6b94]">
            <div>
              <h3 className="text-xl sm:text-2xl md:text-[23px] font-display font-semibold text-white">
                Por que monitorar?
              </h3>
              <p className="text-xs sm:text-[14.8px] text-[#a3c3b0] mt-2 sm:mt-3 leading-relaxed">
                A qualidade da água de um rio muda com as estações, com o uso do solo ao seu redor e com a pressão humana sobre suas margens. Medir esses parâmetros regularmente permite identificar problemas cedo, entender tendências de longo prazo e orientar ações de conservação da mata ciliar e dos ecossistemas aquáticos associados.
              </p>
            </div>

            <ul className="space-y-3 text-xs sm:text-[14.2px] text-[#dcebf1]">
              <li className="flex gap-2.5 sm:gap-3 items-start">
                <Check className="w-4 sm:w-5 h-4 sm:h-5 text-[#34d399] shrink-0 mt-0.5" />
                <span>Detectar alterações antes que se tornem problemas graves</span>
              </li>
              <li className="flex gap-2.5 sm:gap-3 items-start">
                <Check className="w-4 sm:w-5 h-4 sm:h-5 text-[#34d399] shrink-0 mt-0.5" />
                <span>Relacionar urbanização e vegetação ripária à qualidade da água</span>
              </li>
              <li className="flex gap-2.5 sm:gap-3 items-start">
                <Check className="w-4 sm:w-5 h-4 sm:h-5 text-[#34d399] shrink-0 mt-0.5" />
                <span>Subsidiar decisões públicas sobre conservação e saneamento</span>
              </li>
              <li className="flex gap-2.5 sm:gap-3 items-start">
                <Check className="w-4 sm:w-5 h-4 sm:h-5 text-[#34d399] shrink-0 mt-0.5" />
                <span>Aproximar a comunidade da ciência ambiental do seu próprio rio</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===================== ACESSO RÁPIDO ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-5 sm:space-y-6">
        <div>
          <span className="font-mono text-xs text-[#125575] uppercase tracking-wider font-semibold block">
            Acesso rápido
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#0e2b1c] mt-1">
            Explore a plataforma
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          <div
            onClick={() => onNavigate('monitoramento')}
            className="bg-white border border-[#dbe4dd] hover:border-[#125575] rounded-xl p-5 sm:p-6 transition-all cursor-pointer shadow-xs hover:-translate-y-0.5 group space-y-2 touch-manipulation"
          >
            <div className="w-8 h-8 text-[#164a2f]">
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
            <h4 className="font-display font-semibold text-base sm:text-lg text-[#0e2b1c]">
              Monitoramento
            </h4>
            <p className="text-xs sm:text-[13.8px] text-[#48584f] leading-relaxed">
              Séries históricas de pH, oxigênio dissolvido, turbidez e outros parâmetros, por ponto e por período.
            </p>
          </div>

          <div
            onClick={() => onNavigate('mapa')}
            className="bg-white border border-[#dbe4dd] hover:border-[#125575] rounded-xl p-5 sm:p-6 transition-all cursor-pointer shadow-xs hover:-translate-y-0.5 group space-y-2 touch-manipulation"
          >
            <div className="w-8 h-8 text-[#164a2f]">
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                <path d="M9 20l-6-3V4l6 3 6-3 6 3v13l-6-3-6 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
              </svg>
            </div>
            <h4 className="font-display font-semibold text-base sm:text-lg text-[#0e2b1c]">
              Mapa
            </h4>
            <p className="text-xs sm:text-[13.8px] text-[#48584f] leading-relaxed">
              Veja a localização dos três pontos de coleta ao longo do rio e suas condições atuais.
            </p>
          </div>

          <div
            onClick={() => onNavigate('pesca')}
            className="bg-white border border-[#dbe4dd] hover:border-[#125575] rounded-xl p-5 sm:p-6 transition-all cursor-pointer shadow-xs hover:-translate-y-0.5 group space-y-2 touch-manipulation"
          >
            <div className="w-8 h-8 text-[#164a2f]">
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z" stroke="currentColor" strokeWidth="1.6"/>
                <circle cx="16" cy="12" r="1.4" fill="currentColor"/>
              </svg>
            </div>
            <h4 className="font-display font-semibold text-base sm:text-lg text-[#0e2b1c]">
              Pesca Interativa
            </h4>
            <p className="text-xs sm:text-[13.8px] text-[#48584f] leading-relaxed">
              Um jogo educativo para descobrir espécies de peixes da Mata Atlântica e sua relação com a saúde do rio.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
