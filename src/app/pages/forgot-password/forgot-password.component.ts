import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  public email: string = '';
  public error: string = "";
  public success: boolean = false;

  constructor(private user: UserService) { }

  

  async resetPassword() {
    this.error = "";
    try {
      await this.user.resetPassword(this.email);
      this.success = true;
    } catch (err) {
      this.error = err;
    }
  }

}
