import { Routes } from '@angular/router';
import { SobreMi } from './sobre-mi/sobre-mi';
import { Servicios } from './servicios/servicios';
import { Recursos } from './recursos/recursos';
import { Citas } from './citas/citas';
import { Login } from './login/login';
import { Perfil } from './perfil/perfil';
import { AdminCitasComponent } from './admin/admincitas';
import { AdminPacientesComponent } from './admin/adminpacientes';
import { AdminRecursosComponent } from './admin/adminrecursos';
import { AdminServiciosComponent } from './admin/adminservicios';
import { AdminMensajesComponent } from './admin/adminmensajes';
import { HomeADM } from './admin/HomeADM';
import { AdminLoginComponent } from './admin/adminlogin';
import { AdminLayoutComponent } from './admin/adminlayout';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: 'sobre-mi', component: SobreMi },
  { path: 'servicios', component: Servicios },
  { path: 'recursos/:id', loadComponent: () => import('./recurso-detalle/recurso-detalle').then(m => m.RecursoDetalle) },
  { path: 'recursos', component: Recursos },
  { path: 'citas', component: Citas },
  { path: 'login', component: Login },
  { path: 'perfil', component: Perfil },

  // Login del admin (sin protección ni sidebar)
  { path: 'admin/login', component: AdminLoginComponent },

  // Layout admin con sidebar fijo: envuelve todas las pantallas protegidas
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: 'home', component: HomeADM },
      { path: 'citas', component: AdminCitasComponent },
      { path: 'pacientes', component: AdminPacientesComponent },
      { path: 'recursos', component: AdminRecursosComponent },
      { path: 'servicios', component: AdminServiciosComponent },
      { path: 'mensajes', component: AdminMensajesComponent },
    ]
  },
];
