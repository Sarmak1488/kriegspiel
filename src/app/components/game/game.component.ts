import { Component } from '@angular/core';
import { Map3DComponent, MapObjectInfo } from '../map3d/map3d.component';
import { UnitPanelComponent } from '../unit-panel/unit-panel.component';
import { GameService } from '../../services/game.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  imports: [Map3DComponent, UnitPanelComponent, CommonModule],
})
export class GameComponent {
  selectedObjectInfo$: Observable<MapObjectInfo | null>;

  constructor(public gameService: GameService) {
    this.selectedObjectInfo$ = this.gameService.selectedObjectInfo.asObservable();
  }

  public objectClick(objectInfo: MapObjectInfo) {
    console.log(objectInfo);
    this.gameService.selectedObjectInfo.next(objectInfo);
  }
}
