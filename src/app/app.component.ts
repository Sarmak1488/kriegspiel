import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// Импортируем классы дочерних компонентов.
// Пути теперь правильные, так как файлы переименованы.
import { GameCanvasComponent } from './components/game-canvas/game-canvas.component';
import { UiPanelComponent } from './components/ui-panel/ui-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // "Регистрируем" дочерние компоненты, чтобы HTML их распознал
  imports: [
    CommonModule,
    GameCanvasComponent,
    UiPanelComponent
  ],
  // Указываем правильные пути к файлам с .component
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'kriegspiel-angular';
}