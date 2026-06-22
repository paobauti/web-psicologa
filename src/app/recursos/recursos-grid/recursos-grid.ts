import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-recursos-grid',
  imports: [NgFor, NgClass, RouterLink],
  templateUrl: './recursos-grid.html',
  styleUrl: './recursos-grid.css'
})
export class RecursosGrid implements OnInit {
  @Input() filtro = ''; // 👈

  todosLosRecursos: any[] = [];

  get recursos() { // 👈 filtra en tiempo real
    if (!this.filtro.trim()) return this.todosLosRecursos;
    const term = this.filtro.toLowerCase();
    return this.todosLosRecursos.filter(r =>
      r.titulo?.toLowerCase().includes(term) ||
      r.descripcion?.toLowerCase().includes(term) ||
      r.categoria?.toLowerCase().includes(term)
    );
  }

  constructor(
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const { data } = await this.supabase.getRecursos();
    if (data) {
      this.todosLosRecursos = [...data];
      this.cdr.detectChanges();
    }
  }
}