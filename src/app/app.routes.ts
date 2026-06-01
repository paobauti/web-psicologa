import { Routes } from '@angular/router';
import { SobreMi } from './sobre-mi/sobre-mi';
import { Servicios } from './servicios/servicios';
import { Recursos } from './recursos/recursos';
import { Contacto } from './contacto/contacto';
import { Citas } from './citas/citas';

export const routes: Routes = [
  { path: 'sobre-mi', component: SobreMi },
  { path: 'servicios', component: Servicios },
  { path: 'recursos', component: Recursos },
  { path: 'contacto', component: Contacto },
  { path: 'citas', component: Citas },
];