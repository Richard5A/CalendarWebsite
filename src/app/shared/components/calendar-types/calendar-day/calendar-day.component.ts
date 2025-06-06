import {Component, Input, OnInit, OnDestroy, model, effect} from '@angular/core';
import {Subscription} from 'rxjs';

import {TaskBlockComponent} from '../../task-block/task-block.component';
import {Task} from '../../../types/task-types';
import {CalendarService} from '../../../services/calendar.service';

// See calendar-fivedays.component.ts for more information about this code.
@Component({
  selector: 'app-calendar-day',
  imports: [TaskBlockComponent],
  templateUrl: './calendar-day.component.html',
  styleUrl: './calendar-day.component.less'
})
export class CalendarDayComponent implements OnInit, OnDestroy {
  private sub!: Subscription;

  private DAYS_SHOWN = 1;
  private hours_in_milli = 60 * 60 * 1000;

  @Input() tasks: Task[] = [];
  calendarDate = model<Date>();
  private calendarStart: Date = this.getToday();

  day_displayed: string = "";
  hours: number[] = Array.from({length: 24}, (_, i) => i);

  constructor(private calendarService: CalendarService) {
    effect(() => {
      const dateFromParent = this.calendarDate();
      if (dateFromParent) {
        if (!this.calendarStart || this.calendarStart.getTime() !== dateFromParent.getTime()) {
          this.calendarStart = new Date(dateFromParent.getTime());
          this.updateViewAndNotifyParent();
        }
      }
    });
  }

  ngOnInit(): void {
    const initialDateFromParent = this.calendarDate();

    if (initialDateFromParent) {
      this.calendarStart.setTime(initialDateFromParent.getTime());
    } else {
      this.calendarDate.set(new Date(this.calendarStart.getTime()));
    }

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
    });

    this.updateViewAndNotifyParent();
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  getTasksFor(hour: number, debug = false): Task[] {
    const timeStart: Date = new Date(this.calendarStart.getTime() + hour * this.hours_in_milli);
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

  private updateViewAndNotifyParent(): void {
    if (this.calendarStart) {
      const currentDateModel = this.calendarDate();
      if (!currentDateModel || currentDateModel.getTime() !== this.calendarStart.getTime()) {
        this.calendarDate.set(new Date(this.calendarStart.getTime()));
      }
    }
    const weekdays: string[] = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

    this.day_displayed = weekdays[this.calendarStart.getDay()];
    console.log(this.day_displayed);
    this.triggerTimeRangeUpdateAction();
  }

  private goRelative(amount: number): void {
    const deltaDays: number = this.DAYS_SHOWN * amount;

    const newDate = new Date(this.calendarStart.getTime());
    newDate.setDate(newDate.getDate() + deltaDays);
    this.calendarStart = newDate;
    this.updateViewAndNotifyParent();
  }

  private gotoToday(): void {
    this.calendarStart = this.getToday();
    this.updateViewAndNotifyParent();
  }

  private getToday(): Date {
    const day: Date = new Date();
    day.setHours(0, 0, 0, 0); // Setze Uhrzeit auf Mitternacht

    const dayOfWeek = day.getDay(); // 0 = Sonntag, 1 = Montag, ..., 6 = Samstag
    const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    day.setDate(day.getDate() + offset);
    return day;
  }

  private triggerTimeRangeUpdateAction(): void {
    if (!this.calendarStart) return;

    const day = this.calendarStart.toLocaleDateString();

    this.calendarService.triggerTimeRangeAction(day);
  }
}
