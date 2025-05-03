import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: "login",
    loadComponent: async () => {
      const m = await import('./login/login.component');
      return m.LoginComponent;
    },
  }
];
