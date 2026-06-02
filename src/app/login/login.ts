import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data';

@Component({
  selector: 'app-login',
  imports: [NgIf, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  esRegistro = false;
  email = '';
  password = '';
  nombre = '';
  telefono = '';
  errorMsg = '';

  constructor(private router: Router, private dataService: DataService) {}

  login() {
    const usuario = this.dataService.getUsuarioByEmail(this.email);
    if (usuario && usuario.password === this.password) {
      localStorage.setItem('usuarioId', usuario.id.toString());
      localStorage.setItem('usuarioNombre', usuario.nombre);
      this.router.navigate(['/perfil']);
    } else {
      this.errorMsg = 'Correo o contraseña incorrectos';
    }
  }

  registro() {
    if (this.nombre && this.email && this.password) {
      localStorage.setItem('usuarioNombre', this.nombre);
      localStorage.setItem('usuarioEmail', this.email);
      this.router.navigate(['/perfil']);
    } else {
      this.errorMsg = 'Por favor llena todos los campos';
    }
  }
}