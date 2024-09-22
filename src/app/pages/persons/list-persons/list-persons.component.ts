import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, AfterViewInit, OnInit , signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';



import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Store } from '@ngrx/store';


import { PersonsService } from '@services/persons.service';
import { Person } from '@core/interfaces';
import { ModalAdapter } from '@common/adapters';
import { create } from '@notifications/index';


@Component({
  selector: 'app-list-persons',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatTableModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  templateUrl: './list-persons.component.html',
  styleUrl: './list-persons.component.scss'
})
export class ListPersonsComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public persons$$ = signal<Person[]>([]);
  public displayedColumns: string[] = ['name', 'paternal', 'maternal', 'address', 'phone', 'actions'];
  public isLoading$$ = signal<boolean>(false);
  public count$$ = signal<number>(0);
  public form: FormGroup = new FormGroup({});
  public pageSize: number = 10;

  private readonly _personsService = inject(PersonsService);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _store = inject(Store);
  private subscriptionSearch$ = new Subscription();
  private subscriptionRemove$ = new Subscription();


  ngOnInit(): void {
    this.form = this._formBuilder.group({ search: '' });        
  }


  ngAfterViewInit(): void {
    this.search();
  }


  ngOnDestroy(): void {
    this.subscriptionSearch$.unsubscribe();
    this.subscriptionRemove$.unsubscribe();
  }


  handleRemove(person: Person): void {    
    ModalAdapter.ShowConfirmDialog({
      title: 'Atención',
      message: `¿Deseas eliminar a ${ person.name }?`
    }, {
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    })
    .then(({ isConfirmed }) => {
      if (!isConfirmed) return;

      this.isLoading$$.set(true);
      this.subscriptionRemove$ = this._personsService.removePerson(person.id)
        .subscribe({
          next: resp => {
            if (resp.data && resp.data.isDeleted) {
              this.paginator.pageIndex = 0;

              this._store.dispatch(create({
                  notification: {        
                    id: crypto.randomUUID(),
                    text: `Persona ${ person.name } ${ person.name } ${ person.maternal } ha sido eliminada del sistema`,
                    title: `${ person.name } eliminado`,
                    isReaded: false
                  }
                }));
  
              return this.search();
            }
            
            this.isLoading$$.set(false);
            this._handleError(resp.errors);
          },
          error: err => {
            this.isLoading$$.set(false);
            this._handleError(err);
          }
        });
    });
  }


  handleSubmit(): void {
    this.paginator.pageIndex = 0;
    this.search();
  }


  set filter(search: string) {
    this.form.get('search')?.setValue(search);
  }


  get filter(): string {
    return this.form.get('search')?.value;
  }
  

  search(): void {
    this.isLoading$$.set(true);
    const query: string = this.form.get('search').value;

    this.subscriptionSearch$ = this._personsService.getPersons(query, { 
      count: 10, 
      offset: this.paginator.pageIndex * this.pageSize
    })
      .subscribe({
        next: (resp: any) => {
          this.isLoading$$.set(false);

          if (resp.data) {
            const { persons, count } = resp.data;  
            this.count$$.set(count);          
            this.persons$$.set(persons);
            return;
          }

          this._handleError(resp.errors);
        },
        error: err => {
          this._handleError(err);
          this.isLoading$$.set(false);
        }
      });
  }


  private _handleError(err: any): void {
    ModalAdapter.ShowSimpleMessage({
      title: 'Lo sentimos, ha ocurrido un error',
      message: err.toString(),
    });
  }


}
