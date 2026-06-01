import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NgIf} from '@angular/common';
import { Menu } from './shared/menu/menu';
import { Footer } from './shared/footer/footer';
import { Hero } from './inicio/hero/hero';
import { Features } from './inicio/features/features';
import { Opiniones } from './inicio/opiniones/opiniones';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgIf, Menu, Footer, Hero, Features, Opiniones],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  isHome = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHome = event.urlAfterRedirects === '/';
      }
    });
  }
}