import { Routes } from '@angular/router';

import { CalendarLayoutComponent } from './layouts/calendar-layout/calendar-layout.component';
import { LoginComponent } from './shared/components/login/login.component';
import { ContactsLayoutComponent } from './layouts/contacts-layout/contacts-layout.component';
import { ContactsShareLayoutComponent} from './layouts/contacts-share-layout/contacts-share-layout.component';

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
  {
    path: "contact-sharing",
    loadComponent: () => {
      return ContactsShareLayoutComponent;
    }
  },
  // For developing purposes only.
  {
    path: "**",
    redirectTo: "calendar"
  }
];
