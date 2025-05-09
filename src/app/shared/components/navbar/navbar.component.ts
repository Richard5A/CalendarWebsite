import { Component, EventEmitter, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSelectModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.less'
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<undefined>();

  options: any[] = [
    {value: "day", label: "Tag"},
    {value: "week", label: "Woche"},
    {value: "month", label: "Monat"},
    {value: "year", label: "Jahr"},
  ];
}
