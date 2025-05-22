import {Component, inject} from '@angular/core';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

import {NavbarComponent} from '../../shared/components/navbar/navbar.component';
import {SidebarComponent} from '../../shared/components/sidebar/sidebar.component';
import {CalendarComponent} from '../../shared/components/calendar/calendar.component';

import {CalendarDisplayView} from '../../shared/types/calendar-types';
import {Tables} from '../../../supabase_generated/database.types';
import {CalendarsService} from '../../core/services/calendars.service';

@Component({
  selector: 'app-calendar-layout',
  imports: [NavbarComponent, SidebarComponent, MatProgressSpinner, CalendarComponent],
  templateUrl: './calendar-layout.component.html',
  styleUrl: './calendar-layout.component.less'
})
export class CalendarLayoutComponent {
  sidebarOpen: boolean = false;

  focusDay: Date = new Date();
  calendarView: CalendarDisplayView = CalendarDisplayView.WEEK;
  calendarEvents: Tables<"Events">[] | null = null;
  calendarService: CalendarsService = inject(CalendarsService)

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
}
