import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../services/supabase';

@Component({
  selector: 'app-perfil',
  imports: [NgIf, NgFor, FormsModule, RouterLink],
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

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    this.nombre = localStorage.getItem('usuarioNombre') || 'Usuario';
    this.email = localStorage.getItem('usuarioEmail') || '';
    this.iniciales = this.nombre.split(' ').map(n => n[0]).join('').toUpperCase();

    const usuarioId = localStorage.getItem('usuarioId') || '';

    if (usuarioId) {
      const { data: citas } = await this.supabase.getCitasByUsuario(usuarioId);
      if (citas) this.citas = citas;

      const { data: mensajes } = await this.supabase.getMensajesByUsuario(usuarioId);
      if (mensajes) this.mensajes = mensajes;
    }

    this.cargando = false;
  }

  async enviarMensaje() {
    if (this.nuevoMensaje) {
      const usuarioId = localStorage.getItem('usuarioId') || '';
      const { error } = await this.supabase.enviarMensaje(usuarioId, this.nuevoMensaje);
      if (!error) {
        alert('¡Mensaje enviado correctamente!');
        this.nuevoMensaje = '';
        const { data } = await this.supabase.getMensajesByUsuario(usuarioId);
        if (data) this.mensajes = data;
      }
    }
  }
}