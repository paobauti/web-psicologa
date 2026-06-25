import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase';
import { LifeCoach } from '../life-coach/life-coach';

@Component({
  selector: 'app-nuevos-espacios',
  imports: [NgFor, NgIf, RouterLink, LifeCoach],
  templateUrl: './nuevos-espacios.html',
  styleUrl: './nuevos-espacios.css'
})
export class NuevosEspacios implements OnInit {
  serviciosProximos: any[] = [];
  serviciosActivos: any[] = [];

  iconos: { [key: string]: string } = {
    'Terapia Individual': 'fa-solid fa-user',
    'Terapia de Pareja': 'fa-solid fa-heart',
    'Terapia Familiar': 'fa-solid fa-house',
    'Terapia de Grupo': 'fa-solid fa-people-group'
  };

  constructor(private supabase: SupabaseService, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    const { data } = await this.supabase.getTodosServicios();
    if (data) {
      const sinLifeCoach = data.filter((s: any) => s.nombre !== 'Life Coach');
      this.serviciosActivos = sinLifeCoach.filter((s: any) => s.activo === true);
      this.serviciosProximos = sinLifeCoach.filter((s: any) => s.activo === false);
      this.cdr.detectChanges();
    }
  }

  getIcono(nombre: string): string {
    return this.iconos[nombre] || 'fa-solid fa-star';
  }
}