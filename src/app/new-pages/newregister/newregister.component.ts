import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newregister',
  templateUrl: './newregister.component.html',
  styleUrls: ['./newregister.component.scss']
})
export class NewregisterComponent implements OnInit {

  public email: string;
  public password: string;
  public repeat_password: string;
  public error: string;
  public newsletter: boolean;

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.email = '';
    this.password = '';
    this.repeat_password = '';
    this.error = '';
    this.newsletter = false;
  }

  public async new_register() {
    if (this.email === '' || this.password === '') {
      this.error = 'Empty email or password';
      setTimeout(() => {
        this.error = '';
      }, 3000);
    } else if (this.password.length < 8) {
      this.error = 'Passwords length should be at least 8';
      setTimeout(() => {
        this.error = '';
      }, 3000);
    } else if (this.password !== this.repeat_password) {
      this.error = 'Confirm password does not matched with password';
      setTimeout(() => {
        this.error = '';
      }, 3000);
    } else {
      try {
        const authInfo = await this.auth.register(this.email, this.password, this.newsletter);
        console.log(authInfo);
      } catch (err) {
        this.error = err;
      }
    }
  }
}
