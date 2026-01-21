import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
//import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)
  },
  {
    path: 'productos',
    loadComponent: () => import('./pages/productos/productos').then(m => m.Productos)
  },
  {
    path: 'producto/:id/detalle-producto-espumasyplasticos',
    loadComponent: () => import('./components/descripcion-productos/descripcion/descripcion').then(m => m.Descripcion)
  },
  {
    path: 'nosotros',
    loadComponent: () => import('./pages/nosotros/nosotros').then(m => m.Nosotros)
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contacto/contacto').then(m => m.Contacto)
  },
  {
    path: 'politica',
    loadComponent: () => import('./components/politica/politica').then(m => m.Politica)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/dashboard/dashboard-admin/dashboard-admin').then(m => m.DashboardAdmin),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/dashboard-view/dashboard-view').then(m => m.Dashboard)
      },
      {
        path: 'categorias',
        loadComponent: () => import('./pages/dashboard/categorias/categorias').then(m => m.Categorias)
      },
      {
        path: 'subcategorias',
        loadComponent: () => import('./pages/dashboard/subcategorias/subcategorias').then(m => m.Subcategorias)
      },
      {
        path: 'productos',
        loadComponent: () => import('./pages/dashboard/productos-page/productos-page').then(m => m.ProductosAdmin)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

