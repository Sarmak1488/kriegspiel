import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// "Знакомим" этот компонент с его дочерними компонентами
import { EditorControlsComponent } from '../editor-controls/editor-controls.component';
import { UnitInfoComponent } from '../unit-info/unit-info.component';

@Component({
  selector: 'app-ui-panel',
  standalone: true,
  // "Регистрируем" их здесь, в секции imports
  imports: [
    CommonModule,
    EditorControlsComponent, // <-- Теперь UiPanel знает, что такое <app-editor-controls>
    UnitInfoComponent        // <-- И что такое <app-unit-info>
  ],
  // Указываем правильные пути к файлам с .component
  templateUrl: './ui-panel.component.html',
  styleUrls: ['./ui-panel.component.css']
})
export class UiPanelComponent {

}