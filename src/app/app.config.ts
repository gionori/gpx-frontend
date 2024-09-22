import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';


import { environment } from '../environments/environment.development';
import { provideState, provideStore } from '@ngrx/store';


import { notificationsReducer } from '@notifications/index';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideAnimationsAsync(), 
    provideHttpClient(), 
    provideApollo(() => {
        const httpLink = inject(HttpLink);
        return {
            link: httpLink.create({
                uri: `${environment.endpoint}/graphql`,
            }),
            cache: new InMemoryCache(),
        };
    }), 
    provideStore(),
    provideState({ name: 'notifications', reducer: notificationsReducer })
]
};
