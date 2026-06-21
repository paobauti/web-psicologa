import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

interface Servicio {
  id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  orden?: number;
  created_at?: string;
}

@Component({
  selector: 'app-admin-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './adminservicios.html',
  styleUrls: ['./adminservicios.css']
})
export class AdminServiciosComponent implements OnInit {
  private supabase: SupabaseClient;

  servicios: Servicio[] = [];
  cargando = false;
  error = '';

  // Modal
  mostrarModal = false;
  modoEdicion = false;
  servicioSeleccionado: Partial<Servicio> = {};
  guardando = false;

  // Confirmar eliminar
  mostrarConfirmar = false;
  servicioAEliminar: Servicio | null = null;

  constructor(private cd: ChangeDetectorRef) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  ngOnInit() {
    this.cargarServicios();
  }

  async cargarServicios() {
    this.cargando = true;
    this.error = '';
    const { data, error } = await this.supabase
      .from('servicios')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) this.error = 'Error al cargar servicios.';
    else this.servicios = data ?? [];
    this.cargando = false;
    this.cd.detectChanges();
  
  }

  async toggleActivo(servicio: Servicio) {
    const nuevoEstado = !servicio.activo;
    const { error } = await this.supabase
      .from('servicios')
      .update({ activo: nuevoEstado })
      .eq('id', servicio.id);
    if (!error) {
      servicio.activo = nuevoEstado;
      this.cd.detectChanges();
    }
  }

  abrirModalNuevo() {
    this.modoEdicion = false;
    this.servicioSeleccionado = { activo: true };
    this.mostrarModal = true;
  }

  abrirModalEditar(servicio: Servicio) {
    this.modoEdicion = true;
    this.servicioSeleccionado = { ...servicio };
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.servicioSeleccionado = {};
  }

  async guardarServicio() {
    if (!this.servicioSeleccionado.nombre?.trim()) return;
    this.guardando = true;

    const payload = {
      nombre: this.servicioSeleccionado.nombre,
      descripcion: this.servicioSeleccionado.descripcion,
      activo: this.servicioSeleccionado.activo ?? true,
    };

    if (this.modoEdicion && this.servicioSeleccionado.id) {
      await this.supabase.from('servicios').update(payload).eq('id', this.servicioSeleccionado.id);
    } else {
      await this.supabase.from('servicios').insert([payload]);
    }

    await this.cargarServicios();
    this.cerrarModal();
    this.guardando = false;
  }

  confirmarEliminar(servicio: Servicio) {
    this.servicioAEliminar = servicio;
    this.mostrarConfirmar = true;
  }

  async eliminarServicio() {
    if (!this.servicioAEliminar) return;
    await this.supabase.from('servicios').delete().eq('id', this.servicioAEliminar.id);
    await this.cargarServicios();
    this.mostrarConfirmar = false;
    this.servicioAEliminar = null;
  }

  cancelarEliminar() {
    this.mostrarConfirmar = false;
    this.servicioAEliminar = null;
  }
}