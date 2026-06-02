import { Injectable } from '@angular/core';
import usuarios from '../data/usuarios.json';
import citas from '../data/citas.json';
import mensajes from '../data/mensajes.json';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // USUARIOS
  getUsuarios() {
    return usuarios;
  }

  getUsuarioByEmail(email: string) {
    return usuarios.find(u => u.email === email);
  }

  getUsuarioById(id: number) {
    return usuarios.find(u => u.id === id);
  }

  // CITAS
  getCitas() {
    return citas;
  }

  getCitasByUsuario(usuarioId: number) {
    return citas.filter(c => c.usuarioId === usuarioId);
  }

  // MENSAJES
  getMensajes() {
    return mensajes;
  }

  getMensajesByUsuario(usuarioId: number) {
    return mensajes.filter(m => m.usuarioId === usuarioId);
  }
}