import { Component } from '@angular/core';
import { RecursosHero } from './recursos-hero/recursos-hero';
import { Buscador } from '../shared/buscador/buscador';
import { RecursosGrid } from './recursos-grid/recursos-grid';
import { RecursosBanner } from './recursos-banner/recursos-banner';

@Component({
  selector: 'app-recursos',
  imports: [RecursosHero, Buscador, RecursosGrid, RecursosBanner],
  templateUrl: './recursos.html',
  styleUrl: './recursos.css'
})
export class Recursos {}