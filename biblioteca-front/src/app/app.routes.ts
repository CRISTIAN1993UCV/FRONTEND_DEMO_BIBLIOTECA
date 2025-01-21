import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path:'dashboard',
    loadComponent: () => import('./biblioteca-crud/dashboard.component'),
    children:[
      {
        path:'autor',
        title:'autor',
        loadComponent: () => import('./biblioteca-crud/pages/autor-page/autor-page.component')
      },
      {
        path:'libro',
        title:'libro',
        loadComponent: () => import('./biblioteca-crud/pages/libro-page/libro-page.component')
      },

      {
        path:'prestamo',
        title:'prestamo',
        loadComponent: () => import('./biblioteca-crud/pages/prestamo-page/prestamo-page.component')
      },
      {
        path:'',
        redirectTo: 'autor',
        pathMatch:'full'
      }
    ]
  },
    {
      path:'**',
      redirectTo: 'dashboard',
      pathMatch: 'full'
    }
];
