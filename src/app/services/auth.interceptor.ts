import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Aquí puedes añadir encabezados personalizados si es necesario
    // Por ejemplo, puedes agregar un encabezado de tipo `Content-Type`
    const modifiedRequest = request.clone({
      setHeaders: {
        // Ejemplo de un encabezado personalizado
        'Content-Type': 'application/json'
      }
    });

    return next.handle(modifiedRequest);
  }
}
