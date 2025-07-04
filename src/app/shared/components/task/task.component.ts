import { Component } from '@angular/core';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-task',
  imports: [
    MatIcon
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.less'
})
export class TaskComponent {
  description: string = "a";
}
