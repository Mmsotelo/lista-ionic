import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Task } from '../task';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../services/TaskStorage.service';
import { ToastMessage } from '../services/ToastMessage.service';
import { TaskCardComponent } from '../task-card/task-card.component';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, ReactiveFormsModule, TaskCardComponent]
})
export class HomePage {
  
  constructor(private router: Router) {
    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd) {
        if (event.url === "/home") {
          await this.refreshList("pending");
        }
      }
    })
  }

  taskList: Task[] = [];
  showPending = true;
  presentAlert = false;
  presentAlertDelete = false;
  taskId = "";

  taskService: TaskService = inject(TaskService);
  toastService: ToastMessage = inject(ToastMessage);


  async ngOnInit() {
    await this.refreshList("pending");
    this.checkDueDate();
    console.log('ae')
  }


  createNewTask() {
    this.router.navigate(['task-form']);
  }
  
  async deleteItem(id: string) {
    this.taskId = id;
    this.presentAlertDelete = true;
  }

  async refreshList(filterStatus: string) {
    const taskList =  await this.taskService.getAll();
    if (filterStatus === "finished") {
      this.taskList = taskList.filter(element => element.finished);
    } else if (filterStatus === "pending") {
      this.taskList = taskList.filter(element => !element.finished);
    }
  }

  async toggleTaskList(showPending: boolean) {
    if (!showPending) {
      await this.refreshList("finished");
      this.showPending = false;
    } else {
      await this.refreshList("pending");
      this.showPending = true;
    }
  }

  async clearList(){
    this.presentAlert = true;
  }

  async checkDueDate() {
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const taskPendingList =  (await this.taskService.getAll()).filter(item => !item.finished);
    taskPendingList.forEach(task => {
      const taskDay = new Date(task.dueDate).getDate();
      const taskMonth = new Date(task.dueDate).getMonth();
      const taskYear = new Date(task.dueDate).getFullYear();
      if(currentDay === taskDay && currentMonth === taskMonth && currentYear === taskYear) {
        this.toastService.presentToast(task.name);
      }
    })
  }

  public alertButtons = [
    {
      text: 'Limpar tudo',
      role: 'confirm',
      handler: async () => {
        await this.taskService.clearAllTasks();
        this.refreshList('pending');
        this.showPending = true;
      },
    },
    {
      text: 'Cancelar',
      role: 'cancel'
    },
  ];
  public alertButtonsDelete = [
    {
      text: 'Deletar',
      role: 'confirm',
      handler: async () => {
        this.taskService.deleteTaskByID(this.taskId).then(async() => {
          this.refreshList("pending");
          this.showPending = true;
        })
        this.refreshList('pending');
        this.taskId = "";
      },
    },
    {
      text: 'Cancelar',
      role: 'cancel'
    },
  ];
}
