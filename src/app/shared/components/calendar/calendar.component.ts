import {Component, Input} from '@angular/core';
import {MatTableModule} from '@angular/material/table';

import {TaskBlockComponent} from '../task-block/task-block.component';
import {CalendarDisplayView} from '../../types/calendar-display-view';
import {Task} from '../../types/task-types';

@Component({
  selector: 'app-calendar',
  imports: [TaskBlockComponent, MatTableModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.less'
})
export class CalendarComponent {
  @Input() type: CalendarDisplayView = CalendarDisplayView.WEEK;

  days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  hours = Array.from({length: 24}, (_, i) => i);

  private tasks: Task[] = [
    {id: 0, title: "Flo Gefurtstag", type: "app", fromDate: new Date(2025, 3, 29, 13), toDate: new Date(2025, 3, 29, 14)},
  ];

  getTasksFor(day: string, hour: number): Task[] {
    //TODO: Richtigen Tag & Zeit nehmen
    return this.tasks.filter(v => {
      return v.fromDate?.getHours() === hour && v.fromDate?.getDay() === this.days.indexOf(day);
    });
  }
}
