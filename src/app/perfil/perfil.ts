import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../services/supabase';
import { NgIf, NgFor, SlicePipe, NgClass } from '@angular/common'; // 👈

@Component({
  selector: 'app-perfil',
  imports: [NgIf, NgFor, NgClass, FormsModule, RouterLink, SlicePipe], // 👈
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {
  nombre = '';
  email = '';
  iniciales = '';
  citas: any[] = [];
  mensajes: any[] = [];
  nuevoMensaje = '';
  cargando = true;

  constructor(
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const session = await this.supabase.getSession();

    if (session) {
      const user = session.user;
      this.nombre = user.user_metadata?.['nombre'] || user.email || 'Usuario';
      this.email = user.email || '';
      this.iniciales = this.nombre.split(' ').map((n: string) => n[0]).join('').toUpperCase();

      const { data: citas } = await this.supabase.getCitasByUsuario(user.id);
      if (citas) this.citas = [...citas];

      const { data: mensajes } = await this.supabase.getMensajesByUsuario(user.id);
      if (mensajes) this.mensajes = [...mensajes];
    } else {
      localStorage.clear();
      this.nombre = 'Usuario';
      this.email = '';
      this.iniciales = '';
    }

    this.cargando = false;
    this.cdr.detectChanges();
  }

  puedeCancelar(cita: any): boolean {
    if (cita.estado !== 'pendiente') return false;

    const ahora = new Date();
    const fechaHoraCita = new Date(`${cita.fecha}T${cita.hora}`);
    const diferenciaHoras = (fechaHoraCita.getTime() - ahora.getTime()) / (1000 * 60 * 60);

    return diferenciaHoras > 24;
  }

  async cancelarCita(citaId: string) {
    const confirmar = confirm('¿Estás segura de que deseas cancelar esta cita?');
    if (!confirmar) return;

    const { error } = await this.supabase.cancelarCita(citaId);
    if (!error) {
      this.citas = this.citas.map(c =>
        c.id === citaId ? { ...c, estado: 'cancelada' } : c
      );
      this.cdr.detectChanges();
    }
  }

  async enviarMensaje() {
    if (!this.nuevoMensaje) return;

    const session = await this.supabase.getSession();
    if (session) {
      const { error } = await this.supabase.enviarMensaje(session.user.id, this.nuevoMensaje);
      if (!error) {
        alert('¡Mensaje enviado correctamente!');
        this.nuevoMensaje = '';
        const { data } = await this.supabase.getMensajesByUsuario(session.user.id);
        if (data) this.mensajes = [...data];
        this.cdr.detectChanges();
      }
    }
  }
}