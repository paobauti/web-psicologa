import { Routes } from '@angular/router';
import { SobreMi } from './sobre-mi/sobre-mi';
import { Servicios } from './servicios/servicios';
import { Recursos } from './recursos/recursos';
import { Citas } from './citas/citas';
import { Login } from './login/login';
import { Perfil } from './perfil/perfil';

export const routes: Routes = [
  { path: 'sobre-mi', component: SobreMi },
  { path: 'servicios', component: Servicios },
  { path: 'recursos', component: Recursos },
  { path: 'citas', component: Citas },
  { path: 'login', component: Login },
  { path: 'perfil', component: Perfil },
];