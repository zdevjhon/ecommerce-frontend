import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service'; // Ajusta la ruta según tu estructura
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule
///import { Observable } from 'rxjs'; // Importa Observable
import { CartService } from './services/cart.service';

import { CarritoItem } from './models/items.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, RouterOutlet] // Incluye CommonModule y RouterOutlet
})
export class AppComponent implements OnInit {

  carritoItem: CarritoItem[] = [];
  cartItemCount: number = 0; // Variable para el conteo del carrito
  isLoggedIn: boolean = false;

  title = 'ecommerce-frontend';

  constructor(private authService: AuthService, private router: Router, private cartService: CartService) {
    
    //this.updateCartItemCount(); // Inicializa el conteo del carrito

    this.loadCart();
    //localStorage.removeItem('tempCart');
    
  }

  loadCart(): void {
    const cart = JSON.parse(localStorage.getItem('tempCart') || '[]');
    const itemCount = cart.length;
    this.carritoItem = cart;
  }

  ngOnInit(): void {
    // Puedes realizar otras inicializaciones aquí si es necesario
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user; // Establece isLoggedIn según la existencia del usuario
    });

    this.cartService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count;
    });
  }

  vaciarCart(){
    this.cartService.vaciarCart();
    this.loadCart();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  updateCartItemCount() {
    const cart = JSON.parse(localStorage.getItem('tempCart') || '[]');
    const itemCount = cart.length;
    this.cartItemCount = itemCount; // Reemplaza con la lógica real
  }
}
