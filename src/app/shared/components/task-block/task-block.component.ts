import {Component, Input} from '@angular/core';

import {Task} from '../../types/task-types';

@Component({
  selector: 'app-task-block',
  imports: [],
  templateUrl: './task-block.component.html',
  styleUrl: './task-block.component.less'
})
export class TaskBlockComponent {
  @Input() task!: Task;
}
