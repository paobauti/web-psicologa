import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment'; 

interface Usuario {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  created_at?: string;
}

@Component({
  selector: 'app-admin-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './adminpacientes.html',
  styleUrls: ['./adminpacientes.css']
})
export class AdminPacientesComponent implements OnInit {
  private supabase: SupabaseClient;

  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  busqueda = '';
  cargando = false;
  error = '';

  // Paginación
  paginaActual = 1;
  porPagina = 10;

  // Modal crear/editar
  mostrarModal = false;
  modoEdicion = false;
  usuarioSeleccionado: Partial<Usuario> = {};
  guardando = false;

  // Modal confirmar eliminar
  mostrarConfirmar = false;
  usuarioAEliminar: Usuario | null = null;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  async cargarUsuarios() {
  this.cargando = true;
  this.error = '';
  const { data, error } = await this.supabase
    .from('usuarios')
    .select('*')
    .order('nombre', { ascending: true });

  console.log('data:', data);
  console.log('error:', error);
  
  if (error) {
    this.error = 'Error al cargar pacientes.';
  } else {
    this.usuarios = data ?? [];
    this.filtrar();
  }
  this.cargando = false;

  }

  filtrar() {
    const texto = this.busqueda.toLowerCase().trim();
    this.usuariosFiltrados = texto
      ? this.usuarios.filter(u =>
          u.nombre.toLowerCase().includes(texto) ||
          u.email?.toLowerCase().includes(texto) ||
          u.telefono?.includes(texto)
        )
      : [...this.usuarios];
    this.paginaActual = 1;
  }

  get usuariosPagina(): Usuario[] {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    return this.usuariosFiltrados.slice(inicio, inicio + this.porPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.usuariosFiltrados.length / this.porPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  cambiarPagina(p: number) {
    if (p >= 1 && p <= this.totalPaginas) this.paginaActual = p;
  }

  abrirModalNuevo() {
    this.modoEdicion = false;
    this.usuarioSeleccionado = {};
    this.mostrarModal = true;
  }

  abrirModalEditar(usuario: Usuario) {
    this.modoEdicion = true;
    this.usuarioSeleccionado = { ...usuario };
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.usuarioSeleccionado = {};
  }

  async guardarUsuario() {
    if (!this.usuarioSeleccionado.nombre?.trim()) return;
    this.guardando = true;

    if (this.modoEdicion && this.usuarioSeleccionado.id) {
      const { nombre, email, telefono } = this.usuarioSeleccionado;
      const { error } = await this.supabase
        .from('usuarios')
        .update({ nombre, email, telefono })
        .eq('id', this.usuarioSeleccionado.id);
      if (!error) { await this.cargarUsuarios(); this.cerrarModal(); }
    } else {
      const { nombre, email, telefono } = this.usuarioSeleccionado;
      const { error } = await this.supabase
        .from('usuarios')
        .insert([{ nombre, email, telefono }]);
      if (!error) { await this.cargarUsuarios(); this.cerrarModal(); }
    }
    this.guardando = false;
  }

  confirmarEliminar(usuario: Usuario) {
    this.usuarioAEliminar = usuario;
    this.mostrarConfirmar = true;
  }

  async eliminarUsuario() {
    if (!this.usuarioAEliminar) return;
    await this.supabase.from('usuarios').delete().eq('id', this.usuarioAEliminar.id);
    await this.cargarUsuarios();
    this.mostrarConfirmar = false;
    this.usuarioAEliminar = null;
  }

  cancelarEliminar() {
    this.mostrarConfirmar = false;
    this.usuarioAEliminar = null;
  }

  formatearFecha(fecha?: string): string {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-MX', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }
}