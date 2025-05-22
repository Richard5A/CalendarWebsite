import {Component, Input, OnInit} from '@angular/core';

import {Task} from '../../types/task-types';

@Component({
  selector: 'app-task-block',
  imports: [],
  templateUrl: './task-block.component.html',
  styleUrl: './task-block.component.less'
})
export class TaskBlockComponent implements OnInit {
  @Input() task!: Task;

  timeStart: string | undefined;
  timeEnd: string | undefined;


  ngOnInit() {
    if (this.task.fromDate && this.task.toDate) {
      this.timeStart = this.task.fromDate.toLocaleTimeString().slice(0, 5);
      this.timeEnd = this.task.toDate.toLocaleTimeString().slice(0, 5);
    }
  }
}
