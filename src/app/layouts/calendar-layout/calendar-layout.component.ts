import {Component, inject} from '@angular/core';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

import {NavbarComponent} from '../../shared/components/navbar/navbar.component';
import {SidebarComponent} from '../../shared/components/sidebar/sidebar.component';
import {CalendarWeekComponent} from '../../shared/components/calendar-types/calendar-week/calendar-week.component';

import {CalendarDisplayView} from '../../shared/types/calendar-types';
import {Tables} from '../../../supabase_generated/database.types';
import {CalendarsService} from '../../core/services/calendars.service';
import {
  CalendarFivedaysComponent
} from '../../shared/components/calendar-types/calendar-fivedays/calendar-fivedays.component';

@Component({
  selector: 'app-calendar-week-layout',
  imports: [NavbarComponent, SidebarComponent, MatProgressSpinner, CalendarWeekComponent, CalendarFivedaysComponent],
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
