import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common'; // Importa CommonModule
import { RouterOutlet } from '@angular/router';

import { FormsModule } from '@angular/forms'; // Asegúrate de que esto está presente

import { CanActivate, Router } from '@angular/router';

import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { CartItem } from '../../models/cart-item.model';

import { AuthService } from '../../services/auth.service';

import { CarritoItem } from '../../models/items.model';

import { environment } from '../../../environments/environment';

//import { ProductRegisterComponent } from '../../components/product-list/product-register.component'; // Asegúrate de que esto esté presente

//import { Modal } from 'bootstrap';

declare var bootstrap: any; // Declarar bootstrap globalmente

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  imports: [CommonModule, RouterOutlet, FormsModule] // Asegúrate de incluir CommonModule
})


export class ProductListComponent implements OnInit {

  products: Product[] = [];
  cartItems: CartItem[] = [];

  private apiUrl = environment.apiUrl+'/images/';

  carritoItem: CarritoItem[] = [];

  userId: number | null = null;

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  total_pedido: number = 0;

  cantidad = 1;

  selectedProduct: Product = { id: 0, nombre: '', precio: 0, breveDescripcion: '', foto: '' }; // Asegúrate de que esta propiedad siempre esté definida

  constructor(private productService: ProductService, private cartService: CartService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

    this.loadProducts();

    this.userId = this.authService.getCurrentUserId();

    this.cartService.cartItems$.subscribe(items => {
      this.carritoItem = items;
      this.total_pedido = this.cartService.calcularTotal(); // Obtener el total cuando se actualiza el carrito
    });

  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
  
        // Aquí podrías recorrer los productos para construir la URL completa de la imagen si es necesario
        this.products.forEach(product => {
          if (product.foto) {
            // Asegúrate de que 'product.foto' contenga la URL correcta para mostrar
            product.foto = this.apiUrl + product.foto;
          }
        });
      },
      (error) => {
        console.error('Error al cargar los productos', error);
      }
    );
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

  addToCart(productId: number, cantidad: number): void {   
    this.cartService.addToCart(productId, cantidad);
  }

  removeFromCart(cartItemId: number): void {
    this.cartService.removeFromCart(cartItemId);
  }

  openProductModal(product?: Product): void {
    this.selectedProduct = product ? { ...product } : { nombre: '', precio: 0, breveDescripcion: '', foto: '' };
    const modalElement = document.getElementById('productModal')!;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  openDetailModal(productId: number): void {
    this.productService.getProductById(productId).subscribe(
      (data) => {
        this.selectedProduct = data;
        this.selectedProduct.foto = this.apiUrl + this.selectedProduct.foto;          
       
        this.openModal(); // Abre el modal después de obtener los datos
      },
      (error) => {
        console.error('Error al cargar los detalles del producto', error);
      }
    );
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Mostrar vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  openModal(): void {
    const modalElement = document.getElementById('productModalDetail')!;
    const modal = new bootstrap.Modal(modalElement);
    modal.show(); // Pasar el producto al modal
  }

  closeModal(modalname= ''): void {
      const modalElement = document.getElementById(modalname)!;
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
          modal.hide(); // Ocultar el modal
      }
  }

  saveProduct(): void {
    const formData = new FormData();
    
    // Agregar los campos del producto al FormData
    formData.append('nombre', this.selectedProduct.nombre);
    formData.append('precio', this.selectedProduct.precio.toString());
    formData.append('breveDescripcion', this.selectedProduct.breveDescripcion);
    
    // Si hay un archivo seleccionado, agregarlo al FormData
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
  
    if (this.selectedProduct.id) {
      // Si el producto ya existe, actualízalo
      this.productService.updateProductWithImage(this.selectedProduct.id, formData).subscribe(() => {
        console.log('Producto actualizado');
        this.loadProducts();
      });
    } else {
      // Si el producto es nuevo, créalo
      this.productService.createProductWithImage(formData).subscribe(() => {
        console.log('Producto creado');
        this.loadProducts();
      });
    }
  
    // Ocultar el modal después de guardar el producto
    this.closeModal('productModal');
    /*const modal = bootstrap.getInstance(document.getElementById('productModal')!);
    modal?.hide();*/
  }
}
