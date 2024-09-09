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

  userId: number | null = null;

  cartItemCount: number = 0; // Variable para el conteo del carrito
  isLoggedIn: boolean = false;

  title = 'ecommerce-frontend';

  total_pedido: number = 0;

  constructor(private authService: AuthService, private router: Router, private cartService: CartService) {
    
    //this.updateCartItemCount(); // Inicializa el conteo del carrito
    //localStorage.removeItem('tempCart');

    // Suscribirse a los cambios del carrito
    /*this.cartService.cartItems$.subscribe(items => {
      this.carritoItem = items; // Actualizar los items del carrito en el componente principal
    });*/

    this.cartService.cartItems$.subscribe(items => {
      this.carritoItem = items;
      this.total_pedido = this.cartService.calcularTotal(); // Obtener el total cuando se actualiza el carrito
    });
    
  }

  calcularTotal(){
    this.cartService.calcularTotal();
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

  realizarCompra(): void {
    const cart = JSON.parse(localStorage.getItem('tempCart') || '[]');
    if (this.userId && cart.length>0) {

      let fecha: string = new Date().toISOString().split('T')[0]; // Fecha en formato YYYY-MM-DD      
      //console.log("proceder con la compra:: "+this.total_pedido, fecha, this.userId);
      
      this.cartService.saveCompleteOrder(this.userId, fecha, 'enviado', this.total_pedido);
      //this.cartService.vaciarCart();

    } else {// no authenticado
      console.log("inisiar  sesion");
      this.router.navigate(['/login']);
    }
  }

  vaciarCart(){
    this.cartService.vaciarCart();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  removeFromCart(cartItemId: number): void {
    this.cartService.removeFromCart(cartItemId);
  }  

  updateCartItemCount() {
    const cart = JSON.parse(localStorage.getItem('tempCart') || '[]');
    const itemCount = cart.length;
    this.cartItemCount = itemCount; // Reemplaza con la lógica real
  }
}
