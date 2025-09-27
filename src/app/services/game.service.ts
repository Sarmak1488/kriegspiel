import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Unit } from '../models/unit.model';
import { MapObjectInfo } from '../components/map3d/map3d.component';

@Injectable({ providedIn: 'root' })
export class GameService {
  public selectedObjectInfo = new BehaviorSubject<MapObjectInfo | null>(null);
}
