import { Injectable } from '@angular/core';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationsService {
  constructor(private localNotifications: LocalNotifications) {}

  createNotification(id: string, date: string) {
    this.localNotifications.requestPermission().then(granted => {
      if(granted) {
        this.localNotifications.schedule({
          id: Number(id),
          title: 'Lembrete de tarefa',
          text: 'Chegou o prazo final para realizar sua tarefa!',
          trigger: { at: new Date(date) },
          foreground: true,
          vibrate: true
        });
      }
    });
  }
  
  updateNotification(id: string, date: string) {
    this.localNotifications.update({
      id: Number(id),
      trigger: { at: new Date(date) }
    })
  }
}
