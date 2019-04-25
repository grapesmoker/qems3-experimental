import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  API_URL = 'http://localhost:8000';

  constructor(private httpClient: HttpClient) { }

  login(username: string, password: string) {
    return this.httpClient.post<any>(`${this.API_URL}/rest-auth/login/`, { username, password})
    .pipe(map(user => {
      console.log(user);

      return user;
    }))
  }
}
