import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CartService } from './cart.service';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = environment.apiUrl+'/api/authenticate'; // URL de la API para autenticar

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();


  constructor(private http: HttpClient, private cartService: CartService) {
    // Cargar el usuario actual al iniciar el servicio
    this.loadCurrentUser();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.authUrl, { email: username, contrasena: password })
      .pipe(
        tap(response => {
          if (response.message === 'Autenticación exitosa') {
            this.currentUserSubject.next(response.usuario);
            localStorage.setItem('currentUser', JSON.stringify(response.usuario));
          } else {
            this.currentUserSubject.next(null);
          }
        }),
        catchError(error => {
          console.error('Login failed', error);
          // Actualiza el estado en caso de error
          return throwError(error); // Re-lanza el error para que pueda ser manejado en el componente
        })
      );
  }

  logout(): void {
    this.currentUserSubject.next(null); // Limpia el estado del usuario
    localStorage.removeItem('currentUser');
  }

  loadCurrentUser(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  getCurrentUserId(): number | null {
    const user = this.currentUserSubject.value;
    return user ? user.id : null; // Asegúrate de que el objeto de usuario tenga el campo 'id'
  }
  // getToken()
}
