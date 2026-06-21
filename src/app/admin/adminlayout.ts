import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../services/supabase';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './adminlayout.html',
  styleUrls: ['./adminlayout.css']
})
export class AdminLayoutComponent {
  mostrarConfirmarSalir = false;

  constructor(private router: Router, private supabase: SupabaseService) {}

  pedirCerrarSesion() {
    this.mostrarConfirmarSalir = true;
  }

  cancelarCerrarSesion() {
    this.mostrarConfirmarSalir = false;
  }

  async confirmarCerrarSesion() {
    await this.supabase.cerrarSesion();
    this.mostrarConfirmarSalir = false;
    this.router.navigate(['/admin/login']);
  }
}