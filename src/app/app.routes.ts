import { Routes } from '@angular/router';

import { CalendarLayoutComponent } from './layouts/calendar-layout/calendar-layout.component';
import { LoginComponent } from './shared/components/login/login.component';
import { ContactsLayoutComponent } from './layouts/contacts-layout/contacts-layout.component';

export const routes: Routes = [
  {
    path: "calendar",
    component: CalendarLayoutComponent
  },
  {
    path: "login",
    loadComponent: () => {
      return LoginComponent;
    },
  },
  {
    path: "contacts",
    loadComponent: () => {
      return ContactsLayoutComponent;
    }
  },
  // For developing purposes only.
  {
    path: "**",
    redirectTo: "calendar"
  }
];
