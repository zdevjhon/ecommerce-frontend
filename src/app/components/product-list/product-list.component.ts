import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common'; // Importa CommonModule
import { RouterOutlet } from '@angular/router';

import { FormsModule } from '@angular/forms'; // Asegúrate de que esto está presente

import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { CartItem } from '../../models/cart-item.model';

import { AuthService } from '../../services/auth.service';

import { CarritoItem } from '../../models/items.model';

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

  carritoItem: CarritoItem[] = [];

  userId: number | null = null;

  cartItemCount: number = 0; // Variable para el conteo del carrito

  cantidad : number = 1;

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  selectedProduct: Product = { id: 0, nombre: '', precio: 0, breveDescripcion: '', foto: '' }; // Asegúrate de que esta propiedad siempre esté definida

  constructor(private productService: ProductService, private cartService: CartService, private authService: AuthService) { }

  ngOnInit(): void {

    this.loadProducts();

    this.userId = this.authService.getCurrentUserId();

    this.loadCart();    
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
  
        // Aquí podrías recorrer los productos para construir la URL completa de la imagen si es necesario
        this.products.forEach(product => {
          if (product.foto) {
            // Asegúrate de que 'product.foto' contenga la URL correcta para mostrar
            product.foto = 'http://localhost:8080/images/' + product.foto;
          }
        });
      },
      (error) => {
        console.error('Error al cargar los productos', error);
      }
    );
  }

  loadCart(): void {
    const cart = JSON.parse(localStorage.getItem('tempCart') || '[]');
    const itemCount = cart.length;
    console.log('Carrito temporal:::', cart, ' cant: ', itemCount);
    this.carritoItem = cart;

    console.log('Temporal', this.carritoItem);
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
        this.selectedProduct.foto = 'http://localhost:8080/images/' + this.selectedProduct.foto;          
       
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
