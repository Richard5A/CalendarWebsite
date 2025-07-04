import { Component } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {TaskComponent} from '../../shared/components/task/task.component';

@Component({
  selector: 'app-tasks-layout',
  imports: [
    MatToolbarModule,
    MatButtonToggle,
    MatButtonToggleGroup,
    TaskComponent
  ],
  templateUrl: './tasks-layout.component.html',
  styleUrl: './tasks-layout.component.less'
})
export class TasksLayoutComponent {
  onViewChange(view: "calendar" | "tasks" | "contacts") {
    console.log(view);
  }
}
