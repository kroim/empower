import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-newforgotpassword',
  templateUrl: './newforgotpassword.component.html',
  styleUrls: ['./newforgotpassword.component.scss']
})
export class NewforgotpasswordComponent implements OnInit {

  public email: string;
  public error: string;
  public success: string;

  constructor(private user: UserService) { }

  ngOnInit() {
    this.email = '';
    this.success = '';
    this.error = '';
  }

  public async new_forgot() {
    if (this.email === '') {
      this.error = 'Empty email';
      setTimeout(() => {
        this.error = '';
      }, 3000);
    } else {
      try {
        const authInfo = await this.user.resetPassword(this.email);
        this.success = 'Reset password has been sent to your Email';
      } catch (err) {
        this.error = err;
        setTimeout(() => {
          this.error = '';
        }, 3000);
      }
    }
  }
}
