import { Point, PointId, ParamKey, ParameterDef, Reading, StatusLevel, Fish } from '../types';

export const TODAY = new Date('2026-09-08T12:00:00');

export const POINTS: Point[] = [
  {
    id: 'p1',
    name: 'Ponte de Camargo',
    short: 'P1',
    order: 1,
    desc: 'Trecho a montante, com maior cobertura de mata ciliar preservada.',
    profile: 'preservado',
  },
  {
    id: 'p2',
    name: 'Balneário Municipal',
    short: 'P2',
    order: 2,
    desc: 'Ponto intermediário do rio, de uso recreativo pela comunidade local.',
    profile: 'intermediario',
  },
  {
    id: 'p3',
    name: 'Ponte da Empa / Bairro São Vicente',
    short: 'P3',
    order: 3,
    desc: 'Trecho a jusante, próximo a áreas urbanas de maior ocupação.',
    profile: 'urbano',
  },
];

export const PARAM_DEF: Record<ParamKey, ParameterDef> = {
  ph: {
    name: 'pH',
    unit: '',
    decimals: 2,
    base: 7.1,
    amplitude: 0.25,
    drift: 0.15,
    noise: 0.35,
    min: 5.6,
    max: 9.2,
    ref: '6,0 – 9,0',
    refMin: 6.0,
    refMax: 9.0,
    better: 'range',
    desc: 'Mede a acidez ou alcalinidade da água.',
  },
  temp: {
    name: 'Temperatura da água',
    unit: '°C',
    decimals: 1,
    base: 22.5,
    amplitude: 2.4,
    drift: 0.6,
    noise: 0.9,
    min: 15,
    max: 31,
    ref: '18,0 – 26,0 °C',
    refMin: 18,
    refMax: 26,
    better: 'range',
    desc: 'Influencia a solubilidade de oxigênio e o metabolismo dos organismos aquáticos.',
  },
  od: {
    name: 'Oxigênio Dissolvido',
    unit: 'mg/L',
    decimals: 2,
    base: 6.8,
    amplitude: 0.9,
    drift: 0.5,
    noise: 0.7,
    min: 1.5,
    max: 10.5,
    ref: '≥ 5,0 mg/L',
    refMin: 5.0,
    refMax: 99,
    better: 'high',
    desc: 'Essencial para a respiração de peixes e outros organismos aquáticos.',
  },
  turbidez: {
    name: 'Turbidez',
    unit: 'NTU',
    decimals: 1,
    base: 32,
    amplitude: 14,
    drift: 8,
    noise: 12,
    min: 2,
    max: 220,
    ref: '≤ 40 NTU',
    refMin: -99,
    refMax: 40,
    better: 'low',
    desc: 'Indica a quantidade de partículas em suspensão, relacionada à erosão e ao carreamento de sedimentos.',
  },
  condutividade: {
    name: 'Condutividade Elétrica',
    unit: 'µS/cm',
    decimals: 0,
    base: 95,
    amplitude: 22,
    drift: 15,
    noise: 14,
    min: 30,
    max: 420,
    ref: '≤ 100 µS/cm',
    refMin: -99,
    refMax: 100,
    better: 'low',
    desc: 'Reflete a concentração de íons dissolvidos, associada a esgotos e escoamento urbano.',
  },
  nitrogenio: {
    name: 'Nitrogênio Total',
    unit: 'mg/L',
    decimals: 2,
    base: 0.85,
    amplitude: 0.3,
    drift: 0.25,
    noise: 0.22,
    min: 0.05,
    max: 4.5,
    ref: '≤ 1,00 mg/L',
    refMin: -99,
    refMax: 1.0,
    better: 'low',
    desc: 'Nutriente ligado a esgoto doméstico e fertilizantes; em excesso favorece a eutrofização.',
  },
  fosforo: {
    name: 'Fósforo Total',
    unit: 'mg/L',
    decimals: 3,
    base: 0.075,
    amplitude: 0.03,
    drift: 0.025,
    noise: 0.02,
    min: 0.005,
    max: 0.6,
    ref: '≤ 0,100 mg/L',
    refMin: -99,
    refMax: 0.1,
    better: 'low',
    desc: 'Nutriente associado a esgotos e uso agrícola; em excesso compromete o equilíbrio aquático.',
  },
};

export const PARAM_ORDER: ParamKey[] = ['ph', 'temp', 'od', 'turbidez', 'condutividade', 'nitrogenio', 'fosforo'];

export const POINT_OFFSET: Record<PointId, Record<ParamKey, number>> = {
  p1: { ph: 0.05, temp: -0.8, od: 0.7, turbidez: -14, condutividade: -25, nitrogenio: -0.28, fosforo: -0.022 },
  p2: { ph: 0, temp: 0, od: 0, turbidez: 0, condutividade: 0, nitrogenio: 0, fosforo: 0 },
  p3: { ph: -0.15, temp: 1.1, od: -1.1, turbidez: 22, condutividade: 48, nitrogenio: 0.4, fosforo: 0.03 },
};

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function round(v: number, d: number): number {
  const m = Math.pow(10, d);
  return Math.round(v * m) / m;
}

export function fmtDate(d: Date): string {
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function fmtDateShort(d: Date): string {
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export const SERIES_DAYS = 400;
const seriesCache: Record<string, Reading[]> = {};

export function getSeries(paramKey: ParamKey, pointId: PointId): Reading[] {
  const key = `${paramKey}|${pointId}`;
  if (seriesCache[key]) return seriesCache[key];

  const def = PARAM_DEF[paramKey];
  const off = POINT_OFFSET[pointId][paramKey] || 0;
  const rng = mulberry32(hashStr(key));
  const arr: Reading[] = [];
  let smooth = 0;

  for (let i = SERIES_DAYS; i >= 0; i--) {
    const d = new Date(TODAY);
    d.setDate(d.getDate() - i);
    const seasonal = Math.sin((d.getMonth() / 12) * Math.PI * 2 + (hashStr(pointId) % 6)) * def.amplitude;
    const wobble = Math.sin(i / 41 + (hashStr(paramKey) % 5)) * def.drift;
    smooth = smooth * 0.7 + (rng() - 0.5) * def.noise * 0.7;
    let val = def.base + off + seasonal + wobble + smooth;
    val = clamp(val, def.min, def.max);
    arr.push({
      date: d,
      value: round(val, def.decimals),
    });
  }

  seriesCache[key] = arr;
  return arr;
}

export function filterPeriod(series: Reading[], period: string): Reading[] {
  if (period === 'all') return series;
  const n = parseInt(period, 10);
  return series.slice(Math.max(0, series.length - (n + 1)));
}

export function seriesStats(series: Reading[]) {
  const vals = series.map((p) => p.value);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return { min, max, avg };
}

export function statusOf(paramKey: ParamKey, value: number): StatusLevel {
  const def = PARAM_DEF[paramKey];
  if (def.better === 'range') {
    if (value >= def.refMin && value <= def.refMax) return 'good';
    const span = def.refMax - def.refMin;
    const off = value < def.refMin ? def.refMin - value : value - def.refMax;
    return off > span * 0.25 ? 'crit' : 'attn';
  }
  if (def.better === 'high') {
    if (value >= def.refMin) return 'good';
    if (value >= def.refMin * 0.6) return 'attn';
    return 'crit';
  }
  // lower is better
  if (value <= def.refMax) return 'good';
  if (value <= def.refMax * 1.5) return 'attn';
  return 'crit';
}

export function statusLabel(s: StatusLevel): string {
  return s === 'good' ? 'Dentro do esperado' : s === 'attn' ? 'Atenção' : 'Crítico';
}

export function trendOf(series: Reading[]): 'up' | 'down' | 'flat' {
  const n = series.length;
  if (n < 6) return 'flat';
  const half = Math.floor(n / 2);
  const a = series.slice(0, half).reduce((s, p) => s + p.value, 0) / half;
  const b = series.slice(half).reduce((s, p) => s + p.value, 0) / (n - half);
  const diff = b - a;
  const rel = Math.abs(diff) / (Math.abs(a) || 1);
  if (rel < 0.03) return 'flat';
  return diff > 0 ? 'up' : 'down';
}

export function latestVal(paramKey: ParamKey, pointId: PointId): number {
  const s = getSeries(paramKey, pointId);
  return s[s.length - 1].value;
}

export const FISH: Fish[] = [
  {
    id: 'lambari',
    name: 'Lambari-do-rabo-amarelo',
    sci: 'Astyanax lacustris',
    color: '#c9d84a',
    accent: '#3a3a3a',
    habitat: 'Águas correntes e remansos, próximo à vegetação marginal.',
    feeding: 'Onívoro — consome insetos, sementes e algas.',
    eco: 'Espécie muito abundante; importante presa para peixes maiores e dispersora de sementes de plantas ripárias.',
    curiosity: 'Vive em cardumes numerosos e é uma das espécies nativas mais fáceis de observar em rios da Mata Atlântica.',
    status: 'good',
    conservation: 'Pouco preocupante',
    weight: 5,
  },
  {
    id: 'curimata',
    name: 'Curimatá-pacu',
    sci: 'Prochilodus lineatus',
    color: '#8fb3c9',
    accent: '#dfe8ec',
    habitat: 'Fundo de poços e trechos de correnteza moderada.',
    feeding: 'Detritívoro — se alimenta de matéria orgânica e sedimentos do leito do rio.',
    eco: 'Atua como "faxineiro" natural, reciclando nutrientes do fundo do rio.',
    curiosity: 'Faz migrações rio acima para se reproduzir, um comportamento chamado piracema.',
    status: 'attn',
    conservation: 'Quase ameaçada (regional)',
    weight: 3,
  },
  {
    id: 'traira',
    name: 'Traíra',
    sci: 'Hoplias malabaricus',
    color: '#7a6a4f',
    accent: '#4a3f2c',
    habitat: 'Águas paradas ou de fluxo lento, entre vegetação submersa.',
    feeding: 'Carnívora — predadora de emboscada, caça outros peixes.',
    eco: 'Topo da cadeia alimentar local, ajuda a regular populações de peixes menores.',
    curiosity: 'Consegue respirar ar atmosférico em água com pouco oxigênio, sobrevivendo em condições adversas.',
    status: 'good',
    conservation: 'Pouco preocupante',
    weight: 3,
  },
  {
    id: 'cascudo',
    name: 'Cascudo',
    sci: 'Hypostomus sp.',
    color: '#5c5347',
    accent: '#8a7f6c',
    habitat: 'Fundo pedregoso de rios com correnteza.',
    feeding: 'Raspa algas e perifíton aderidos a pedras com a boca em forma de ventosa.',
    eco: 'Indicador da qualidade do substrato; ajuda a controlar o crescimento excessivo de algas.',
    curiosity: 'Tem o corpo coberto por placas ósseas, como uma armadura natural.',
    status: 'good',
    conservation: 'Pouco preocupante',
    weight: 4,
  },
  {
    id: 'piau',
    name: 'Piau-três-pintas',
    sci: 'Leporinus sp.',
    color: '#e4c34a',
    accent: '#2c2c2c',
    habitat: 'Trechos de correnteza, próximo a corredeiras.',
    feeding: 'Onívoro — frutos, sementes, insetos e pequenos invertebrados.',
    eco: 'Dispersor de sementes de plantas ribeirinhas ao se alimentar de frutos caídos na água.',
    curiosity: 'É capaz de saltar pequenas corredeiras e obstáculos durante seus deslocamentos.',
    status: 'attn',
    conservation: 'Sensível à fragmentação do rio',
    weight: 3,
  },
  {
    id: 'cara',
    name: 'Cará',
    sci: 'Geophagus brasiliensis',
    color: '#c98a4b',
    accent: '#7a4a25',
    habitat: 'Poços calmos, entre pedras e vegetação marginal.',
    feeding: 'Onívoro — insetos, pequenos invertebrados e matéria vegetal.',
    eco: 'Sua presença costuma indicar boa cobertura de vegetação marginal.',
    curiosity: 'Os pais carregam os ovos e os filhotes recém-nascidos dentro da boca para protegê-los.',
    status: 'good',
    conservation: 'Pouco preocupante',
    weight: 4,
  },
  {
    id: 'jundia',
    name: 'Bagre / Jundiá',
    sci: 'Rhamdia quelen',
    color: '#4a4540',
    accent: '#8f877c',
    habitat: 'Águas mais profundas e sombreadas, ativo à noite.',
    feeding: 'Onívoro oportunista — pequenos peixes, invertebrados e detritos.',
    eco: 'Papel importante no equilíbrio da cadeia alimentar noturna do rio.',
    curiosity: 'Usa os longos bigodes (barbilhões) sensoriais para localizar alimento no escuro.',
    status: 'attn',
    conservation: 'Sensível a poluentes na água',
    weight: 3,
  },
  {
    id: 'mandi',
    name: 'Mandi-amarelo',
    sci: 'Pimelodus maculatus',
    color: '#d9b96a',
    accent: '#3a3025',
    habitat: 'Fundo de rios com correnteza moderada.',
    feeding: 'Onívoro — insetos aquáticos, pequenos crustáceos e restos vegetais.',
    eco: 'Espécie amplamente distribuída, integra estudos de monitoramento por sua sensibilidade ambiental.',
    curiosity: 'Possui espinhos nas nadadeiras peitorais que podem causar ferimentos — por isso deve ser manuseado com cuidado.',
    status: 'attn',
    conservation: 'Pouco preocupante, mas sensível à poluição',
    weight: 3,
  },
  {
    id: 'dourado',
    name: 'Dourado',
    sci: 'Salminus brasiliensis',
    color: '#e8a030',
    accent: '#7a3a1a',
    habitat: 'Trechos de correnteza forte em rios bem conectados.',
    feeding: 'Carnívoro — grande predador, caça outros peixes em cardume.',
    eco: 'Espécie símbolo de rios saudáveis e livres de barreiras; sua presença indica boa conectividade fluvial.',
    curiosity: 'Faz longas migrações rio acima para desovar e é considerado um dos peixes de água doce mais admirados do Brasil.',
    status: 'crit',
    conservation: 'Vulnerável em diversos trechos fragmentados',
    weight: 1,
  },
  {
    id: 'tilapia',
    name: 'Tilápia-do-nilo',
    sci: 'Oreochromis niloticus',
    color: '#8fa3a8',
    accent: '#4a5a5e',
    habitat: 'Adaptável a diferentes ambientes, inclusive águas paradas.',
    feeding: 'Onívora — algas, plâncton e pequenos invertebrados.',
    eco: 'Espécie exótica introduzida no Brasil; compete por espaço e alimento com espécies nativas.',
    curiosity: 'Não é originária do Brasil — foi introduzida para piscicultura e hoje é encontrada em rios de todo o país, ilustrando os impactos de espécies exóticas sobre a fauna nativa.',
    status: 'attn',
    conservation: 'Espécie exótica invasora',
    weight: 2,
    invasive: true,
  },
];

export const WATER_FACTS = [
  'A boa oxigenação da água é essencial para a maioria dos peixes nativos — espécies como a traíra toleram baixo oxigênio, mas isso é exceção, não regra.',
  'Águas muito turvas dificultam a caça de predadores visuais, como o dourado, que dependem da visibilidade para localizar suas presas.',
  'A mata ciliar preservada ajuda a manter a água mais fresca e com menos sedimentos, favorecendo espécies mais sensíveis a variações de temperatura.',
  'O excesso de nitrogênio e fósforo, geralmente ligado a esgoto e fertilizantes, pode causar proliferação de algas e reduzir o oxigênio disponível para os peixes.',
  'Espécies exóticas como a tilápia podem se adaptar bem a ambientes alterados, competindo com espécies nativas mais sensíveis às mudanças na qualidade da água.',
  'A presença de espécies migratórias, como a curimatá e o dourado, depende da conectividade do rio — barragens e obstáculos podem interromper seu ciclo reprodutivo.',
  'A condutividade elétrica elevada costuma indicar maior concentração de esgoto ou escoamento urbano na água do rio.',
];
