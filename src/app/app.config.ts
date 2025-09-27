import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { GameService } from './services/game.service';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations(), GameService],
};
