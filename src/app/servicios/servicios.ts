import { Component } from '@angular/core';
import { ServiciosHero } from './servicios-hero/servicios-hero';
import { LifeCoach } from './life-coach/life-coach';
import { NuevosEspacios } from './nuevos-espacios/nuevos-espacios';
import { BannerInfo } from './banner-info/banner-info';

@Component({
  selector: 'app-servicios',
  imports: [ServiciosHero, LifeCoach, NuevosEspacios, BannerInfo],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css'
})
export class Servicios {}