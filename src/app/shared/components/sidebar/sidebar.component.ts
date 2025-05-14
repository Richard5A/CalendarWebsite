import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-sidebar',
  imports: [MatSidenavModule, MatButtonModule, MatIconModule, MatExpansionModule, MatCheckboxModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.less'
})
export class SidebarComponent {
  @Input() sidebarOpen: boolean = true;

  calendars = [{
    id: 1,
    selected: true,
    title: "Kalender 1",
    color: "red"
  },
  {
    id: 2,
    selected: true,
    title: "Feiertage",
    color: "green"
  },
  {
    id: 69,
    selected: false,
    title: "Geburtstage",
    color: "red"
  }]
}
