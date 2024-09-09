import { provideRouter, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes'; // Tu archivo de rutas

export const appConfig = {
  providers: [
    provideRouter(routes),
    // Otros proveedores si es necesario
  ]
};
