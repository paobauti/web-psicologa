import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NgIf} from '@angular/common';
import { Menu } from './shared/menu/menu';
import { Footer } from './shared/footer/footer';
import { Hero } from './inicio/hero/hero';
import { Features } from './inicio/features/features';
import { NuevosEspacios } from './servicios/nuevos-espacios/nuevos-espacios';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgIf, Menu, Footer, Hero, Features,NuevosEspacios],
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