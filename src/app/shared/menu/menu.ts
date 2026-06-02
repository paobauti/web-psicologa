import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, NgIf],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu implements OnInit {
  usuarioNombre: string | null = null;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.usuarioNombre = localStorage.getItem('usuarioNombre');
      }
    });
  }

  ngOnInit() {
    this.usuarioNombre = localStorage.getItem('usuarioNombre');
  }

  cerrarSesion() {
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuarioEmail');
    this.usuarioNombre = null;
    this.router.navigate(['/']);
  }
}