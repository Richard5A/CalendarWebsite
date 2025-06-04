import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {TaskBlockComponent} from '../../task-block/task-block.component';
import {Task} from '../../../types/task-types';
import {CalendarService} from '../../../services/calendar.service';

@Component({
  selector: 'app-calendar-fivedays',
  imports: [TaskBlockComponent],
  templateUrl: './calendar-fivedays.component.html',
  styleUrl: './calendar-fivedays.component.less'
})
export class CalendarFivedaysComponent implements OnInit, OnDestroy{
  private sub!: Subscription;

  private DAYS_SHOWN = 5;
  private hours_in_milli = 60 * 60 * 1000;

  @Input() calendarStart: Date = this.getToday();

  days = this.getWeekDays();
  offsets = Array.from(this.days, (_, i) => i);
  hours = Array.from({length: 24}, (_, i) => i);

  tasks: Task[] = [
    {id: 0, title: "Flo Gefurtstag", info: "Test", color: "green", type: "app", fromDate: new Date(2025, 4, 23, 13, 30), toDate: new Date(2025, 4, 23, 16, 30)},
  ];

  constructor(private calendarService: CalendarService) {}

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
      this.days = this.getWeekDays();
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
    let deltaDays: number = this.DAYS_SHOWN * amount;

    this.calendarStart.setDate(this.calendarStart.getDate() + deltaDays);
  }

  private gotoToday(): void {
    //TODO
  }

  private getToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Setze Uhrzeit auf Mitternacht
    return today;
  }

  private getWeekDays(): string[] {
    const weekdays: string[] = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    const result: string[] = [];
    const date = new Date(this.calendarStart);

    for (let i = 0; i < this.DAYS_SHOWN; i++) {
      result.push(weekdays[date.getDay()]);
      date.setDate(date.getDate() + 1);
    }

    return result;
  }

  private triggerTimeRangeUpdateAction(): void {
    const start = this.calendarStart.toLocaleDateString();
    const end = new Date(this.calendarStart.getTime() + (this.DAYS_SHOWN - 1) * 24 * this.hours_in_milli).toLocaleDateString();

    this.calendarService.triggerTimeRangeAction(start + " - " + end);
  }
}
