import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Unit } from '../models/unit.model';

@Injectable({ providedIn: 'root' })
export class GameService {
  private units: Unit[] = [
    {
      id: 'u1',
      name: 'Пехота-1',
      type: 'пехота',
      position: { x: 0, y: 0, z: 0 },
      baseDamage: 10,
      baseSpeed: 5,
      armor: 2,
      state: 'обычное',
    },
  ];

  private selectedUnitSubject = new BehaviorSubject<Unit | null>(null);
  selectedUnit$ = this.selectedUnitSubject.asObservable();

  getUnits(): Unit[] {
    return this.units;
  }

  selectUnit(unit: Unit) {
    this.selectedUnitSubject.next(unit);
  }

  updateUnit(updated: Unit) {
    this.units = this.units.map((u) => (u.id === updated.id ? updated : u));
    if (this.selectedUnitSubject.value?.id === updated.id) {
      this.selectedUnitSubject.next(updated);
    }
  }

  // Действия
  defend(unit: Unit) {
    unit.state = 'укреплён';
    unit.armor += 2;
    this.updateUnit(unit);
  }

  suppress(unit: Unit) {
    unit.state = 'подавлен';
    unit.baseSpeed *= 0.5;
    unit.baseDamage *= 0.5;
    this.updateUnit(unit);
  }

  reset(unit: Unit) {
    unit.state = 'обычное';
    this.updateUnit(unit);
  }
}
