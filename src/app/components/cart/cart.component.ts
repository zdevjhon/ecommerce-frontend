import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CartItem } from '../../models/cart-item.model';
import { Product } from '../../models/product.model';

import { CommonModule } from '@angular/common';

import { CanActivate, Router } from '@angular/router';


import { ProductService } from '../../services/product.service';

import { CarritoItem } from '../../models/items.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [
    CommonModule
  ]
})
export class CartComponent implements OnInit {
  
  userId: number | null = null;
  productId: number | null = null; // Producto actual para agregar al carrito
  cantidad: number = 1; // Cantidad por defecto
  producto: Product | null = null; // Datos del producto

  cartItems: CartItem[] = [];

  carritoItem: CarritoItem[] = [];

  total_pedido: number = 0;

  constructor(private authService: AuthService, private cartService: CartService, private productService: ProductService, private router: Router) {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.userId = user.id;
      }
    });

    this.calcularTotal();
  }

  ngOnInit(): void {
    //this.userId = this.authService.getCurrentUserId();
    this.userId = this.authService.getCurrentUserId();

    this.cartService.cartItems$.subscribe(items => {
      this.carritoItem = items;
    });
  }

  addToCart(productId: number, cantidad: number): void {   
    this.cartService.addToCart(productId, cantidad);
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

  removeFromCart(cartItemId: number): void {
    this.cartService.removeFromCart(cartItemId);
  }  

  calcularTotal() {
    const savedCart = JSON.parse(localStorage.getItem('tempCart') || '[]'); 

    this.total_pedido = savedCart.reduce((acc: any, item: any) => acc + item.precio * item.cantidad, 0);
  }

}
