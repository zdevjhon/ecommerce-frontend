import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // Si tienes un archivo de estilos CSS
  imports: [CommonModule, FormsModule] // Asegúrate de incluir CommonModule y FormsModule
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user; // Establece isLoggedIn según la existencia del usuario
    });
  }

  login() {
    this.authService.login(this.username, this.password)
      .subscribe(
        response => {
          console.log('Login successful GUARDAR LA INFORMACION DE SESION');
          // Redirige o maneja el usuario autenticado
          this.router.navigate(['/products']); // Redirige a la página de productos
        },
        error => {
          this.errorMessage = 'Login failed. Please try again.';
          console.error('Login failed', error);
        }
      );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirige a la página de login
  }
}
