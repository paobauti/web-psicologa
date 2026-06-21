import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/supabase';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './adminlogin.html',
  styleUrl: './adminlogin.css'
})
export class AdminLoginComponent {
  email = '';
  password = '';
  errorMsg = '';
  cargando = false;

  constructor(private router: Router, private supabase: SupabaseService) {}

  async login() {
    this.errorMsg = '';

    if (!this.email || !this.password) {
      this.errorMsg = 'Por favor llena todos los campos';
      return;
    }

    this.cargando = true;
    const { data, error } = await this.supabase.iniciarSesion(this.email, this.password);
    this.cargando = false;

    if (error) {
      this.errorMsg = 'Correo o contraseña incorrectos';
      return;
    }

    this.router.navigate(['/admin/home']);
  }
}