import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericRestClientService } from '../services/generic-rest-client.service';
import { User } from '../../../app/types';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService extends GenericRestClientService<User> {



  constructor(httpClient: HttpClient) {
    super(httpClient, '/rest-auth/user')
   }

  getItem(
    urlParams: { [key: string]: string | number} = {},
    httpOptions?: { [key: string]: any}
  ): Observable<User> {
    return super.getItem(urlParams, httpOptions).pipe(
      tap(user => {
        const userProfile = {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username
        }
      })
    )
  }
}
