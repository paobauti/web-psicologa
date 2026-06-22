import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

interface Recurso {
  id: string;
  titulo: string;
  descripcion?: string;
  categoria?: string;
  imagen_url?: string;
  contenido?: string;
  publicado: boolean;
  puntos?: string[];
  pdf_url?: string;
  created_at?: string;
}

@Component({
  selector: 'app-admin-recursos',
  standalone: true,
  imports: [CommonModule, FormsModule],
 templateUrl: './adminrecursos.html',
styleUrls: ['./adminrecursos.css']
})
export class AdminRecursosComponent implements OnInit {
  private supabase: SupabaseClient;

  recursos: Recurso[] = [];
  cargando = false;
  error = '';

  // Modal
  mostrarModal = false;
  modoEdicion = false;
  recursoSeleccionado: Partial<Recurso> = {};
  guardando = false;
  subiendoImagen = false;

  // Confirmar eliminar
  mostrarConfirmar = false;
  recursoAEliminar: Recurso | null = null;

  readonly CATEGORIAS = ['Fe y Espiritualidad', 'Salud emocional', 'Bienestar', 'Crecimiento Personal', 'Terapia', 'Familia'];

  constructor(private cd: ChangeDetectorRef) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  ngOnInit() {
    this.cargarRecursos();
  }

  async cargarRecursos() {
    this.cargando = true;
    this.error = '';
    const { data, error } = await this.supabase
      .from('recursos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) this.error = 'Error al cargar recursos.';
    else this.recursos = data ?? [];
    this.cargando = false;
    this.cd.detectChanges();
  }

  async togglePublicado(recurso: Recurso) {
    const nuevoEstado = !recurso.publicado;
    const { error } = await this.supabase
      .from('recursos')
      .update({ publicado: nuevoEstado })
      .eq('id', recurso.id);
    if (!error) {
      recurso.publicado = nuevoEstado;
      this.cd.detectChanges();
    }
  }

  abrirModalNuevo() {
    this.modoEdicion = false;
    this.recursoSeleccionado = { publicado: false, categoria: 'Fe y Espiritualidad' };
    this.mostrarModal = true;
  }

  abrirModalEditar(recurso: Recurso) {
    this.modoEdicion = true;
    this.recursoSeleccionado = { ...recurso };
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.recursoSeleccionado = {};
  }

  async subirImagen(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    this.subiendoImagen = true;

    const ext = file.name.split('.').pop();
    const path = `recursos/${Date.now()}.${ext}`;
    const { error } = await this.supabase.storage.from('imagenes').upload(path, file);
    if (!error) {
      const { data } = this.supabase.storage.from('imagenes').getPublicUrl(path);
      this.recursoSeleccionado.imagen_url = data.publicUrl;
    }
    this.subiendoImagen = false;
    this.cd.detectChanges();
  }

  async guardarRecurso() {
    if (!this.recursoSeleccionado.titulo?.trim()) return;
    this.guardando = true;

    const payload = {
      titulo: this.recursoSeleccionado.titulo,
      descripcion: this.recursoSeleccionado.descripcion,
      categoria: this.recursoSeleccionado.categoria,
      imagen_url: this.recursoSeleccionado.imagen_url,
      contenido: this.recursoSeleccionado.contenido,
      publicado: this.recursoSeleccionado.publicado ?? false,
      pdf_url: this.recursoSeleccionado.pdf_url,
    };

    if (this.modoEdicion && this.recursoSeleccionado.id) {
      await this.supabase.from('recursos').update(payload).eq('id', this.recursoSeleccionado.id);
    } else {
      await this.supabase.from('recursos').insert([payload]);
    }

    await this.cargarRecursos();
    this.cerrarModal();
    this.guardando = false;
  }

  confirmarEliminar(recurso: Recurso) {
    this.recursoAEliminar = recurso;
    this.mostrarConfirmar = true;
  }

  async eliminarRecurso() {
    if (!this.recursoAEliminar) return;
    await this.supabase.from('recursos').delete().eq('id', this.recursoAEliminar.id);
    await this.cargarRecursos();
    this.mostrarConfirmar = false;
    this.recursoAEliminar = null;
  }

  cancelarEliminar() {
    this.mostrarConfirmar = false;
    this.recursoAEliminar = null;
  }
} 
