import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';


import { MenuComponent } from '@common/components';


@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [
    RouterModule,
    MenuComponent,
  ],
  templateUrl: './pages.component.html',
  styles: ''
})
export class PagesComponent {

  


}
