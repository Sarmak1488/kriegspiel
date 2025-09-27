import { Component, Input } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Unit } from '../../models/unit.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MapObjectInfo } from '../map3d/map3d.component';

@Component({
  selector: 'app-unit-panel',
  templateUrl: './unit-panel.component.html',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  styleUrls: ['./unit-panel.component.scss'],
})
export class UnitPanelComponent {
  @Input() selectedObjectInfo: MapObjectInfo | null = null;

  constructor(private gameService: GameService) {}
}
