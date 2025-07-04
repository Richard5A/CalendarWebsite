import { Routes } from '@angular/router';

import { CalendarLayoutComponent } from './layouts/calendar-layout/calendar-layout.component';
import { LoginComponent } from './shared/components/login/login.component';
import { ContactsLayoutComponent } from './layouts/contacts-layout/contacts-layout.component';
import {TasksLayoutComponent} from './layouts/tasks-layout/tasks-layout.component';

export const routes: Routes = [
  {
    path: "calendar",
    component: CalendarLayoutComponent
  },
  {
    path: "tasks",
    component: TasksLayoutComponent
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
