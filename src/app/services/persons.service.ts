import { inject, Injectable } from '@angular/core';

import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { Person } from '@core/interfaces';


@Injectable({
  providedIn: 'root'
})
export class PersonsService {
  

  private readonly _apollo = inject(Apollo);


  getPersons(query: string = '', pagination: any): Observable<any> {
    return this._apollo.watchQuery({
      query: gql`
        query GetPersons($query: String, $pagination: Pagination) {
          getPersons(query: $query, pagination: $pagination) {
            persons {
              id
              name
              paternal
              maternal
              address
              phone
              isDeleted
            }
            count
          }
        }
      `,
      variables: { query: query, pagination: pagination },
      fetchPolicy: 'network-only'
    })
    .valueChanges
    .pipe(
      map((resp: any) => ({ ...resp, data: resp.data?.getPersons as Person[] }))
    );
  }


  getPerson(id: number) {
    return this._apollo.watchQuery({
      query: gql`
        query GetPerson($getPersonId: ID) {
          getPerson(id: $getPersonId) {
            id
            name
            paternal
            maternal
            address
            phone
            isDeleted
          }
        }
      `,
      variables: { getPersonId: id }
    })
    .valueChanges
    .pipe(
      map((resp: any) => ({ ...resp, data: resp.data?.getPerson as Person }))
    );
  }


  removePerson(id: number | undefined) {
    return this._apollo.mutate({
      mutation: gql`
        mutation Mutation($removePersonId: ID) {
          removePerson(id: $removePersonId) {    
            isDeleted
          }
        }
      `,
      variables: { removePersonId: id },
      errorPolicy: 'all'
    })    
    .pipe(
      map((resp: any) => ({ ...resp, data: resp.data?.removePerson as Person }))
    );
  }


  createPerson(person: Person) {
    return this._apollo.mutate({
      mutation: gql`
        mutation CreatePerson($name: String, $paternal: String, $maternal: String, $address: String, $phone: String) {
          createPerson(name: $name, paternal: $paternal, maternal: $maternal, address: $address, phone: $phone) {
            id
            name
            paternal
            maternal
            address
            phone
            isDeleted
          }
        }
      `,
      variables: { ...person },
      errorPolicy: 'all'
    })    
    .pipe(
      map((resp: any) => ({
        ...resp, 
        errors: resp.errors?.map((err: any) => err.message.replace('\n', '<br>')),
        data: resp.data?.createPerson as Person 
      }))
    );
  }


  updatePerson(person: Person) {
    return this._apollo.mutate({
      mutation: gql`
        mutation UpdatePerson($name: String, $paternal: String, $maternal: String, $address: String, $phone: String, $id: ID) {
          updatePerson(name: $name, paternal: $paternal, maternal: $maternal, address: $address, phone: $phone, id: $id) {
            id
            name
            paternal
            maternal
            address
            phone
            isDeleted
          }
        }
      `,
      variables: { ...person },
      errorPolicy: 'all'
    })    
    .pipe(
      map((resp: any) => ({ 
        ...resp, 
        errors: resp.errors?.map((err: any) => err.message.replace('\n', '<br>')),
        data: resp.data?.updatePerson as Person 
      }))
    );
  }

}
