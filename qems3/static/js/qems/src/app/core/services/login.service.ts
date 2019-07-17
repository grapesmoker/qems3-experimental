import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  API_URL = 'http://localhost:8000';

  constructor(private httpClient: HttpClient) { }

  login(username: string, email: string, password: string) {
    return this.httpClient.post<any>(`${this.API_URL}/rest-auth/login/`, { username, email, password})
    .pipe(map(user => {
      console.log(user);

      return user;
    }))
  }

  register(username: string, email: string, password1: string, password2: string) {
    if (password1 !== password2) {
      return new Observable<string>("Passwords don't match");
    } else {
      return this.httpClient.post<any>(`${this.API_URL}/rest-auth/register`,  {'username': username, 'email': email, 'password': password1})
      .pipe(map(user => {
        console.log(user);
        return user;
      }))
    }
  }
}
