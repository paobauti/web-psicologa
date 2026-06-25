import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-life-coach',
  imports: [RouterLink, NgIf],
  templateUrl: './life-coach.html',
  styleUrl: './life-coach.css'
})
export class LifeCoach implements OnInit {
  @Input() servicioInput: any = null;
  servicio: any = null;

  constructor(private supabase: SupabaseService, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    if (this.servicioInput) {
      this.servicio = this.servicioInput;
      this.cdr.detectChanges();
    } else {
      const { data } = await this.supabase.getServicios();
      if (data) {
        this.servicio = data.find((s: any) => s.nombre === 'Life Coach');
        this.cdr.detectChanges();
      }
    }
  }
}