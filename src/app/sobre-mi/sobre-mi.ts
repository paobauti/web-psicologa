import { Component } from '@angular/core';
import { SobreMiInfo } from './sobre-mi-info/sobre-mi-info';
import { EnfoqueTerapeutico } from './enfoque-terapeutico/enfoque-terapeutico';
import { Horarios } from './horarios/horarios';
import { PoliticaCitas } from './politica-citas/politica-citas';

@Component({
  selector: 'app-sobre-mi',
  imports: [SobreMiInfo, EnfoqueTerapeutico, Horarios, PoliticaCitas],
  templateUrl: './sobre-mi.html',
  styleUrl: './sobre-mi.css'
})
export class SobreMi {}
