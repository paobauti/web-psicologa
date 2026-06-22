import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-buscador',
  imports: [FormsModule],
  templateUrl: './buscador.html',
  styleUrl: './buscador.css',
})
export class Buscador {
  termino = '';

  @Output() buscar = new EventEmitter<string>(); // 👈

  onInput() {
    this.buscar.emit(this.termino);
  }
}