import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericRestClientService } from '../services/generic-rest-client.service';
import { User } from '../../../app/types';

@Injectable({
  providedIn: 'root'
})
export class UserService extends GenericRestClientService<User> {

  constructor(httpClient: HttpClient) {
    super(httpClient, '/api/users')
   }
}
