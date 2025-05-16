import { Routes } from '@angular/router';

import { CalendarLayoutComponent } from './layouts/calendar-layout/calendar-layout.component';
import { LoginComponent } from './login/login.component';
import { ContactsComponent } from './contacts/contacts.component';

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
      return ContactsComponent;
    }
  },
  // For developing purposes only.
  {
    path: "**",
    redirectTo: "calendar"
  }
];
