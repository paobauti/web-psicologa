import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

interface CitaProxima {
  id: string;
  fecha: string;
  hora: string;
  estado: string;
  usuarios?: {
    nombre: string;
  };
}

@Component({
  selector: 'app-home-adm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './HomeADM.html',
  styleUrls: ['./HomeADM.css']
})
export class HomeADM implements OnInit {
  private supabase: SupabaseClient;

  cargando = false;
  error = '';

  citasHoy = 0;
  mensajesNuevos = 0;
  totalRecursos = 0;
  proximasCitas: CitaProxima[] = [];

  constructor(private cd: ChangeDetectorRef) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  ngOnInit() {
    this.cargarResumen();
  }

  async cargarResumen() {
    this.cargando = true;
    this.error = '';

    try {
      const hoy = new Date().toISOString().split('T')[0];

      const [citasHoyRes, mensajesRes, recursosRes, proximasRes] = await Promise.all([
        this.supabase.from('citas').select('id', { count: 'exact', head: true }).eq('fecha', hoy),
        this.supabase.from('mensajes').select('id', { count: 'exact', head: true }).eq('leido', false),
        this.supabase.from('recursos').select('id', { count: 'exact', head: true }).eq('publicado', true),
        this.supabase
          .from('citas')
          .select('id, fecha, hora, estado, usuarios(nombre)')
          .gte('fecha', hoy)
          .order('fecha', { ascending: true })
          .order('hora', { ascending: true })
          .limit(6)
      ]);

      this.citasHoy = citasHoyRes.count ?? 0;
      this.mensajesNuevos = mensajesRes.count ?? 0;
      this.totalRecursos = recursosRes.count ?? 0;
      this.proximasCitas = (proximasRes.data as any) ?? [];

    } catch (e) {
      this.error = 'Error al cargar el resumen del consultorio.';
    }

    this.cargando = false;
    this.cd.detectChanges();
  }

  claseEstado(estado: string): string {
    switch (estado) {
      case 'confirmada': return 'estado-confirmada';
      case 'cancelada': return 'estado-cancelada';
      case 'en proceso': return 'estado-proceso';
      case 'terminada': return 'estado-terminada';
      default: return 'estado-pendiente';
    }
  }
}