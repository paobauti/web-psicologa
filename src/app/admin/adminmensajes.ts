import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

interface Mensaje {
  id: string;
  usuario_id: string;
  mensaje: string;
  respuesta?: string;
  leido: boolean;
  created_at?: string;
  usuarios?: {
    nombre: string;
    email: string;
    telefono: string;
  };
}

@Component({
  selector: 'app-admin-mensajes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './adminmensajes.html',
  styleUrls: ['./adminmensajes.css']
})
export class AdminMensajesComponent implements OnInit {
  private supabase: SupabaseClient;

  mensajes: Mensaje[] = [];
  cargando = false;
  error = '';

  // Panel de detalle / respuesta
  mensajeSeleccionado: Mensaje | null = null;
  textoRespuesta = '';
  enviandoRespuesta = false;

  // Confirmar eliminar
  mostrarConfirmar = false;
  mensajeAEliminar: Mensaje | null = null;

  constructor(private cd: ChangeDetectorRef) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  ngOnInit() {
    this.cargarMensajes();
  }

  async cargarMensajes() {
    this.cargando = true;
    this.error = '';
    const { data, error } = await this.supabase
      .from('mensajes')
      .select('*, usuarios(nombre, email, telefono)')
      .order('created_at', { ascending: false });

    if (error) this.error = 'Error al cargar mensajes.';
    else this.mensajes = data ?? [];
    this.cargando = false;
    this.cd.detectChanges();
  }

  get noLeidos(): number {
    return this.mensajes.filter(m => !m.leido).length;
  }

  abrirMensaje(mensaje: Mensaje) {
    this.mensajeSeleccionado = mensaje;
    this.textoRespuesta = mensaje.respuesta || '';
    if (!mensaje.leido) {
      this.marcarLeido(mensaje);
    }
  }

  cerrarMensaje() {
    this.mensajeSeleccionado = null;
    this.textoRespuesta = '';
  }

  async marcarLeido(mensaje: Mensaje) {
    const { error } = await this.supabase
      .from('mensajes')
      .update({ leido: true })
      .eq('id', mensaje.id);
    if (!error) {
      mensaje.leido = true;
      this.cd.detectChanges();
    }
  }

  async enviarRespuesta() {
    if (!this.mensajeSeleccionado || !this.textoRespuesta.trim()) return;
    this.enviandoRespuesta = true;

    const { error } = await this.supabase
      .from('mensajes')
      .update({ respuesta: this.textoRespuesta, leido: true })
      .eq('id', this.mensajeSeleccionado.id);

    if (!error) {
      this.mensajeSeleccionado.respuesta = this.textoRespuesta;
      this.mensajeSeleccionado.leido = true;
    }
    this.enviandoRespuesta = false;
    this.cd.detectChanges();
  }

  confirmarEliminar(mensaje: Mensaje) {
    this.mensajeAEliminar = mensaje;
    this.mostrarConfirmar = true;
  }

  async eliminarMensaje() {
    if (!this.mensajeAEliminar) return;
    await this.supabase.from('mensajes').delete().eq('id', this.mensajeAEliminar.id);
    await this.cargarMensajes();
    if (this.mensajeSeleccionado?.id === this.mensajeAEliminar.id) {
      this.cerrarMensaje();
    }
    this.mostrarConfirmar = false;
    this.mensajeAEliminar = null;
  }

  cancelarEliminar() {
    this.mostrarConfirmar = false;
    this.mensajeAEliminar = null;
  }
}