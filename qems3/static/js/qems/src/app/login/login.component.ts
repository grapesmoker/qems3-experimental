import { Component, OnInit } from '@angular/core';
import { LoginService } from '../core/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit() { }

  username: string;
  email: string;
  password: string;

  login() {
    this.loginService.login(this.username, this.email, this.password)
    .subscribe(user => console.log(user));
  }
}
