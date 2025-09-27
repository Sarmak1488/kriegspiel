export type UnitState = 'обычное' | 'укреплён' | 'подавлен';

export interface Unit {
  id: string;
  name: string;
  type: 'пехота' | 'техника';
  position: { x: number; y: number; z: number };
  baseDamage: number;
  baseSpeed: number;
  armor: number;
  state: UnitState;
}
