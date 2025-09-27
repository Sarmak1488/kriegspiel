import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Unit } from '../../models/unit.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-unit-panel',
  templateUrl: './unit-panel.component.html',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  styleUrls: ['./unit-panel.component.scss'],
})
export class UnitPanelComponent {
  selectedUnit: Unit | null = null;

  constructor(private gameService: GameService) {
    this.gameService.selectedUnit$.subscribe((unit) => (this.selectedUnit = unit));
  }

  defend() {
    if (this.selectedUnit) this.gameService.defend(this.selectedUnit);
  }

  suppress() {
    if (this.selectedUnit) this.gameService.suppress(this.selectedUnit);
  }

  reset() {
    if (this.selectedUnit) this.gameService.reset(this.selectedUnit);
  }
}
