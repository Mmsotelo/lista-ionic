import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Task } from '../task';
import { TaskService } from '../services/TaskStorage.service';
import { Router } from "@angular/router";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class TaskCardComponent  implements OnInit {
  taskService: TaskService = inject(TaskService);
  
  ngOnInit() {}

  constructor(private router: Router) {}

  @Input() task!: Task;
  @Output() editItemEvent = new EventEmitter<Task>();
  @Output() removeItemEvent = new EventEmitter<string>();
  @Output() callRefreshEvent = new EventEmitter<string>();

  editItem(task: Task) {
    this.router.navigate(['task-form', { id: task.id }]);
    this.editItemEvent.emit(task);
  }

  removeItem(id: string) {
    this.removeItemEvent.emit(id)
  }

  async updateState(id: string) {
    const taskToUpdate = await this.taskService.getTaskByID(id);
    await this.taskService.editTask(id, {
      id: id,
      name: taskToUpdate.name,
      finished: !taskToUpdate.finished,
      dueDate: taskToUpdate.dueDate,
    }).then(async() => {
      if (taskToUpdate.finished) {
        this.callRefreshEvent.emit("finished");
      } else {
        this.callRefreshEvent.emit("pending");
      }
    });
  }

}
