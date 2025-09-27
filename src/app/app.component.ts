import { Component } from '@angular/core';
import { Map3DComponent, MapObjectInfo } from './components/map3d/map3d.component';
import { UnitPanelComponent } from './components/unit-panel/unit-panel.component';
import { GameComponent } from './components/game/game.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [GameComponent],
})
export class AppComponent {
  public objectClick(objInfo: MapObjectInfo) {
    console.log(objInfo);
  }
}
