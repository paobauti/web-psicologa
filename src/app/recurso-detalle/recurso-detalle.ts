import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf, NgFor, LowerCasePipe } from '@angular/common';
import { SupabaseService } from '../services/supabase';

@Component({
  selector: 'app-recurso-detalle',
  imports: [NgIf, NgFor, RouterLink, LowerCasePipe],
  templateUrl: './recurso-detalle.html',
  styleUrl: './recurso-detalle.css'
})
export class RecursoDetalle implements OnInit {
  recurso: any = null;
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID recibido:', id);

    if (id) {
      const { data, error } = await this.supabase.getRecursoById(id);
      console.log('Recurso data:', data);
      console.log('Recurso error:', error);
      if (data) this.recurso = data;
    }
    this.cargando = false;
    this.cdr.detectChanges(); // ← fuerza actualización de la vista
  }

  descargarPdf() {
    if (this.recurso?.pdf_url) {
      window.open(this.recurso.pdf_url, '_blank');
    }
  }
}