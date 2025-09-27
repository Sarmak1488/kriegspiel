import { Component } from '@angular/core';
import { Map3DComponent } from './components/map3d/map3d.component';
import { UnitPanelComponent } from './components/unit-panel/unit-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [Map3DComponent, UnitPanelComponent],
})
export class AppComponent {}
