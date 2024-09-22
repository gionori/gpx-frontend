import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';


import { Store } from '@ngrx/store';


import { Notification } from '@core/interfaces';
import { read } from '@notifications/index';
import { Subscription } from 'rxjs';
import { ModalAdapter } from '@common/adapters';


@Component({
  selector: 'gpx-menu',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
  ],
  templateUrl: './menu.component.html',
  styles: ''
})
export class MenuComponent implements OnDestroy {

  public notifications$$ = signal<Notification[]>([]);

  private readonly _store = inject(Store); // TODO: Tipar
  private notificationsSubscription$ = new Subscription();


  constructor() {
    this.notificationsSubscription$ = this._store.select('notifications')
    .subscribe({
        next: (notifications) => this.notifications$$.set(notifications)
      });
  }


  handleRead(notification: Notification) {
    ModalAdapter.ShowSimpleMessage({
      title: notification.title,
      message: notification.text
    });
    
    this._store.dispatch(read({ id: notification.id }));
  }


  ngOnDestroy(): void {
    this.notificationsSubscription$.unsubscribe();
  }


  get pendingToRead(): number {
    return this.notifications$$()
      .filter(notification => !notification.isReaded)
      .length;
  }

}
