import { Component, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.less'
})
export class SidebarComponent {
  @Input() toggleSidebar: EventEmitter<undefined> = new EventEmitter();

  constructor() {
    setInterval(() => {
      this.toggleSidebar.subscribe({next: () => console.log("hi")})
    }, 1000)
  }
}
