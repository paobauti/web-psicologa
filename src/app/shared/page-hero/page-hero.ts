import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-hero',
  imports: [],
  templateUrl: './page-hero.html',
  styleUrl: './page-hero.css'
})
export class PageHero {
  @Input() titulo: string = '';
  @Input() descripcion: string = '';
  @Input() imagen: string = '';
}