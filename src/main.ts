import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router'; // Asegúrate de importar RouterModule
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

/*bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(), // Provide HTTP client configuration
    importProvidersFrom(RouterModule) // Agregar RouterModule como proveedor
  ]
}).catch(err => console.error(err));*/



bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()), // Add interceptors if needed
    importProvidersFrom(RouterModule) // Agregar RouterModule como proveedor
  ]
}).catch(err => console.error(err));