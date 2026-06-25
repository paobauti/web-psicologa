import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { NgIf, NgFor, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PageHero } from '../shared/page-hero/page-hero';
import { SupabaseService } from '../services/supabase';

@Component({
  selector: 'app-citas',
  imports: [FullCalendarModule, NgIf, NgFor, SlicePipe, FormsModule, PageHero, RouterLink],
  templateUrl: './citas.html',
  styleUrl: './citas.css'
})
export class Citas implements OnInit {
  fechaSeleccionada = '';
  horarioSeleccionado = '';
  horarios: any[] = [];
  horariosOcupados: string[] = [];
  nombre = '';
  email = '';
  telefono = '';
  tipoSesion = '';
  temas = '';
  errorMsg = '';
  exitoMsg = '';
  cargandoHorarios = false;

  // Fecha mínima: hoy en formato YYYY-MM-DD
  private hoy = new Date().toISOString().split('T')[0];

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
    validRange: {
      start: this.hoy   // bloquea fechas anteriores a hoy
    },
    events: [],

    dateClick: (info) => {
      this.ngZone.run(() => {
        this.fechaSeleccionada = info.dateStr;
        this.horarioSeleccionado = '';
        this.horariosOcupados = [];
        this.resaltarFecha(info.dateStr);
        this.cargarHorariosOcupados(info.dateStr);
      });
    }
  };

  constructor(
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  async ngOnInit() {
    await this.supabase.sincronizarUsuario();
    const session = await this.supabase.getSession();
    if (session) {
      this.email = session.user.email || '';
      this.nombre = session.user.user_metadata?.['nombre'] || '';
    }
    const { data } = await this.supabase.getHorarios();
    if (data) this.horarios = data;
  }

  async cargarHorariosOcupados(fecha: string) {
    this.cargandoHorarios = true;
    try {
      const { data } = await this.supabase.getHorariosOcupados(fecha);
      this.horariosOcupados = data?.map((c: any) => c.hora) || [];
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

  async agendarCita() {
    this.errorMsg = '';
    this.exitoMsg = '';

    if (!this.fechaSeleccionada || !this.horarioSeleccionado || !this.nombre || !this.email || !this.tipoSesion) {
      this.errorMsg = 'Por favor completa todos los campos y selecciona fecha y horario.';
      this.cdr.detectChanges();
      return;
    }

    const disponible = await this.supabase.verificarDisponibilidad(
      this.fechaSeleccionada,
      this.horarioSeleccionado
    );

    if (!disponible) {
      this.errorMsg = 'Ese horario ya fue reservado. Por favor elige otro.';
      await this.cargarHorariosOcupados(this.fechaSeleccionada);
      this.cdr.detectChanges();
      return;
    }

    const session = await this.supabase.getSession();

    const cita = {
      usuario_id: session?.user.id || null,
      fecha: this.fechaSeleccionada,
      hora: this.horarioSeleccionado,
      tipo_sesion: this.tipoSesion,
      temas: this.temas,
      estado: 'pendiente'
    };

    const { error } = await this.supabase.agendarCita(cita);

    if (error) {
      if (error.code === '23505') {
        this.errorMsg = 'Ya tienes una cita en ese horario. Por favor elige otro.';
        await this.cargarHorariosOcupados(this.fechaSeleccionada);
      } else {
        this.errorMsg = 'Error al agendar la cita. Intenta de nuevo.';
        console.error('Error al agendar:', error);
      }
      this.cdr.detectChanges();
    } else {
      // Primero mostramos el modal, luego limpiamos el formulario
      this.exitoMsg = '¡Cita agendada correctamente!';
      this.cdr.detectChanges();

      // Limpiamos el formulario sin tocar exitoMsg
      this.horarioSeleccionado = '';
      this.horariosOcupados = [];
      this.tipoSesion = '';
      this.temas = '';
      this.fechaSeleccionada = '';
    }
  }

  cerrarExito() {
    this.exitoMsg = '';
    this.cdr.detectChanges();
  }

  cerrarError() {
    this.errorMsg = '';
    this.cdr.detectChanges();
  }

  resaltarFecha(dateStr: string) {
    document.querySelectorAll('.dia-seleccionado').forEach(el => {
      el.classList.remove('dia-seleccionado');
    });
    const celda = document.querySelector(`[data-date="${dateStr}"]`);
    if (celda) celda.classList.add('dia-seleccionado');
  }
}