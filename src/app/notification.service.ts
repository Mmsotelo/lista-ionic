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
          title: 'My first notification',
          text: 'Thats pretty easy...',
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
