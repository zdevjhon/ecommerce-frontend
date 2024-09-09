import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { CarritoItem } from '../models/items.model';
import { purchaseItem } from '../models/purchase-item.model';
import { Product } from '../models/product.model';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators'; // Asegúrate de importar el operador map

import { ProductService } from '../services/product.service';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CartService {

  private carritoItem = new BehaviorSubject<CarritoItem[]>([]);
  private cartItemCount = new BehaviorSubject<number>(0);

  cartItems$ = this.carritoItem.asObservable(); // Para que otros componentes se suscriban

  producto: Product | null = null; // Datos del producto

  private apiUrl = environment.apiUrl+'/api/carrito'; // URL de la API
  private productUrl = environment.apiUrl+'/api/products';
  private pedidosUrl = environment.apiUrl+'/api/pedidos';
  private pedidosDtUrl = environment.apiUrl+'/api/detalle-pedidos';

  constructor(private http: HttpClient, private productService: ProductService) { 
    // Cargar el carrito desde localStorage si ya existe
    const savedCart = JSON.parse(localStorage.getItem('tempCart') || '[]');
    this.carritoItem.next(savedCart);
    this.cartItemCount.next(savedCart.reduce((acc: any, item: any) => acc + item.cantidad, 0));
  }

  loadCart() {
    const savedCart = JSON.parse(localStorage.getItem('tempCart') || '[]');
    this.carritoItem.next(savedCart); // Actualizar los items del carrito
  }

  vaciarCart() {
    localStorage.removeItem('tempCart'); // Limpiar el carrito en localStorage
    const savedCart = JSON.parse(localStorage.getItem('tempCart') || '[]');    
    this.cartItemCount.next(savedCart.reduce((acc: any, item: any) => acc + item.cantidad, 0));
    this.carritoItem.next([]); // Notificar que el carrito está vacío
  }

  getCartItems() {
    return this.carritoItem.asObservable();
  }

  getCartItemCount() {
    return this.cartItemCount.asObservable();
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
    this.carritoItem.next(savedCart); // Actualizar el BehaviorSubject
    this.cartItemCount.next(savedCart.reduce((acc: any, item: any) => acc + item.cantidad, 0));

    localStorage.setItem('tempCart', JSON.stringify(savedCart));

    /*const savedCart = JSON.parse(localStorage.getItem('tempCart') || '[]');
    this.cartItems.next(savedCart);

    // Contar el número de productos únicos en lugar de sumar las cantidades
    this.cartItemCount.next(savedCart.length);*/

    console.log('Producto añadido al carrito temporal:', cart);
  }

  removeFromCart(productId: number) {
    let currentCart = this.carritoItem.value;
    currentCart = currentCart.filter(item => item.productId !== productId);

    this.carritoItem.next(currentCart); // Actualizar el BehaviorSubject
    this.cartItemCount.next(currentCart.reduce((acc, item) => acc + item.cantidad, 0));
    
    localStorage.setItem('tempCart', JSON.stringify(currentCart));

    /*const savedCart = JSON.parse(localStorage.getItem('tempCart') || '[]');
    const updatedCart = savedCart.filter((item: any) => item.productId !== productId);

    localStorage.setItem('tempCart', JSON.stringify(updatedCart));
    this.carritoItem.next(updatedCart); // Actualizar el BehaviorSubject*/
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

  // Guardar el pedido y retornar el ID del pedido para luego guardar los detalles
  savePedido(usuario_id: number, fecha: string, estado: string, total: number = 0): Observable<number> {
    const newItem = { usuario_id, fecha, estado, total };
    
    // Enviamos el pedido y obtenemos la respuesta con el ID del pedido
    return this.http.post<purchaseItem>(this.pedidosUrl, newItem).pipe(
      map((response: any) => response.id) // Asumimos que el backend devuelve el campo 'id_pedido'
      //map((response: purchaseItem) => response.id) // Mapea la respuesta para obtener el id_pedido
    );
  }

  savePedidoDetail(pedidoId: number): void {
    const savedCart = JSON.parse(localStorage.getItem('tempCart') || '[]');
    
    // Recorremos cada producto del carrito y lo enviamos al backend
    savedCart.forEach((item: any) => {
      /*const newItem = {
        pedidoId,
        productId: item.productId,
        cantidad: item.cantidad,
        precio: item.precio
      };*/

      const newItem ={
        pedido_id: pedidoId, 
        producto_id:  item.productId,
        cantidad: item.cantidad,
        precio: item.precio
      };
      // Enviamos cada detalle del pedido
      this.http.post<CarritoItem>(this.pedidosDtUrl, newItem).subscribe(
        (response) => {
          console.log('Detalle del pedido guardado correctamente', response);
        },
        (error) => {
          console.error('Error al guardar el detalle del pedido', error);
        }
      );
    });
  }

  saveCompleteOrder(usuarioId: number, fecha: string, estado: string, total: number = 0): void {
    // Guardar el pedido y luego, cuando tengamos el ID, guardar los detalles
    this.savePedido(usuarioId, fecha, estado, total).subscribe(
      (id_pedido) => {
        console.log('Pedido guardado con ID:', id_pedido);
        this.savePedidoDetail(id_pedido); // Guardar detalles del pedido usando el ID
        this.vaciarCart();
      },
      (error) => {
        console.error('Error al guardar el pedido', error);
      }
    );
    
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.productUrl}/${id}`);
  }

  calcularTotal() {
    /*const savedCart = JSON.parse(localStorage.getItem('tempCart') || '[]'); 

    this.total_pedido = savedCart.reduce((acc: any, item: any) => acc + item.precio * item.cantidad, 0);*/
    const savedCart = JSON.parse(localStorage.getItem('tempCart') || '[]');
    return savedCart.reduce((acc: number, item: any) => acc + (item.precio * item.cantidad), 0);
  }

}
