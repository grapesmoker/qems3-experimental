import { Component, OnInit } from '@angular/core';
import { LoginService } from '../core/services/login.service';
import { Router } from '@angular/router';
import { UserService } from '../core/services/user.service'

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.sass']
})

export class RegistrationComponent implements OnInit {

  errorText: string = '';
  username: string;
  email: string;
  password1: string;
  password2: string;

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() { }

  register() {
    this.loginService.register(this.username, this.email, this.password1, this.password2)
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
