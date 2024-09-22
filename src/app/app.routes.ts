import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/pages.component').then(c => c.PagesComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/persons/list-persons/list-persons.component').then(c => c.ListPersonsComponent)
            },
            {
                path: 'form',
                loadComponent: () => import('./pages/persons/form-person/form-person.component').then(c => c.FormPersonComponent)
            },
            {
                path: 'form/:id',
                loadComponent: () => import('./pages/persons/form-person/form-person.component').then(c => c.FormPersonComponent)
            }
        ]
    }
];
