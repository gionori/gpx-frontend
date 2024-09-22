
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';


import { Person } from '@core/interfaces';
import { PersonsService } from '@services/persons.service';
import { create } from '@notifications/index';
import { ModalAdapter } from '@common/adapters';



@Component({
  selector: 'app-form-person',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './form-person.component.html',
  styles: ''
})
export class FormPersonComponent implements OnInit, OnDestroy {

  public form: FormGroup = new FormGroup({});
  public isLoading$$ = signal<boolean>(false);
  public person$$ = signal<Person>({ name: '', paternal: '', maternal: '', phone: '', address: '' });

  private readonly _formBuilder = inject(FormBuilder);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _personsService = inject(PersonsService);
  private readonly _router = inject(Router);
  private readonly _store = inject(Store);
  private _id: number | null = null;
  private subscriptionGet$ = new Subscription();
  private subscriptionAction$ = new Subscription();


  constructor() {
    this._id = Number(this._activatedRoute.snapshot.params['id']);
  }


  ngOnDestroy(): void {
    this.subscriptionGet$.unsubscribe();
    this.subscriptionAction$.unsubscribe();
  }


  ngOnInit(): void {
    this.form = this._formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(200)]],
      paternal: [null, [Validators.required, Validators.maxLength(200)]],
      maternal: [null, [Validators.required, Validators.maxLength(200)]],
      address: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });

    if (this._id) {
      this.isLoading$$.set(true);
      this.subscriptionGet$ = this._personsService.getPerson(this._id)
        .subscribe({
          next: resp => {
            this.isLoading$$.set(false);
            if (resp.errors) {
              return this._handleError(resp.errors);
            }

            if (resp.data.isDeleted) {
              return this._handleError({});
            }

            this.person$$.set({ ...resp.data, id: this._id });
            this.form.get('name')?.setValue(this.person$$()?.name);
            this.form.get('paternal')?.setValue(this.person$$()?.paternal);
            this.form.get('maternal')?.setValue(this.person$$()?.maternal);
            this.form.get('address')?.setValue(this.person$$()?.address);
            this.form.get('phone')?.setValue(this.person$$()?.phone);
          },

          error: err => {
            this.isLoading$$.set(false);
            this._handleError(err);
          }
        });
    }
  }


  handleSubmit(): void {
    this.person$$.set({
      id: this._id,
      name: this.form.get('name')?.value,
      paternal: this.form.get('paternal')?.value,
      maternal: this.form.get('maternal')?.value,
      address: this.form.get('address')?.value,
      phone: this.form.get('phone')?.value,
    });    

    const action = this._id ?
      this._personsService.updatePerson(this.person$$()) :
      this._personsService.createPerson(this.person$$());

    this.isLoading$$.set(true);
    this.form.disable();
    this.subscriptionAction$ = action?.subscribe({
      next: resp => {
        this.isLoading$$.set(false);
        if (resp.errors) {
          this.form.enable();
          return this._handleError(resp.errors);
        }

        this._store.dispatch(create({
          notification: {        
            id: crypto.randomUUID(),
            text: `Persona ${ this.person$$().name } ${ this.person$$().name } ${ this.person$$().maternal } ${ this._id ? 'actualizado' : 'creado' }`,
            title: `${ this.person$$().name } ${ this._id ? 'actualizado' : 'creado' }`,
            isReaded: false
          }
        }));

        this._router.navigate(['/']);
      },

      error: err => {
        this.form.enable();
        this.isLoading$$.set(false);
        this._handleError(err);
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
