import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../../types';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  API_URL = 'http://localhost:8000';

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  login(username: string, email: string, password: string) {
    return this.httpClient.post<any>(`${this.API_URL}/rest-auth/login/`, { username, email, password})
    .pipe(map(token => {
      return token['key'];
    }))
  }
}
