import {Component, OnInit, Input, Output, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy, EventEmitter} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import * as countries from '../../../countries.json';
import {PaymentService} from '../../services/payment.service';
import {StripeService} from '../../services/stripe.service';

declare var stripe: any;
declare var elements: any;
declare var fbq: any;

@Component({
  selector: 'app-newcheckout',
  templateUrl: './newcheckout.component.html',
  styleUrls: ['./newcheckout.component.scss']
})
export class NewcheckoutComponent implements OnInit, OnDestroy {

  @Input() params: any;
  @Output() sending = new EventEmitter<any>();

  @ViewChild('cardElement') cardElement: ElementRef;
  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;

  public loading: boolean;
  public isLoggedIn: boolean;

  public type: string;
  public amount: number;
  public isGift: boolean;
  public userSendsGiftThemselves: boolean;
  public giftEmail: string;
  public giftName: string;
  public campaign: string;

  public countries;

  public email: string;
  public emailFromUser: boolean;
  public firstName: string;
  public firstNameFromUser: boolean;
  public lastName: string;
  public lastNameFromUser: boolean;
  public country: string;
  public countryFromUser: boolean;
  public password: string;
  public repeat_password: string;
  public paymentOption: string;
  public creditCardName: string;

  public serverError: string;

  public isSubscribedToNewsletter: boolean;
  public newsletter: boolean;

  constructor(private auth: AuthService,
              private user: UserService,
              private router: Router,
              private payment: PaymentService,
              private changeDetectorRef: ChangeDetectorRef,
              private stripeService: StripeService) {
    this.countries = (countries as any).countries;
    this.isLoggedIn = auth.isLoggedIn;

    if (this.isLoggedIn) {
      this.updateUserInfo();
    }
  }

  ngOnInit() {
    this.isGift = this.params.pay_type === 'gift';
    if (this.isGift) {
      this.type = 'onetime';
    } else {
      this.type = 'subscription';
    }
    this.amount = this.params.value;
    this.userSendsGiftThemselves = true;
    this.paymentOption = 'creditcard';
    fbq('track', 'InitiateCheckout');
    this.stripeService
      .loadStripe()
      .then(() => {
        this.card = elements.create('card');
        this.card.mount(this.cardElement.nativeElement);
        this.card.addEventListener('change', this.cardHandler);
      })
      .catch(err => {
        console.log(err);
      });
  }

  onChange({error}) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.changeDetectorRef.detectChanges();
  }

  async updateUserInfo() {
    const userinfo = await this.user.getUserInfo();
    if (typeof userinfo.email !== 'undefined') {
      this.email = userinfo.email;
      this.emailFromUser = true;
    } else {
      this.emailFromUser = false;
    }
    if (typeof userinfo.firstName !== 'undefined') {
      this.firstName = userinfo.firstName;
      this.firstNameFromUser = true;
    } else {
      this.firstNameFromUser = false;
    }
    if (typeof userinfo.lastName !== 'undefined') {
      this.lastName = userinfo.lastName;
      this.lastNameFromUser = true;
    } else {
      this.lastNameFromUser = false;
    }
    if (typeof userinfo.country !== 'undefined') {
      this.country = userinfo.country;
      this.countryFromUser = true;
    } else {
      this.country = '';
      this.countryFromUser = false;
    }
    if (typeof userinfo.userHasNewsletter !== 'undefined') {
      this.isSubscribedToNewsletter = userinfo.userHasNewsletter;
    } else {
      this.isSubscribedToNewsletter = false;
    }
  }

  public async createUserAndLogin() {
    try {
      const newsletter = this.newsletter ? this.newsletter : undefined;
      await this.auth.register(
        this.email,
        this.password,
        newsletter,
        this.firstName,
        this.lastName,
        this.country
      );
      this.isLoggedIn = true;
      await this.updateUserInfo();
    } catch (err) {
      this.serverError = this.getErrorMessage(err);
      this.loading = false;
      return;
    }
  }

  private getErrorMessage(err) {
    let error = err;
    if (typeof error === 'undefined') {
      return 'Unknown Error';
    }
    if (typeof error === 'string') {
      return error;
    }
    if (err.error) {
      error = err.error;
    }
    if (typeof error.message === 'string') {
      return error.message;
    }
    return 'Unknown Error';
  }

  private async doPayment() {
    try {
      if (this.paymentOption === 'creditcard') {
        const {token, error} = await stripe.createToken(this.card, {
          name: this.creditCardName
        });
        if (error) {
          throw error;
        }
        if (this.type === 'subscription') {
          await this.payment.subscribeWithStripe(
            this.email,
            this.amount,
            token.id,
            undefined,
            this.isGift
              ? {
                userSendsGiftThemselves: this.userSendsGiftThemselves,
                email: this.userSendsGiftThemselves
                  ? undefined
                  : this.giftEmail,
                name: this.giftName
              }
              : undefined
          );
          this.checkoutDone();
        } else if (this.type === 'onetime') {
          await this.payment.oneTimeWithStripe(
            this.email,
            this.amount,
            token.id,
            undefined,
            this.isGift
              ? {
                userSendsGiftThemselves: this.userSendsGiftThemselves,
                email: this.userSendsGiftThemselves
                  ? undefined
                  : this.giftEmail,
                name: this.giftName
              }
              : undefined
          );
          this.checkoutDone();
        }
      }
    } catch (err) {
      this.serverError = this.getErrorMessage(err);
      this.loading = false;
      return;
    }
  }

  checkoutDone() {
    fbq('track', 'Purchase');
    this.sending.emit({
      payment: this.type,
      amount: this.amount,
      isGift: this.isGift
    });
  }

  public checkMissingFields() {
    let missing_flag = true;
    if (typeof this.email === 'undefined' || this.email === '' || !this.isValid(this.email)) {
      this.serverError = 'E-Mail Address is invalid';
      missing_flag = false;
    }
    if (typeof this.firstName === 'undefined' || this.firstName === '') {
      this.serverError = 'First Name is undefined';
      missing_flag = false;
    }
    if (typeof this.lastName === 'undefined' || this.lastName === '') {
      this.serverError = 'Last Name is undefined';
      missing_flag = false;
    }
    if (typeof this.country === 'undefined' || this.country === '') {
      this.serverError = 'Country is undefined';
      missing_flag = false;
    }
    if (!this.isLoggedIn && !this.password) {
      this.serverError = 'You did not login';
      missing_flag = false;
    }
    return missing_flag;
  }

  public async updateUserInfoIfDataChanged() {
    try {
      const firstNameUpdate = this.firstName;
      const lastNameUpdate = this.lastName;
      const countryUpdate = this.country;
      const newsletter = this.isSubscribedToNewsletter;
      await this.user.updateUser(firstNameUpdate, lastNameUpdate, countryUpdate, newsletter);
    } catch (err) {
      this.serverError = this.getErrorMessage(err);
      this.loading = false;
      return;
    }
  }

  public async purchase() {
    this.serverError = '';
    this.error = '';

    if (this.checkMissingFields()) {
      this.loading = true;
      if (!this.isLoggedIn) {
        await this.createUserAndLogin();
      } else {
        await this.updateUserInfoIfDataChanged();
      }
      if (this.serverError !== '') {
        return;
      }
      await this.doPayment();
      this.loading = false;
    }
  }

  public isValid(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  ngOnDestroy() {
    if (this.card) {
      this.card.removeEventListener('change', this.cardHandler);
      this.card.destroy();
    }
  }
}
