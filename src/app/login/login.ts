import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/supabase';

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
  cargando = false;

  constructor(private router: Router, private supabase: SupabaseService) {}

  async login() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Por favor llena todos los campos';
      return;
    }
    this.cargando = true;
    const { data, error } = await this.supabase.iniciarSesion(this.email, this.password);
    this.cargando = false;
    if (error) {
      this.errorMsg = 'Correo o contraseña incorrectos';
    } else {
      localStorage.setItem('usuarioNombre', data.user?.user_metadata?.['nombre'] || this.email);
      localStorage.setItem('usuarioId', data.user?.id || '');
      localStorage.setItem('usuarioEmail', this.email);
      this.router.navigate(['/perfil']);
    }
  }

  async registro() {
    if (!this.nombre || !this.email || !this.password) {
      this.errorMsg = 'Por favor llena todos los campos';
      return;
    }
    this.cargando = true;
    const { data, error } = await this.supabase.registrar(this.email, this.password, this.nombre, this.telefono);
    this.cargando = false;
    if (error) {
      this.errorMsg = error.message;
    } else {
      localStorage.setItem('usuarioNombre', this.nombre);
      localStorage.setItem('usuarioId', data.user?.id || '');
      localStorage.setItem('usuarioEmail', this.email);
      this.router.navigate(['/perfil']);
    }
  }
}