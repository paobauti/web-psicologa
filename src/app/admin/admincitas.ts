import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';


interface Cita {
  id: string;
  usuario_id?: string;
  fecha: string;
  hora: string;
  tipo_sesion: string;
  temas?: string;
  estado: string;
  created_at?: string;
  usuarios?: { nombre: string; telefono?: string };
}

@Component({
  selector: 'app-admin-citas',
  standalone: true,
 imports: [CommonModule, FormsModule, TitleCasePipe],
  templateUrl: './admincitas.html',
styleUrls: ['./admincitas.css']
})
export class AdminCitasComponent implements OnInit {
  private supabase: SupabaseClient;

  // Calendario
  anioActual = new Date().getFullYear();
  mesActual = new Date().getMonth(); // 0-11
  diaSeleccionado: string | null = null;
  citasDelDia: Cita[] = [];
  citasDelMes: Cita[] = [];

  // Modal
  mostrarModal = false;
  modoEdicion = false;
  citaSeleccionada: Partial<Cita> = {};
  guardando = false;

  // Confirmar eliminar
  mostrarConfirmar = false;
  citaAEliminar: Cita | null = null;

  cargando = false;

  readonly MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  readonly DIAS_SEMANA = ['DOM','LUN','MAR','MIE','JUE','VIE','SAB'];
  readonly ESTADOS = ['pendiente','confirmada','cancelada','en proceso','terminada'];
  readonly TIPOS_SESION = ['Life Coach','Terapia Individual','Terapia Pareja','Terapia Familiar','Terapia Grupo'];

  constructor(private cd: ChangeDetectorRef) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  ngOnInit() {
    this.cargarCitasMes();
    // Seleccionar hoy por defecto
    const hoy = new Date();
    if (hoy.getFullYear() === this.anioActual && hoy.getMonth() === this.mesActual) {
      this.seleccionarDia(this.formatearFechaISO(hoy));
    }
  }

  // ─── Navegación del calendario ───
  mesAnterior() {
    if (this.mesActual === 0) { this.mesActual = 11; this.anioActual--; }
    else this.mesActual--;
    this.diaSeleccionado = null;
    this.citasDelDia = [];
    this.cargarCitasMes();
  }

  mesSiguiente() {
    if (this.mesActual === 11) { this.mesActual = 0; this.anioActual++; }
    else this.mesActual++;
    this.diaSeleccionado = null;
    this.citasDelDia = [];
    this.cargarCitasMes();
  }

  // ─── Días del mes ───
  get diasDelMes(): (number | null)[] {
    const primerDia = new Date(this.anioActual, this.mesActual, 1).getDay();
    const totalDias = new Date(this.anioActual, this.mesActual + 1, 0).getDate();
    const dias: (number | null)[] = Array(primerDia).fill(null);
    for (let i = 1; i <= totalDias; i++) dias.push(i);
    return dias;
  }

  get hoy(): string {
    return this.formatearFechaISO(new Date());
  }

  formatearFechaISO(fecha: Date): string {
    return fecha.toISOString().split('T')[0];
  }

  fechaDelDia(dia: number): string {
    return `${this.anioActual}-${String(this.mesActual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
  }

  tieneCitas(dia: number): boolean {
    const fecha = this.fechaDelDia(dia);
    return this.citasDelMes.some(c => c.fecha === fecha);
  }

  // ─── Cargar citas ───
  async cargarCitasMes() {
    this.cargando = true;
    const inicio = `${this.anioActual}-${String(this.mesActual + 1).padStart(2, '0')}-01`;
    const fin = new Date(this.anioActual, this.mesActual + 1, 0).toISOString().split('T')[0];

    const { data } = await this.supabase
      .from('citas')
      .select('*, usuarios(nombre, telefono)')
      .gte('fecha', inicio)
      .lte('fecha', fin);

    this.citasDelMes = data ?? [];
    this.cargando = false;
    this.cd.detectChanges();
  }

  async seleccionarDia(fecha: string) {
    this.diaSeleccionado = fecha;
    this.citasDelDia = this.citasDelMes.filter(c => c.fecha === fecha);
    this.cd.detectChanges();
  }

  // ─── Modal ───
  abrirModalNuevo() {
    this.modoEdicion = false;
    this.citaSeleccionada = {
      fecha: this.diaSeleccionado ?? this.hoy,
      estado: 'pendiente',
      tipo_sesion: 'Life Coach'
    };
    this.mostrarModal = true;
  }

  abrirModalEditar(cita: Cita) {
    this.modoEdicion = true;
    this.citaSeleccionada = { ...cita };
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.citaSeleccionada = {};
  }

  async guardarCita() {
    if (!this.citaSeleccionada.fecha || !this.citaSeleccionada.hora) return;
    this.guardando = true;

    const payload = {
      fecha: this.citaSeleccionada.fecha,
      hora: this.citaSeleccionada.hora,
      tipo_sesion: this.citaSeleccionada.tipo_sesion,
      temas: this.citaSeleccionada.temas,
      estado: this.citaSeleccionada.estado
    };

    if (this.modoEdicion && this.citaSeleccionada.id) {
      await this.supabase.from('citas').update(payload).eq('id', this.citaSeleccionada.id);
    } else {
      await this.supabase.from('citas').insert([payload]);
    }

    await this.cargarCitasMes();
    if (this.diaSeleccionado) this.seleccionarDia(this.diaSeleccionado);
    this.cerrarModal();
    this.guardando = false;
  }

  async actualizarEstado(cita: Cita, estado: string) {
    await this.supabase.from('citas').update({ estado }).eq('id', cita.id);
    cita.estado = estado;
    this.cd.detectChanges();
  }

  confirmarEliminar(cita: Cita) {
    this.citaAEliminar = cita;
    this.mostrarConfirmar = true;
  }

  async eliminarCita() {
    if (!this.citaAEliminar) return;
    await this.supabase.from('citas').delete().eq('id', this.citaAEliminar.id);
    await this.cargarCitasMes();
    if (this.diaSeleccionado) this.seleccionarDia(this.diaSeleccionado);
    this.mostrarConfirmar = false;
    this.citaAEliminar = null;
  }

  cancelarEliminar() {
    this.mostrarConfirmar = false;
    this.citaAEliminar = null;
  }

  // ─── Helpers ───
  colorEstado(estado: string): string {
    const colores: Record<string, string> = {
      confirmada: 'estado-confirmada',
      pendiente: 'estado-pendiente',
      cancelada: 'estado-cancelada',
      'en proceso': 'estado-proceso',
      terminada: 'estado-terminada'
    };
    return colores[estado] ?? 'estado-pendiente';
  }

  formatearHora(hora: string): string {
    if (!hora) return '';
    const [h, m] = hora.split(':');
    const hNum = parseInt(h);
    return `${hNum > 12 ? hNum - 12 : hNum}:${m} ${hNum >= 12 ? 'PM' : 'AM'}`;
  }

  formatearFechaLarga(fecha: string): string {
    if (!fecha) return '';
    const d = new Date(fecha + 'T00:00:00');
    return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  }
}
