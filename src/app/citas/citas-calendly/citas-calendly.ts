import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-citas-calendly',
  imports: [],
  templateUrl: './citas-calendly.html',
  styleUrl: './citas-calendly.css'
})
export class CitasCalendly implements OnInit {
  ngOnInit() {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
  }
}
