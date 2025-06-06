import {Component, inject} from '@angular/core';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

import {NavbarComponent} from '../../shared/components/navbar/navbar.component';
import {SidebarComponent} from '../../shared/components/sidebar/sidebar.component';
import {CalendarWeekComponent} from '../../shared/components/calendar-types/calendar-week/calendar-week.component';
import {CalendarFivedaysComponent} from '../../shared/components/calendar-types/calendar-fivedays/calendar-fivedays.component';

import {CalendarDisplayView} from '../../shared/types/calendar-types';
import {CalendarsService} from '../../core/services/calendars.service';
import {Tables} from '../../../supabase_generated/database.types';
import {Task} from '../../shared/types/task-types';
import {CalendarDayComponent} from '../../shared/components/calendar-types/calendar-day/calendar-day.component';

@Component({
  selector: 'app-calendar-week-layout',
  imports: [NavbarComponent, SidebarComponent, MatProgressSpinner, CalendarWeekComponent, CalendarFivedaysComponent, CalendarDayComponent],
  templateUrl: './calendar-layout.component.html',
  styleUrl: './calendar-layout.component.less'
})
export class CalendarLayoutComponent {
  sidebarOpen: boolean = false;

  focusDay!: Date;
  calendarView: CalendarDisplayView = CalendarDisplayView.WEEK;
  calendarEvents: Tables<"Events">[] | null = null;
  calendarService: CalendarsService = inject(CalendarsService)

  tasks: Task[] = [
    {id: 0, title: "Flo Gefurtstag", info: "Test", color: "green", type: "app", fromDate: new Date(2025, 4, 23, 13, 30), toDate: new Date(2025, 4, 23, 16, 30)},
  ];

  constructor() {
    this.loadEvents();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  calendarViewChanged(calendarView: CalendarDisplayView) {
    this.calendarView = calendarView;
  }

  loadEvents() {
    // Simulate an API call to load events
    this.calendarService.getCalendars().then(calendars => {
      this.calendarService.getCalendarsEvents(calendars.map(calendar => calendar.id))
        .then(events => {
          this.calendarEvents = events;
        })
    })
  }

  protected readonly CalendarDisplayView = CalendarDisplayView;
}
