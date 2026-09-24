export type PointId = 'p1' | 'p2' | 'p3';

export interface Point {
  id: PointId;
  name: string;
  short: string;
  order: number;
  desc: string;
  profile: 'preservado' | 'intermediario' | 'urbano';
}

export type ParamKey = 'ph' | 'temp' | 'od' | 'turbidez' | 'condutividade' | 'nitrogenio' | 'fosforo';

export type StatusLevel = 'good' | 'attn' | 'crit';

export interface ParameterDef {
  name: string;
  unit: string;
  decimals: number;
  base: number;
  amplitude: number;
  drift: number;
  noise: number;
  min: number;
  max: number;
  ref: string;
  refMin: number;
  refMax: number;
  better: 'range' | 'high' | 'low';
  desc: string;
}

export interface Reading {
  date: Date;
  value: number;
}

export interface Fish {
  id: string;
  name: string;
  sci: string;
  color: string;
  accent: string;
  habitat: string;
  feeding: string;
  eco: string;
  curiosity: string;
  status: StatusLevel;
  conservation: string;
  weight: number;
  invasive?: boolean;
}
