import { Component } from '@angular/core';

import { NavbarComponent } from './../../shared/components/navbar/navbar.component';
import { SidebarComponent } from './../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-calendar-layout',
  imports: [NavbarComponent, SidebarComponent],
  templateUrl: './calendar-layout.component.html',
  styleUrl: './calendar-layout.component.less'
})
export class CalendarLayoutComponent {
  sidebarOpen: boolean = true;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
