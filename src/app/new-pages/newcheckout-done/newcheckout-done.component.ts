import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-newcheckout-done',
  templateUrl: './newcheckout-done.component.html',
  styleUrls: ['./newcheckout-done.component.scss']
})
export class NewcheckoutDoneComponent implements OnInit {

  @Input() sending_params: any;

  public shareText: string;

  payment: string;
  amount: number;
  isGift: boolean;

  constructor(private order: OrderService,
              private auth: AuthService) { }

  ngOnInit() {
    this.payment = this.sending_params.payment;
    this.amount = this.sending_params.amount;
    this.isGift = this.sending_params.isGift;
    if (this.auth.isLoggedIn) {
      this.order.getTotalAmountForUser().then(res => {
        const yearlyRate = (res as any).rate * 60 * 60 * 24 * 30 * 12;
        this.shareText =
            'I\'m funding clean-up of more than ' +
            yearlyRate.toFixed(0) +
            ' kgs of plastic waste every year!\n' +
            'Join me and make an impact with www.empower.eco\n';
      });
    }
  }

}
