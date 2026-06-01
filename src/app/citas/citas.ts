import { Component } from '@angular/core';
import { PageHero } from '../shared/page-hero/page-hero';
import { CitasCalendly } from './citas-calendly/citas-calendly';
import { CitasForm } from './citas-form/citas-form';

@Component({
  selector: 'app-citas',
  imports: [PageHero, CitasCalendly, CitasForm],
  templateUrl: './citas.html',
  styleUrl: './citas.css'
})
export class Citas {}