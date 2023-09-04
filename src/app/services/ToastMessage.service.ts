import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastMessage {
  constructor(public toastController: ToastController) {}

  async presentToast(taskName: string) {
    const toast = await this.toastController.create({
      header: 'Atenção!!',
      message: `Chegou a data para realizar sua tarefa: ${taskName}`,
      position: 'top',
      duration: 3000,
    });
    toast.present();
  }
}