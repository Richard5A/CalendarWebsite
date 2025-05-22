import {Component, EventEmitter, Output} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

import {CalendarDisplayView, CalendarDisplayViewList} from '../../types/calendar-types';
import {CalendarService} from '../../services/calendar.service';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSelectModule, MatButtonToggleModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.less'
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<undefined>();
  @Output() calendarViewChanged = new EventEmitter<CalendarDisplayView>();
  protected readonly CalendarDisplayViewList = CalendarDisplayViewList;

  constructor(private calendarService: CalendarService) {}

  onNext() {
    this.calendarService.triggerAction("next");
  }

  onPrevious() {
    this.calendarService.triggerAction("previous");
  }

  //TODO: Zurückspringen zu heute
}
