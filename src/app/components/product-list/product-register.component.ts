import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importa FormsModule si utilizas ngModel
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

// Importa bootstrap globalmente
declare var bootstrap: any;

@Component({
  selector: 'app-product-register',
  standalone: true,
  templateUrl: './product-register.component.html',
  styleUrls: ['./product-register.component.css'],
  imports: [FormsModule] // Incluye FormsModule si usas ngModel
})
export class ProductRegisterComponent {

  product: Product = { nombre: '', precio: 0.00, breveDescripcion: '', foto: '' };

  constructor(private productService: ProductService) { }

  openRegisterModal(): void {
    const modalElement = document.getElementById('productModal')!;
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();
  }

  registerProduct(): void {
    this.productService.createProduct(this.product).subscribe(() => {
      console.log('Producto registrado');
      const modalElement = document.getElementById('productModal')!;
      const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
      modal.hide();
    });
  }
}
