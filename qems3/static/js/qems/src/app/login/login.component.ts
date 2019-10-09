import { Component, OnInit } from '@angular/core';
import { LoginService } from '../core/services/login.service';
import { Router } from '@angular/router';
import { UserService } from '../core/services/user.service'
import { AuthInterceptor } from '../core/interceptors/auth-interceptor';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errorText: string = '';
  username: string;
  email: string;
  password: string;

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() { }

  login() {
    this.loginService.login(this.username, this.email, this.password)
    .subscribe(token => {
      console.log(`obtained token: `);
      console.log(token);
      localStorage.setItem('token', token);
      this.userService.getItem().subscribe(
        profile => {
          console.log(profile);
        }
      )
    });
  }
}
