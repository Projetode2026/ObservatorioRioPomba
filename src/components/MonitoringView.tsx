import React, { useState, useEffect, useRef } from 'react';
import { PointId, ParamKey } from '../types';
import {
  POINTS,
  PARAM_DEF,
  PARAM_ORDER,
  getSeries,
  filterPeriod,
  seriesStats,
  statusOf,
  statusLabel,
  trendOf,
  fmtDate,
  fmtDateShort,
  latestVal,
} from '../data/riverData';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend
);

interface MonitoringViewProps {
  initialParam?: ParamKey;
  initialPoint?: PointId;
}

interface HoveredPointData {
  date: Date;
  value: number;
  refVal: number | null;
}

interface HoveredCompareData {
  date: Date;
  p1: number | null;
  p2: number | null;
  p3: number | null;
}

export const MonitoringView: React.FC<MonitoringViewProps> = ({
  initialParam = 'ph',
  initialPoint = 'p2',
}) => {
  const [selectedParam, setSelectedParam] = useState<ParamKey>(initialParam);
  const [selectedPoint, setSelectedPoint] = useState<PointId>(initialPoint);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('365');
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );

  const [hoveredPoint, setHoveredPoint] = useState<HoveredPointData | null>(null);
  const [hoveredCompare, setHoveredCompare] = useState<HoveredCompareData | null>(null);

  const paramChartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const compareChartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const paramChartInstanceRef = useRef<Chart | null>(null);
  const compareChartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset hovered state when selections change
  useEffect(() => {
    setHoveredPoint(null);
    setHoveredCompare(null);
  }, [selectedParam, selectedPoint, selectedPeriod]);

  const def = PARAM_DEF[selectedParam];
  const full = getSeries(selectedParam, selectedPoint);
  const series = filterPeriod(full, selectedPeriod);
  const stats = seriesStats(series);
  const current = full[full.length - 1].value;
  const st = statusOf(selectedParam, current);
  const trend = trendOf(series);

  const hoveredPointStatus = hoveredPoint ? statusOf(selectedParam, hoveredPoint.value) : null;

  // Render Chart.js charts
  useEffect(() => {
    if (!paramChartCanvasRef.current || !compareChartCanvasRef.current) return;

    const ctx = paramChartCanvasRef.current.getContext('2d');
    if (!ctx) return;

    const labels = series.map((p) => fmtDateShort(p.date));
    const refLine = series.map(() =>
      def.better === 'low' ? def.refMax : def.better === 'high' ? def.refMin : null
    );

    const datasets: any[] = [
      {
        label: def.name,
        data: series.map((p) => p.value),
        borderColor: '#17698f',
        backgroundColor: 'rgba(23,105,143,0.08)',
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#17698f',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
        borderWidth: isMobile ? 1.8 : 2.2,
      },
    ];

    if (def.better !== 'range') {
      datasets.push({
        label: 'Limite CONAMA',
        data: refLine,
        borderColor: '#2c8a5b',
        borderDash: [5, 4],
        pointRadius: 0,
        pointHoverRadius: 0,
        borderWidth: 1.4,
        fill: false,
      });
    } else {
      datasets.push({
        label: 'Ref. mínima CONAMA',
        data: series.map(() => def.refMin),
        borderColor: '#2c8a5b',
        borderDash: [5, 4],
        pointRadius: 0,
        pointHoverRadius: 0,
        borderWidth: 1.3,
        fill: false,
      });
      datasets.push({
        label: 'Ref. máxima CONAMA',
        data: series.map(() => def.refMax),
        borderColor: '#2c8a5b',
        borderDash: [5, 4],
        pointRadius: 0,
        pointHoverRadius: 0,
        borderWidth: 1.3,
        fill: false,
      });
    }

    if (paramChartInstanceRef.current) {
      paramChartInstanceRef.current.destroy();
    }

    paramChartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        onHover: (_event, activeElements) => {
          if (activeElements && activeElements.length > 0) {
            const idx = activeElements[0].index;
            const pt = series[idx];
            if (pt) {
              setHoveredPoint({
                date: pt.date,
                value: pt.value,
                refVal: def.better === 'low' ? def.refMax : def.better === 'high' ? def.refMin : null,
              });
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }, // Desabilita o tooltip padrão que causa obstrução
        },
        scales: {
          x: {
            ticks: {
              maxTicksLimit: isMobile ? 4 : 7,
              autoSkip: true,
              maxRotation: 0,
              font: { family: "'IBM Plex Mono'", size: isMobile ? 9.5 : 10.5 },
              color: '#7c8d83',
            },
            grid: { display: false },
          },
          y: {
            ticks: {
              font: { family: "'IBM Plex Mono'", size: isMobile ? 9.5 : 10.5 },
              color: '#7c8d83',
            },
            grid: { color: '#e9efe9' },
          },
        },
      },
    });

    // Compare chart across stations
    const cctx = compareChartCanvasRef.current.getContext('2d');
    if (!cctx) return;

    const colors = ['#2c8a5b', '#17698f', '#a3721f'];
    const compareDatasets = POINTS.map((pt, i) => {
      const s = filterPeriod(getSeries(selectedParam, pt.id), selectedPeriod);
      return {
        label: pt.short + ' · ' + pt.name,
        data: s.map((p) => p.value),
        borderColor: colors[i],
        backgroundColor: 'transparent',
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: colors[i],
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 1.5,
        borderWidth: isMobile ? 1.8 : 2,
        tension: 0.35,
      };
    });

    if (compareChartInstanceRef.current) {
      compareChartInstanceRef.current.destroy();
    }

    compareChartInstanceRef.current = new Chart(cctx, {
      type: 'line',
      data: { labels, datasets: compareDatasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        onHover: (_event, activeElements) => {
          if (activeElements && activeElements.length > 0) {
            const idx = activeElements[0].index;
            const p1Series = filterPeriod(getSeries(selectedParam, 'p1'), selectedPeriod);
            const p2Series = filterPeriod(getSeries(selectedParam, 'p2'), selectedPeriod);
            const p3Series = filterPeriod(getSeries(selectedParam, 'p3'), selectedPeriod);
            const d = series[idx]?.date || p1Series[idx]?.date;
            if (d) {
              setHoveredCompare({
                date: d,
                p1: p1Series[idx]?.value ?? null,
                p2: p2Series[idx]?.value ?? null,
                p3: p3Series[idx]?.value ?? null,
              });
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { family: "'IBM Plex Sans'", size: isMobile ? 10.5 : 12 },
              color: '#48584f',
              boxWidth: isMobile ? 10 : 14,
              boxHeight: 3,
              padding: isMobile ? 10 : 14,
            },
          },
          tooltip: {
            // Desativado completamente para evitar a caixa preta obstrutiva ao passar o mouse ou toque no mobile
            enabled: false,
          },
        },
        scales: {
          x: {
            ticks: {
              maxTicksLimit: isMobile ? 4 : 7,
              autoSkip: true,
              maxRotation: 0,
              font: { family: "'IBM Plex Mono'", size: isMobile ? 9.5 : 10.5 },
              color: '#7c8d83',
            },
            grid: { display: false },
          },
          y: {
            ticks: {
              font: { family: "'IBM Plex Mono'", size: isMobile ? 9.5 : 10.5 },
              color: '#7c8d83',
            },
            grid: { color: '#e9efe9' },
          },
        },
      },
    });

    return () => {
      if (paramChartInstanceRef.current) {
        paramChartInstanceRef.current.destroy();
        paramChartInstanceRef.current = null;
      }
      if (compareChartInstanceRef.current) {
        compareChartInstanceRef.current.destroy();
        compareChartInstanceRef.current = null;
      }
    };
  }, [selectedParam, selectedPoint, selectedPeriod, isMobile]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 pb-4 border-b border-[#dbe4dd]">
        <div>
          <span className="font-mono text-xs text-[#125575] uppercase tracking-wider font-semibold block">
            Séries históricas
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0e2b1c] mt-1 sm:mt-1.5">
            Monitoramento da qualidade da água
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#48584f] mt-1.5 max-w-2xl leading-relaxed">
            Selecione um parâmetro, um ponto de coleta e um período para explorar o histórico de medições do Rio Pomba.
          </p>
        </div>

        <div className="shrink-0 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 bg-[#faf1de] text-[#a3721f] border border-[#ecd9ae] px-3 py-1 rounded-full text-xs font-semibold font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a3721f]" />
            Dados demonstrativos
          </span>
        </div>
      </div>

      {/* MOBILE & TABLET COMPACT CONTROLS (Visible on screens < lg) */}
      <div className="lg:hidden space-y-3 bg-white border border-[#dbe4dd] rounded-xl p-3.5 sm:p-4 shadow-xs">
        {/* Horizontal Scrollable Parameter Chips */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-[#7c8d83] font-mono font-semibold">
              Parâmetro ({PARAM_DEF[selectedParam].name})
            </span>
            <span className="text-[10.5px] font-mono text-[#125575]">
              Arraste para ver todos →
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none -mx-1 px-1">
            {PARAM_ORDER.map((pk) => {
              const pdef = PARAM_DEF[pk];
              const pst = statusOf(pk, latestVal(pk, selectedPoint));
              const pDot =
                pst === 'good' ? '#2c8a5b' : pst === 'attn' ? '#a3721f' : '#a13d34';
              const isActive = pk === selectedParam;

              return (
                <button
                  key={pk}
                  onClick={() => setSelectedParam(pk)}
                  className={`shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer touch-manipulation ${
                    isActive
                      ? 'bg-[#164a2f] text-white shadow-xs font-semibold'
                      : 'bg-[#f5f8f4] text-[#48584f] hover:bg-[#eaf1ec] border border-[#dbe4dd]'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: pDot }}
                  />
                  <span>{pdef.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Selectors: Station + Period */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-[#f0f4f1]">
          {/* Station Selector */}
          <div>
            <label
              htmlFor="mobilePointSelect"
              className="text-[11px] uppercase tracking-wider text-[#7c8d83] font-mono block mb-1 font-semibold"
            >
              Ponto de coleta
            </label>
            <select
              id="mobilePointSelect"
              value={selectedPoint}
              onChange={(e) => setSelectedPoint(e.target.value as PointId)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#f9fbf9] border border-[#dbe4dd] rounded-lg focus:outline-none focus:border-[#125575] text-[#16241d] font-sans"
            >
              {POINTS.map((pt) => (
                <option key={pt.id} value={pt.id}>
                  {pt.short} — {pt.name}
                </option>
              ))}
            </select>
          </div>

          {/* Period Selector */}
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#7c8d83] font-mono block mb-1 font-semibold">
              Período
            </span>
            <div className="grid grid-cols-4 gap-1 p-1 bg-[#f0f4ee] rounded-lg">
              {[
                { id: '30', label: '30d' },
                { id: '182', label: '6m' },
                { id: '365', label: '1 ano' },
                { id: 'all', label: 'Tudo' },
              ].map((per) => (
                <button
                  key={per.id}
                  onClick={() => setSelectedPeriod(per.id)}
                  className={`py-1.5 text-xs font-sans rounded-md transition-all cursor-pointer text-center ${
                    selectedPeriod === per.id
                      ? 'bg-[#125575] text-white font-semibold shadow-2xs'
                      : 'text-[#48584f] hover:text-[#0e2b1c]'
                  }`}
                >
                  {per.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Desktop Sidebar Rail + Analytical Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* DESKTOP SIDEBAR CONTROLS (Hidden on mobile < lg) */}
        <aside className="hidden lg:block lg:col-span-4 bg-white border border-[#dbe4dd] rounded-xl p-5 shadow-xs space-y-5">
          {/* Parameter Selection Rail */}
          <div>
            <h4 className="text-[11.5px] uppercase tracking-wider text-[#7c8d83] font-mono block mb-2 px-1 font-semibold">
              Parâmetro
            </h4>
            <ul className="space-y-1">
              {PARAM_ORDER.map((pk) => {
                const pdef = PARAM_DEF[pk];
                const pst = statusOf(pk, latestVal(pk, selectedPoint));
                const pDot =
                  pst === 'good' ? '#2c8a5b' : pst === 'attn' ? '#a3721f' : '#a13d34';
                const isActive = pk === selectedParam;

                return (
                  <li key={pk}>
                    <button
                      onClick={() => setSelectedParam(pk)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        isActive
                          ? 'bg-[#164a2f] text-white font-medium shadow-xs'
                          : 'text-[#48584f] hover:bg-[#c7e3d1]/30 hover:text-[#0e2b1c]'
                      }`}
                    >
                      <span>{pdef.name}</span>
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: pDot }}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Sampling Station Selector */}
          <div className="pt-4 border-t border-[#e9efe9]">
            <label
              htmlFor="pointSelect"
              className="text-[11.5px] uppercase tracking-wider text-[#7c8d83] font-mono block mb-2 px-1 font-semibold"
            >
              Ponto de coleta
            </label>
            <select
              id="pointSelect"
              value={selectedPoint}
              onChange={(e) => setSelectedPoint(e.target.value as PointId)}
              className="w-full px-3 py-2 text-sm bg-white border border-[#dbe4dd] rounded-lg focus:outline-none focus:border-[#125575] text-[#16241d] font-sans"
            >
              {POINTS.map((pt) => (
                <option key={pt.id} value={pt.id}>
                  {pt.short} — {pt.name}
                </option>
              ))}
            </select>
          </div>

          {/* Period Segmented Switcher */}
          <div className="pt-4 border-t border-[#e9efe9]">
            <span className="text-[11.5px] uppercase tracking-wider text-[#7c8d83] font-mono block mb-2 px-1 font-semibold">
              Período
            </span>
            <div className="flex flex-wrap gap-1.5 p-1 bg-[#f0f4ee] rounded-lg">
              {[
                { id: '30', label: '30 dias' },
                { id: '182', label: '6 meses' },
                { id: '365', label: '1 ano' },
                { id: 'all', label: 'Todo período' },
              ].map((per) => (
                <button
                  key={per.id}
                  onClick={() => setSelectedPeriod(per.id)}
                  className={`flex-1 min-w-[65px] px-2.5 py-1.5 text-xs font-sans rounded-md transition-all cursor-pointer text-center ${
                    selectedPeriod === per.id
                      ? 'bg-[#125575] text-white font-semibold shadow-2xs'
                      : 'text-[#48584f] hover:text-[#0e2b1c]'
                  }`}
                >
                  {per.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Analytical Panel */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-[#dbe4dd] rounded-xl shadow-xs overflow-hidden">
            {/* Variable Header */}
            <div className="p-4 sm:p-6 pb-2">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-display font-semibold text-[#0e2b1c]">
                    {def.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#48584f] mt-1 leading-relaxed">
                    {def.desc} Unidade: {def.unit || 'adimensional'}.
                  </p>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="font-mono text-[11px] sm:text-xs text-[#7c8d83] block">último valor</span>
                  <div className="font-mono text-2xl sm:text-3xl lg:text-4xl text-[#0e2b1c] font-bold block leading-none mt-1">
                    {current.toFixed(def.decimals)}
                    <span className="text-sm sm:text-base font-normal ml-1 font-sans text-[#48584f]">{def.unit}</span>
                  </div>
                </div>
              </div>

              {/* Status & Trend Bar */}
              <div className="mt-3 sm:mt-4 pt-3 border-t border-[#f0f4f1] flex flex-wrap items-center gap-2 sm:gap-x-4 text-[11px] sm:text-xs font-mono">
                <span
                  className={`px-2.5 py-0.5 rounded-full font-semibold ${
                    st === 'good'
                      ? 'bg-[#e6f3ea] text-[#2c8a5b]'
                      : st === 'attn'
                      ? 'bg-[#faf1de] text-[#a3721f]'
                      : 'bg-[#f8e7e4] text-[#a13d34]'
                  }`}
                >
                  {statusLabel(st)}
                </span>

                <span
                  className={`px-2.5 py-0.5 rounded-full font-semibold ${
                    trend === 'up'
                      ? 'bg-[#faf1de] text-[#a3721f]'
                      : trend === 'down'
                      ? 'bg-[#e6f3ea] text-[#2c8a5b]'
                      : 'bg-[#e9efe9] text-[#48584f]'
                  }`}
                >
                  {trend === 'up'
                    ? '▲ tendência de alta no período'
                    : trend === 'down'
                    ? '▼ tendência de queda no período'
                    : '● estável no período'}
                </span>

                <span className="text-[#7c8d83] w-full sm:w-auto sm:ml-auto">
                  última medição em {fmtDate(full[full.length - 1].date)}
                </span>
              </div>
            </div>

            {/* Stat Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-[#e9efe9] bg-[#f9fbf9] divide-x divide-y sm:divide-y-0 divide-[#e9efe9] mt-3">
              <div className="p-3 sm:p-4">
                <span className="font-mono text-[10.5px] sm:text-[11.5px] uppercase tracking-wider text-[#7c8d83] block truncate">
                  Mínimo
                </span>
                <span className="font-mono text-sm sm:text-base md:text-lg text-[#0e2b1c] block mt-0.5 font-semibold">
                  {stats.min.toFixed(def.decimals)} {def.unit}
                </span>
              </div>
              <div className="p-3 sm:p-4">
                <span className="font-mono text-[10.5px] sm:text-[11.5px] uppercase tracking-wider text-[#7c8d83] block truncate">
                  Máximo
                </span>
                <span className="font-mono text-sm sm:text-base md:text-lg text-[#0e2b1c] block mt-0.5 font-semibold">
                  {stats.max.toFixed(def.decimals)} {def.unit}
                </span>
              </div>
              <div className="p-3 sm:p-4">
                <span className="font-mono text-[10.5px] sm:text-[11.5px] uppercase tracking-wider text-[#7c8d83] block truncate">
                  Média do período
                </span>
                <span className="font-mono text-sm sm:text-base md:text-lg text-[#0e2b1c] block mt-0.5 font-semibold">
                  {stats.avg.toFixed(def.decimals)} {def.unit}
                </span>
              </div>
              <div className="p-3 sm:p-4">
                <span className="font-mono text-[10.5px] sm:text-[11.5px] uppercase tracking-wider text-[#7c8d83] block truncate">
                  Referência ideal
                </span>
                <span className="font-mono text-sm sm:text-base md:text-lg text-[#0e2b1c] block mt-0.5 font-semibold truncate">
                  {def.ref}
                </span>
              </div>
            </div>

            {/* Live Reading / Inspection Bar (Replaces floating box that obscures graph on mobile) */}
            <div className="bg-[#f5f8f5] border-y border-[#e9efe9] px-3.5 sm:px-6 py-2.5 transition-colors">
              {hoveredPoint ? (
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] sm:text-xs font-semibold text-[#164a2f] bg-white px-2 py-0.5 rounded border border-[#d2dfd6] shadow-2xs">
                    {fmtDate(hoveredPoint.date)}
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#0e2b1c]">
                    {def.name}: <span className="text-[#17698f]">{hoveredPoint.value.toFixed(def.decimals)}</span> {def.unit}
                  </span>
                  {hoveredPointStatus && (
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono text-[10.5px] sm:text-[11px] font-semibold ${
                        hoveredPointStatus === 'good'
                          ? 'bg-[#e6f3ea] text-[#2c8a5b]'
                          : hoveredPointStatus === 'attn'
                          ? 'bg-[#faf1de] text-[#a3721f]'
                          : 'bg-[#f8e7e4] text-[#a13d34]'
                      }`}
                    >
                      {statusLabel(hoveredPointStatus)}
                    </span>
                  )}
                  {hoveredPoint.refVal !== null && (
                    <span className="font-mono text-[10.5px] sm:text-[11px] text-[#2c8a5b] bg-white/90 px-2 py-0.5 rounded border border-[#dbe4dd]">
                      Ref. CONAMA: {hoveredPoint.refVal} {def.unit}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2 text-[#7c8d83] font-mono text-[11px] sm:text-xs">
                  <span className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#17698f] shrink-0" />
                    <span className="truncate">
                      {isMobile
                        ? 'Toque no gráfico para inspecionar cada ponto'
                        : 'Passe o cursor sobre o gráfico para inspecionar cada ponto'}
                    </span>
                  </span>
                  <span className="hidden sm:inline text-[#48584f] text-[11px] shrink-0">
                    Mais recente: {fmtDate(series[series.length - 1]?.date)} · {current.toFixed(def.decimals)} {def.unit}
                  </span>
                </div>
              )}
            </div>

            {/* Chart Canvas */}
            <div
              className="p-2.5 sm:p-4 md:p-6 h-[250px] sm:h-[290px] md:h-[340px] relative touch-manipulation"
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <canvas ref={paramChartCanvasRef} />
            </div>

            {/* Chart Legend Note */}
            <div className="px-4 sm:px-6 pb-3 sm:pb-4 flex flex-wrap gap-4 sm:gap-6 text-[11px] sm:text-xs text-[#7c8d83] border-t border-[#e9efe9] pt-2.5 sm:pt-3">
              <span className="inline-flex items-center gap-1.5 sm:gap-2">
                <i className="w-3 sm:w-3.5 h-1 rounded inline-block bg-[#17698f]" />
                Valor medido
              </span>
              <span className="inline-flex items-center gap-1.5 sm:gap-2">
                <i className="w-3.5 sm:w-4 h-0 inline-block border-t-2 border-dashed border-[#2c8a5b]" />
                Faixa de referência
              </span>
            </div>
          </div>

          {/* Cross-Station Comparison Chart */}
          <div className="bg-white border border-[#dbe4dd] rounded-xl p-4 sm:p-6 shadow-xs space-y-3">
            <div>
              <h3 className="text-base sm:text-lg font-display font-semibold text-[#0e2b1c]">
                Comparar entre pontos de coleta
              </h3>
              <p className="text-xs sm:text-sm text-[#48584f]">
                Como o mesmo parâmetro se compara entre os três pontos monitorados, no período selecionado.
              </p>
            </div>

            {/* Live Reading for Comparison Chart */}
            <div className="bg-[#f5f8f5] border border-[#e9efe9] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 transition-colors">
              {hoveredCompare ? (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] sm:text-xs font-semibold text-[#164a2f] bg-white px-2 py-0.5 rounded border border-[#d2dfd6] shadow-2xs">
                      📅 {fmtDate(hoveredCompare.date)}
                    </span>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 font-mono text-[11px] sm:text-xs">
                      <span className="inline-flex items-center gap-1 text-[#2c8a5b] font-medium bg-white px-2 py-0.5 rounded border border-[#dbe4dd]">
                        <span className="w-2 h-2 rounded-full bg-[#2c8a5b]" />
                        P1: {hoveredCompare.p1 !== null ? hoveredCompare.p1.toFixed(def.decimals) : '—'} {def.unit}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#17698f] font-medium bg-white px-2 py-0.5 rounded border border-[#dbe4dd]">
                        <span className="w-2 h-2 rounded-full bg-[#17698f]" />
                        P2: {hoveredCompare.p2 !== null ? hoveredCompare.p2.toFixed(def.decimals) : '—'} {def.unit}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#a3721f] font-medium bg-white px-2 py-0.5 rounded border border-[#dbe4dd]">
                        <span className="w-2 h-2 rounded-full bg-[#a3721f]" />
                        P3: {hoveredCompare.p3 !== null ? hoveredCompare.p3.toFixed(def.decimals) : '—'} {def.unit}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2 text-[#7c8d83] font-mono text-[11px] sm:text-xs">
                  <span className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2c8a5b] shrink-0" />
                    <span className="truncate">
                      {isMobile
                        ? 'Toque no gráfico para comparar os 3 pontos'
                        : 'Passe o cursor para comparar simultaneamente os 3 pontos'}
                    </span>
                  </span>
                  <span className="hidden sm:inline text-[#48584f] text-[11px] shrink-0">
                    P1 Camargo · P2 Balneário · P3 Empa
                  </span>
                </div>
              )}
            </div>

            <div
              className="pt-1 h-[220px] sm:h-[260px] md:h-[280px] relative touch-manipulation"
              onMouseLeave={() => setHoveredCompare(null)}
            >
              <canvas ref={compareChartCanvasRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};