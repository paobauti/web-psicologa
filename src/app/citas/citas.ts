import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { NgIf, NgFor, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHero } from '../shared/page-hero/page-hero';
import { SupabaseService } from '../services/supabase';

@Component({
  selector: 'app-citas',
  imports: [FullCalendarModule, NgIf, NgFor, SlicePipe, FormsModule, PageHero],
  templateUrl: './citas.html',
  styleUrl: './citas.css'
})
export class Citas implements OnInit {
  fechaSeleccionada = '';
  horarioSeleccionado = '';
  horarios: any[] = [];
  horariosOcupados: string[] = [];
  calendarEvents: any[] = [];
  nombre = '';
  email = '';
  telefono = '';
  tipoSesion = '';
  temas = '';
  errorMsg = '';
  exitoMsg = '';
  cargandoHorarios = false;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'es',
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next'
    },
    selectable: true,
    events: [],
    dateClick: (info) => {
      this.fechaSeleccionada = info.dateStr;
      this.horarioSeleccionado = '';
      this.cdr.detectChanges();
      console.log('Fecha seleccionada:', this.fechaSeleccionada);
      this.cargarHorariosOcupados(info.dateStr);
    }
  };

  constructor(private supabase: SupabaseService, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    const usuario = await this.supabase.getUsuarioActual();
    if (usuario) {
      this.email = usuario.email || '';
      this.nombre = usuario.user_metadata?.['nombre'] || '';
    }
    const { data, error } = await this.supabase.getHorarios();
    console.log('Horarios:', data, 'Error:', error);
    if (data) this.horarios = data;
  }

  async cargarHorariosOcupados(fecha: string) {
    this.cargandoHorarios = true;
    this.cdr.detectChanges();
    try {
      const { data } = await this.supabase.getHorariosOcupados(fecha);
      this.horariosOcupados = data?.map((c: any) => c.hora) || [];
      console.log('Horarios ocupados:', this.horariosOcupados);
    } catch (e) {
      this.horariosOcupados = [];
    } finally {
      this.cargandoHorarios = false;
      this.cdr.detectChanges();
    }
  }

  estaOcupado(hora: string): boolean {
    const horaCorta = hora.substring(0, 5);
    return this.horariosOcupados.some(h => h.substring(0, 5) === horaCorta);
  }

  seleccionarHorario(hora: string) {
    this.horarioSeleccionado = hora;
  }

  async agendarCita() {
    this.errorMsg = '';
    this.exitoMsg = '';

    if (!this.fechaSeleccionada || !this.horarioSeleccionado || !this.nombre || !this.email || !this.tipoSesion) {
      this.errorMsg = 'Por favor completa todos los campos y selecciona fecha y horario';
      return;
    }

    const disponible = await this.supabase.verificarDisponibilidad(
      this.fechaSeleccionada,
      this.horarioSeleccionado
    );

    if (!disponible) {
      this.errorMsg = 'Ese horario ya fue reservado. Por favor elige otro.';
      await this.cargarHorariosOcupados(this.fechaSeleccionada);
      return;
    }

    const usuario = await this.supabase.getUsuarioActual();

    const cita = {
      usuario_id: usuario?.id || null,
      fecha: this.fechaSeleccionada,
      hora: this.horarioSeleccionado,
      tipo_sesion: this.tipoSesion,
      temas: this.temas,
      estado: 'pendiente'
    };

    const { error } = await this.supabase.agendarCita(cita);

    if (error) {
      this.errorMsg = 'Error al agendar la cita. Intenta de nuevo.';
    } else {
      this.exitoMsg = '¡Cita agendada correctamente! Daisy se pondrá en contacto contigo.';
      setTimeout(() => { this.exitoMsg = ''; }, 5000);
      this.fechaSeleccionada = '';
      this.horarioSeleccionado = '';
      this.horariosOcupados = [];
      this.tipoSesion = '';
      this.temas = '';
      this.cdr.detectChanges();
    }
  }
}