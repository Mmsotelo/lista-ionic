import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TaskService } from '../services/TaskStorage.service';
import { Task } from '../task';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  standalone: true,
  imports: [ IonicModule, FormsModule, CommonModule, ReactiveFormsModule]
})
export class TaskFormComponent  implements OnInit {
  task!: Task;
  editing = false;
  title = "Criar nova";

  taskForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(''),
    finished: new FormControl(false),
    dueDate: new FormControl(new Date().toISOString()),
  });

  taskService: TaskService = inject(TaskService);
  constructor(private route: ActivatedRoute, private router: Router) { }

  async ngOnInit() {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.editing = true;
      this.task = await this.taskService.getTaskByID(taskId);
      this.editItem(this.task);
      this.title = "Editar";
    }
  }

  backToHome() {
    this.router.navigate(["home"]);
  }

  async addItem() {
    const generatedId = Date.now().toString();
    this.taskService.createTask(generatedId, {
      id: generatedId,
      name: this.taskForm.value.name,
      finished: this.taskForm.value.finished,
      dueDate: this.taskForm.value.dueDate,
    }).then(async() => {
      this.resetForm();
      this.backToHome();
    })
  }

  async editItem(task: Task) {
    this.editing = true;
    this.taskForm.get("id")?.setValue(task.id);
    this.taskForm.get("name")?.setValue(task.name);
    this.taskForm.get("finished")?.setValue(task.finished);
    this.taskForm.get("dueDate")?.setValue(task.dueDate);
  }

  async saveItem() {
    const id = this.taskForm.value.id as string;
    await this.taskService.editTask(id, {
      id: id,
      name: this.taskForm.value.name,
      finished: this.taskForm.value.finished,
      dueDate: this.taskForm.value.dueDate,
    }).then(async() => {
      this.editing = false;
      this.resetForm();
      this.backToHome();
    });
  }

  resetForm() {
    this.taskForm.get("id")?.setValue("");
    this.taskForm.get("name")?.setValue("");
    this.taskForm.get("finished")?.setValue(false);
    this.taskForm.get("dueDate")?.setValue(new Date().toISOString());
    this.title = "Criar nova";
  }

  cancelEdit() {
    this.resetForm();
    this.editing = false;
    this.backToHome();
  }
}
