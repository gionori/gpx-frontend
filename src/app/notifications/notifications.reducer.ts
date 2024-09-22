import { createReducer, on } from '@ngrx/store';
import { create, read } from '@notifications/notification.actions';
import { Notification } from '@core/interfaces';


export const initialState: Notification[] = [];

export const notificationsReducer = createReducer(
    initialState,

    on(create, (state: Notification[], { notification }) => [ ...state, notification ]),

    on(read, (state: Notification[], { id }) => state.map(notification => ({ 
        ...notification, 
        isReaded: notification.id === id ? true : notification.isReaded
    }))),
);
