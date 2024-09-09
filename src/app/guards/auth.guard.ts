import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Ajusta la ruta según tu estructura
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.currentUser.pipe(
      map(user => {
        if (user) {
          return true; // El usuario está autenticado
        } else {
          this.router.navigate(['/login']); // Redirige a la página de login
          return false;
        }
      })
    );
  }
}


