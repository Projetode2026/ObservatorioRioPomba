import React from 'react';
import { PointId } from '../types';
import { POINTS, PARAM_DEF, PARAM_ORDER, latestVal, statusOf } from '../data/riverData';
import { ArrowRight } from 'lucide-react';

interface RiverMapProps {
  selectedPointId: PointId;
  onSelectPoint: (id: PointId) => void;
  onNavigateToMonitoring: (pointId: PointId) => void;
}

export const RiverMap: React.FC<RiverMapProps> = ({
  selectedPointId,
  onSelectPoint,
  onNavigateToMonitoring,
}) => {
  const pt = POINTS.find((p) => p.id === selectedPointId) || POINTS[0];

  let critCount = 0;
  let attnCount = 0;
  PARAM_ORDER.forEach((pk) => {
    const s = statusOf(pk, latestVal(pk, pt.id));
    if (s === 'crit') critCount++;
    else if (s === 'attn') attnCount++;
  });

  const conditionText =
    critCount > 0
      ? 'Um ou mais parâmetros fora da faixa recomendada — acompanhamento prioritário.'
      : attnCount >= 3
      ? 'Parâmetros próximos ao limite recomendado — vale observar a evolução.'
      : 'Parâmetros dentro da faixa esperada para o trecho.';

  const rows = PARAM_ORDER.map((pk) => {
    const def = PARAM_DEF[pk];
    const v = latestVal(pk, pt.id);
    return {
      pk,
      name: def.name,
      value: v.toFixed(def.decimals) + (def.unit ? ' ' + def.unit : ''),
    };
  });

  return (
    <div className="space-y-4">
      {/* Mobile/Tablet Quick Station Bar (Screens < lg) */}
      <div className="lg:hidden grid grid-cols-3 gap-2">
        {POINTS.map((p) => {
          const isSelected = p.id === selectedPointId;
          return (
            <button
              key={p.id}
              onClick={() => onSelectPoint(p.id)}
              className={`py-2 px-2 text-center rounded-xl text-xs transition-all cursor-pointer flex flex-col items-center gap-0.5 touch-manipulation border ${
                isSelected
                  ? 'bg-[#164a2f] text-white border-[#164a2f] shadow-xs'
                  : 'bg-white text-[#48584f] border-[#dbe4dd] hover:bg-[#f5f8f4]'
              }`}
            >
              <span className="font-mono font-bold text-xs">{p.short}</span>
              <span className="truncate max-w-full text-[11px] leading-tight">{p.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Map Card - ONLY THE RIVER AND THE POINTS */}
        <div className="lg:col-span-7 bg-white border border-[#dbe4dd] rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden shadow-xs">
          <div className="text-[11px] sm:text-xs font-mono text-[#7c8d83] mb-2 sm:mb-3 flex items-center justify-between">
            <span>Esquema hidrográfico</span>
            <span className="text-[#125575]">Toque em um ponto para selecionar</span>
          </div>

          <svg viewBox="0 0 640 420" className="w-full h-auto block select-none touch-manipulation" fill="none">
            {/* River Main Channel */}
            <path
              d="M40 60C120 90 60 150 140 175C220 200 150 260 230 285C310 310 260 360 600 360"
              stroke="#3a91b6"
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
              opacity="0.65"
            />
            {/* River Center Accent */}
            <path
              d="M40 60C120 90 60 150 140 175C220 200 150 260 230 285C310 310 260 360 600 360"
              stroke="#8fc7dd"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />

            {/* Marker P1 */}
            <g
              className="cursor-pointer group touch-manipulation"
              onClick={() => onSelectPoint('p1')}
              transform="translate(140,175)"
            >
              {/* Invisible large touch target for phones */}
              <circle r="36" fill="transparent" />
              <circle
                r="22"
                fill="none"
                stroke={selectedPointId === 'p1' ? '#2c8a5b' : 'rgba(58,145,182,0.35)'}
                strokeWidth={selectedPointId === 'p1' ? '3' : '1.5'}
              />
              <circle
                r="9.5"
                fill={selectedPointId === 'p1' ? '#2c8a5b' : '#3a91b6'}
                stroke="#ffffff"
                strokeWidth="2"
              />
              <text
                x="18"
                y="-12"
                fill="#0e2b1c"
                className="font-mono text-sm sm:text-base font-bold select-none"
              >
                P1
              </text>
            </g>

            {/* Marker P2 */}
            <g
              className="cursor-pointer group touch-manipulation"
              onClick={() => onSelectPoint('p2')}
              transform="translate(230,285)"
            >
              {/* Invisible large touch target for phones */}
              <circle r="36" fill="transparent" />
              <circle
                r="22"
                fill="none"
                stroke={selectedPointId === 'p2' ? '#2c8a5b' : 'rgba(58,145,182,0.35)'}
                strokeWidth={selectedPointId === 'p2' ? '3' : '1.5'}
              />
              <circle
                r="9.5"
                fill={selectedPointId === 'p2' ? '#2c8a5b' : '#3a91b6'}
                stroke="#ffffff"
                strokeWidth="2"
              />
              <text
                x="18"
                y="-12"
                fill="#0e2b1c"
                className="font-mono text-sm sm:text-base font-bold select-none"
              >
                P2
              </text>
            </g>

            {/* Marker P3 */}
            <g
              className="cursor-pointer group touch-manipulation"
              onClick={() => onSelectPoint('p3')}
              transform="translate(430,350)"
            >
              {/* Invisible large touch target for phones */}
              <circle r="36" fill="transparent" />
              <circle
                r="22"
                fill="none"
                stroke={selectedPointId === 'p3' ? '#2c8a5b' : 'rgba(58,145,182,0.35)'}
                strokeWidth={selectedPointId === 'p3' ? '3' : '1.5'}
              />
              <circle
                r="9.5"
                fill={selectedPointId === 'p3' ? '#2c8a5b' : '#3a91b6'}
                stroke="#ffffff"
                strokeWidth="2"
              />
              <text
                x="18"
                y="-12"
                fill="#0e2b1c"
                className="font-mono text-sm sm:text-base font-bold select-none"
              >
                P3
              </text>
            </g>
          </svg>
        </div>

        {/* Point List & Point Detail */}
        <div className="lg:col-span-5 space-y-4">
          {/* Point List (Desktop) */}
          <div className="hidden lg:flex flex-col gap-2.5">
            {POINTS.map((p) => {
              const isSelected = p.id === selectedPointId;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPoint(p.id)}
                  className={`flex items-center gap-3 w-full text-left bg-white border rounded-xl p-3.5 transition-all cursor-pointer shadow-xs ${
                    isSelected
                      ? 'border-[#125575] bg-[#e2f0f5]/30'
                      : 'border-[#dbe4dd] hover:border-[#3a91b6]'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-semibold shrink-0 bg-[#164a2f] text-white">
                    {p.short}
                  </div>
                  <span className="text-sm font-medium text-[#0e2b1c]">{p.name}</span>
                </button>
              );
            })}
          </div>

          {/* Point Detail Card */}
          <div className="bg-white border border-[#dbe4dd] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-display font-semibold text-[#0e2b1c]">
                  {pt.name}
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#f0f4ee] text-[#164a2f] font-semibold">
                  {pt.short}
                </span>
              </div>
              <div className="font-mono text-xs text-[#7c8d83] mt-1">
                Rio Pomba · trecho {pt.profile}
              </div>
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-[#48584f] leading-relaxed">
                {pt.desc} {conditionText}
              </p>
            </div>

            {/* Mini Table */}
            <div className="border-t border-[#e9efe9] divide-y divide-[#e9efe9]">
              {rows.map((r) => (
                <div key={r.pk} className="flex justify-between py-2 text-xs sm:text-sm">
                  <span className="text-[#48584f]">{r.name}</span>
                  <span className="font-mono font-semibold text-[#0e2b1c]">{r.value}</span>
                </div>
              ))}
            </div>

            {/* Button: Ver histórico completo */}
            <button
              onClick={() => onNavigateToMonitoring(pt.id)}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold border border-[#164a2f] text-[#164a2f] hover:bg-[#c7e3d1]/30 transition-colors cursor-pointer touch-manipulation"
            >
              <span>Ver histórico completo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
