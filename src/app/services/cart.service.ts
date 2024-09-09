import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { CarritoItem } from '../models/items.model';
import { Product } from '../models/product.model';
import { BehaviorSubject } from 'rxjs';

import { ProductService } from '../services/product.service';

@Injectable({
  providedIn: 'root'
})

export class CartService {

  private cartItems = new BehaviorSubject<CarritoItem[]>([]);
  private cartItemCount = new BehaviorSubject<number>(0);

  producto: Product | null = null; // Datos del producto

  private apiUrl = 'http://localhost:8080/api/carrito'; // URL de la API
  private productUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient, private productService: ProductService) { 
    // Cargar el carrito desde localStorage si ya existe
    const savedCart = JSON.parse(localStorage.getItem('tempCart') || '[]');
    this.cartItems.next(savedCart);
    this.cartItemCount.next(savedCart.reduce((acc: any, item: any) => acc + item.cantidad, 0));
  }

  getCartItems() {
    return this.cartItems.asObservable();
  }

  getCartItemCount() {
    return this.cartItemCount.asObservable();
  }

  vaciarCart(){
    localStorage.removeItem('tempCart');
  }

  addToCart(productId: number, cantidad: number) {    

    this.productService.getProductById(productId).subscribe(
      (data) => {
        this.producto = data;
        //this.addToCart(productId, this.cantidad, this.producto.nombre, this.producto.precio);
        this.addToLocalCart(productId, cantidad, this.producto.nombre, this.producto.precio);

        //this.loadCart();
      },
      (error) => {
        console.error('Error al cargar los detalles del producto', error);
      }
    );
  }

  private addToLocalCart(productId: number | null, cantidad: number, nombre = '', precio: number | 0): void {
    if (productId === null) return;

    let cart = JSON.parse(localStorage.getItem('tempCart') || '[]');
    const itemIndex = cart.findIndex((item: any) => item.productId === productId);

    if (itemIndex > -1) {
      cart[itemIndex].cantidad += cantidad;
    } else {

      
      cart.push({productId,cantidad, nombre, precio});
    }

    localStorage.setItem('tempCart', JSON.stringify(cart));

    const savedCart = JSON.parse(localStorage.getItem('tempCart') || '[]');
    this.cartItems.next(savedCart);
    this.cartItemCount.next(savedCart.reduce((acc: any, item: any) => acc + item.cantidad, 0));

    /*const savedCart = JSON.parse(localStorage.getItem('tempCart') || '[]');
    this.cartItems.next(savedCart);

    // Contar el número de productos únicos en lugar de sumar las cantidades
    this.cartItemCount.next(savedCart.length);*/

    console.log('Producto añadido al carrito temporal:', cart);
  }

  removeFromCart(productId: number) {
    let currentCart = this.cartItems.value;
    currentCart = currentCart.filter(item => item.productId !== productId);

    this.cartItems.next(currentCart);
    this.cartItemCount.next(currentCart.reduce((acc, item) => acc + item.cantidad, 0));
    
    localStorage.setItem('tempCart', JSON.stringify(currentCart));
  }

  getCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl);
  }

  /*removeFromCart(cartItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cartItemId}`);
  }

  addToCart(usuarioId: number, productoId: number, cantidad: number, nombre = '', precio: number = 0): Observable<CartItem> {
    const newItem = { usuarioId, productoId, cantidad };
    return this.http.post<CartItem>(this.apiUrl, newItem);
  }*/

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.productUrl}/${id}`);
  }

}
