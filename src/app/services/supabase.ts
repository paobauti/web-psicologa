import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // RECURSOS
  async getRecursos() {
    const { data, error } = await this.supabase
      .from('recursos')
      .select('*')
      .eq('publicado', true);
    return { data, error };
  }

  async getRecursoById(id: string) {
    const { data, error } = await this.supabase
      .from('recursos')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  }

  // SERVICIOS
  async getServicios() {
    const { data, error } = await this.supabase
      .from('servicios')
      .select('*')
      .eq('activo', true);
    return { data, error };
  }

  // MENSAJES
  async enviarMensaje(usuarioId: string, mensaje: string) {
    const { data, error } = await this.supabase
      .from('mensajes')
      .insert([{ usuario_id: usuarioId, mensaje }]);
    return { data, error };
  }

  async getMensajesByUsuario(usuarioId: string) {
    const { data, error } = await this.supabase
      .from('mensajes')
      .select('*')
      .eq('usuario_id', usuarioId);
    return { data, error };
  }

  // CITAS
  async getCitasByUsuario(usuarioId: string) {
    const { data, error } = await this.supabase
      .from('citas')
      .select('*')
      .eq('usuario_id', usuarioId);
    return { data, error };
  }

  async agendarCita(cita: any) {
    const { data, error } = await this.supabase
      .from('citas')
      .insert([cita])
      .select()
      .single();
    return { data, error };
  }

  // HORARIOS
  async getHorarios() {
    const { data, error } = await this.supabase
      .from('horarios')
      .select('*')
      .eq('disponible', true);
    console.log('Supabase horarios response:', data, error);
    return { data, error };
  }

  // USUARIOS
  async registrarUsuario(nombre: string, email: string, telefono: string) {
    const { data, error } = await this.supabase
      .from('usuarios')
      .insert([{ nombre, email, telefono }])
      .select()
      .single();
    return { data, error };
  }

  async getUsuarioByEmail(email: string) {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();
    return { data, error };
  }

  // STORAGE - IMAGENES
  async subirImagen(bucket: string, path: string, file: File) {
    const { data, error } = await this.supabase
      .storage
      .from(bucket)
      .upload(path, file);
    return { data, error };
  }

  getImagenUrl(bucket: string, path: string) {
    const { data } = this.supabase
      .storage
      .from(bucket)
      .getPublicUrl(path);
    return data.publicUrl;
  }

  // AUTENTICACIÓN
  async registrar(email: string, password: string, nombre: string, telefono: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre, telefono }
      }
    });

    if (data.user && !error) {
      await this.supabase.from('usuarios').insert([{
        id: data.user.id,
        nombre,
        email,
        telefono
      }]);
    }
    return { data, error };
  }

  async iniciarSesion(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  }

  async cerrarSesion() {
    const { error } = await this.supabase.auth.signOut();
    return { error };
  }

  async getUsuarioActual() {
    const { data } = await this.supabase.auth.getUser();
    return data.user;
  }

  async getHorariosOcupados(fecha: string) {
  return await this.supabase
    .from('citas')
    .select('hora')
    .eq('fecha', fecha)
    .eq('estado', 'pendiente');
}

async verificarDisponibilidad(fecha: string, hora: string): Promise<boolean> {
  const { data, error } = await this.supabase
    .from('citas')
    .select('id')
    .eq('fecha', fecha)
    .eq('hora', hora)
    .eq('estado', 'pendiente')
    .limit(1);

  return !error && (data?.length === 0);
}

}