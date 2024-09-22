import { createAction, props } from '@ngrx/store';

import { Notification } from '@core/interfaces';

export const create = createAction('[Notification Component] Create', props<{ notification: Notification }>());
export const read   = createAction('[Notification Component] Read', props<{ id: string }>());