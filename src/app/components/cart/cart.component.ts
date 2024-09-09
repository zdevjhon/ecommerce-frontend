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



  constructor(private authService: AuthService, private cartService: CartService, private productService: ProductService, private router: Router) {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.userId = user.id;
      }
    });
  }

  ngOnInit(): void {
    //this.userId = this.authService.getCurrentUserId();
    this.loadCart(); 
  }

  loadCart(): void {
    
    const cart = JSON.parse(localStorage.getItem('tempCart') || '[]');
    const itemCount = cart.length;
    console.log('Carrito temporal:', cart, ' cant: ', itemCount);
    this.carritoItem = cart;

  }

  addToCart(productId: number, quantity: number): void {

    /*if (this.userId && this.productId != null) {
      this.cartService.addToCart(this.userId, this.productId, this.cantidad).subscribe(
        response => {
          console.log('Producto añadido al carrito:', response);
          this.loadCart(); // Carga el carrito actual
        },
        error => {
          console.error('Error al añadir el producto al carrito', error);
        }
      );
    } else {// no authenticado
    }*/

    
    this.productService.getProductById(productId).subscribe(
      (data) => {
        this.producto = data;
        //this.addToCart(productId, this.cantidad, this.producto.nombre, this.producto.precio);
        this.addToLocalCart(productId, quantity, this.producto.nombre, this.producto.precio);

        this.loadCart();
      },
      (error) => {
        console.error('Error al cargar los detalles del producto', error);
      }
    );
    
  }

  realizarCompra(): void {
    const cart = JSON.parse(localStorage.getItem('tempCart') || '[]');
    if (this.userId && cart.length>0) {
      console.log("proceder con la compra");
      const cart = JSON.parse(localStorage.getItem('tempCart') || '[]');
      console.log('Carrito a comprar:', cart,);
    } else {// no authenticado
      console.log("inisiar  sesion");
      this.router.navigate(['/login']);
    }
  }

  vaciarCart(){
    this.cartService.vaciarCart();
    this.loadCart();
  }

  removeFromCart(cartItemId: number): void {
    this.cartService.removeFromCart(cartItemId);

    this.loadCart();
  }

  private addToLocalCart(productId: number | null, cantidad: number, nombre = '', precio: number | 0): void {
    if (productId === null) return;

    let cart = JSON.parse(localStorage.getItem('tempCart') || '[]');
    const itemIndex = cart.findIndex((item: any) => item.productId === productId);

    if (itemIndex > -1) {
      cart[itemIndex].cantidad += cantidad;
    } else {
      cart.push({ productId, cantidad , nombre, precio});
    }

    localStorage.setItem('tempCart', JSON.stringify(cart));
    console.log('Producto añadido al carrito temporal:', cart);
  }

}
