import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

import {CalendarDisplayType, CalendarDisplayViewList, ViewType} from '../../types/calendar-types';
import {CalendarService} from '../../services/calendar.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSelectModule, MatButtonToggleModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.less'
})
export class NavbarComponent implements OnInit, OnDestroy {
  private sub!: Subscription;

  @Output() toggleSidebar = new EventEmitter<undefined>();
  @Output() calendarViewChanged = new EventEmitter<CalendarDisplayType>();
  @Output() viewSelection = new EventEmitter<ViewType>();
  protected readonly CalendarDisplayViewList = CalendarDisplayViewList;

  timespanText: string = "";

  constructor(private calendarService: CalendarService) {}

  ngOnInit(): void {
    this.sub = this.calendarService.timeRangeAction$.subscribe((action: string) => {
      this.timespanText = action;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onNext() {
    this.calendarService.triggerCalendarSwitchAction("next");
  }

  onPrevious() {
    this.calendarService.triggerCalendarSwitchAction("previous");
  }

  onViewChange(view: "calendar" | "tasks" | "contacts") {
    let viewType: ViewType;
    switch (view) {
      case "calendar":
        viewType = ViewType.CALENDAR;
        break;
      case "tasks":
        viewType = ViewType.TASKS;
        break;
      case "contacts":
        viewType = ViewType.CONTACTS;
        break;
    }
   this.viewSelection.emit(viewType);
  }

  //TODO: Zurückspringen zu heute
}
