import {Component, inject, signal, WritableSignal} from '@angular/core';

import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { CalendarDisplayView } from './enums/calendar-display-view';
import {Tables} from '../../../supabase_generated/database.types';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {CalendarsService} from '../../core/services/calendars.service';

@Component({
  selector: 'app-calendar-layout',
  imports: [NavbarComponent, SidebarComponent, MatProgressSpinner],
  templateUrl: './calendar-layout.component.html',
  styleUrl: './calendar-layout.component.less'
})
export class CalendarLayoutComponent {
  sidebarOpen: boolean = false;
  focusDay: Date = new Date();
  calendarView: WritableSignal<CalendarDisplayView> = signal(CalendarDisplayView.WEEK);
  calendarEvents: WritableSignal<Tables<"Events">[] | null> = signal(null);
  calendarService: CalendarsService = inject(CalendarsService)

  constructor() {
    this.loadEvents();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  calendarViewChanged(calendarView: CalendarDisplayView) {
    this.calendarView.set(calendarView)

  }

  loadEvents() {
    // Simulate an API call to load events
    this.calendarService.getCalendars().then(calendars => {
      this.calendarService.getCalendarsEvents(calendars.map(calendar => calendar.id))
        .then(events => {
        this.calendarEvents.set(events);
      })
    })
  }
}
