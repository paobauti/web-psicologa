import { Component, OnInit } from '@angular/core';
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
  recursos: any[] = [];

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    const { data, error } = await this.supabase.getRecursos();
    console.log('datos:', data);
    console.log('error:', error);
    if (data) this.recursos = data;
  }
}