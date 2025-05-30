import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {Subscription} from 'rxjs';

import {TaskBlockComponent} from '../task-block/task-block.component';
import {CalendarDisplayView} from '../../types/calendar-types';
import {Task} from '../../types/task-types';
import {CalendarService} from '../../services/calendar.service';

@Component({
  selector: 'app-calendar',
  imports: [TaskBlockComponent, MatTableModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.less'
})
export class CalendarComponent implements OnInit, OnDestroy {
  private sub!: Subscription;

  private hours_in_milli = 60 * 60 * 1000;

  @Input() calendarType: CalendarDisplayView = CalendarDisplayView.WEEK;
  @Input() calendarStart: Date = this.getMonday();

  days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  offsets = Array.from(this.days, (_, i) => i);
  hours = Array.from({length: 24}, (_, i) => i);

  tasks: Task[] = [
    {id: 0, title: "Flo Gefurtstag", info: "Test", color: "green", type: "app", fromDate: new Date(2025, 4, 23, 13, 30), toDate: new Date(2025, 4, 23, 16, 30)},
  ];

  constructor(private calendarService: CalendarService) {
    console.log(this.calendarStart);
  }

  ngOnInit(): void {
    this.sub = this.calendarService.calendarSwitchAction$.subscribe(action => {
      switch (action) {
        case "next":
          this.goRelative(1);
          break;
        case "previous":
          this.goRelative(-1);
          break;
        case "today":
          this.gotoToday();
          break;
      }

      this.triggerTimeRangeUpdateAction();
    });

    this.triggerTimeRangeUpdateAction();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getTasksFor(day_offset: number, hour: number, debug = false): Task[] {
    const timeStart: Date = new Date(this.calendarStart.getTime() + (day_offset * 24 + hour) * this.hours_in_milli);
    const timeEnd: Date = new Date(timeStart.getTime() + this.hours_in_milli);

    if (debug) {
      console.log(timeStart);
      console.log(timeEnd);
      console.log(this.tasks.filter(v => {
        return (v.fromDate && v.toDate) && (v.fromDate >= timeStart && v.fromDate < timeEnd);
      }));
    }

    return this.tasks.filter(v => {
      return (v.fromDate && v.toDate) && (v.fromDate >= timeStart && v.fromDate < timeEnd);
    });
  }

  private goRelative(amount: number): void {
    let deltaDays: number = 0;

    switch (this.calendarType) {
      case CalendarDisplayView.DAY:
        deltaDays = amount;
        break;
      case CalendarDisplayView.WEEK:
        deltaDays = 7 * amount;
        break;
      case CalendarDisplayView.MONTH:
        throw new Error("Not implemented yet. (Month)");
        break;
      case  CalendarDisplayView.YEAR:
        throw new Error("Not implemented yet. (Year)");
        break;
    }

    this.calendarStart.setDate(this.calendarStart.getDate() + deltaDays);
  }

  private gotoToday(): void {
    //TODO
  }

  private getMonday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Setze Uhrzeit auf Mitternacht

    const dayOfWeek = today.getDay(); // 0 = Sonntag, 1 = Montag, ..., 6 = Samstag
    const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    today.setDate(today.getDate() + offset);
    return today;
  }

  private triggerTimeRangeUpdateAction(): void {
    const start = this.calendarStart.toLocaleDateString();
    const end = new Date(this.calendarStart.getTime() + 6 * 24 * this.hours_in_milli).toLocaleDateString(); //TODO: Wenn nicht Wochenansicht, Konstante ändern

    this.calendarService.triggerTimeRangeAction(start + " - " + end);
  }
}
