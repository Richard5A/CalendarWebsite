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

  @Input() type: CalendarDisplayView = CalendarDisplayView.WEEK;
  @Input() calendarStart: Date = new Date();

  days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  hours = Array.from({length: 24}, (_, i) => i);

  private tasks: Task[] = [
    {id: 0, title: "Flo Gefurtstag", info: "Test", color: "green", type: "app", fromDate: new Date(2025, 3, 29, 13), toDate: new Date(2025, 3, 29, 14)},
  ];

  constructor(private calendarService: CalendarService) {}

  ngOnInit(): void {
    this.sub = this.calendarService.action$.subscribe(action => {
      switch (action) {
        case "next":
          this.goRelative(1);
          break;
        case "previous":
          this.goRelative(-1);
          break;
        case "today":
          this.today();
          break;
      }
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getTasksFor(day: string, hour: number): Task[] {
    //TODO: Richtigen Tag & Zeit nehmen
    return this.tasks.filter(v => {
      return v.fromDate?.getHours() === hour && v.fromDate?.getDay() === this.days.indexOf(day);
    });
  }

  private goRelative(amount: number): void {
    let deltaDays: number = 0;

    switch (this.type) {
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
        throw new Error("Not implemented yet. (YEAR)");
        break;
    }

    this.calendarStart.setDate(this.calendarStart.getDate() + deltaDays);
  }

  private today(): void {

  }
}
