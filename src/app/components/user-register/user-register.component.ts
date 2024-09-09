import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

import { CommonModule } from '@angular/common'; // Importa CommonModule
import { RouterOutlet } from '@angular/router';

import { FormsModule } from '@angular/forms'; // Asegúrate de que esto está presente

//import { Modal } from 'bootstrap';

declare var bootstrap: any; // Declarar bootstrap globalmente

@Component({
  selector: 'app-user-register',
  standalone: true,
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css'],
  imports: [CommonModule, RouterOutlet, FormsModule] // Asegúrate de incluir CommonModule
})
export class UserRegisterComponent {

  user: User = { nombre: '', email: '', contrasena: '', direccion: '', telefono: '' };

  constructor(private userService: UserService) { }

  openRegisterModal(): void {
    const modal = bootstrap.Modal(document.getElementById('registerModal')!);
    modal.show();
  }

  registerUser(): void {
    this.userService.createUser(this.user).subscribe(() => {
      console.log('Usuario registrado');
      const modal = bootstrap.getInstance(document.getElementById('registerModal')!);
      modal?.hide();
    });
  }
}
