import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DataService } from '../services/data';

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

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.nombre = localStorage.getItem('usuarioNombre') || 'Usuario';
    this.email = localStorage.getItem('usuarioEmail') || '';
    this.iniciales = this.nombre.split(' ').map(n => n[0]).join('').toUpperCase();

    const usuarioId = parseInt(localStorage.getItem('usuarioId') || '1');
    this.citas = this.dataService.getCitasByUsuario(usuarioId);
    this.mensajes = this.dataService.getMensajesByUsuario(usuarioId);
  }

  enviarMensaje() {
    if (this.nuevoMensaje) {
      alert('Mensaje enviado correctamente');
      this.nuevoMensaje = '';
    }
  }
}