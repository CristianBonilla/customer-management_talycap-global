import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'clientes', pathMatch: 'full' },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./features/clientes/pages/buscar-cliente/buscar-cliente.component')
            .then(m => m.BuscarClienteComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
