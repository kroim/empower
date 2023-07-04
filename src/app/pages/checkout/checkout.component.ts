import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";
import * as countries from "../../../countries.json";
import { PaymentService } from "../../services/payment.service";
import "angular2-navigate-with-data";
import { StripeService } from "../../services/stripe.service";
import * as Raven from "raven-js";

declare var stripe: any;
declare var elements: any;
declare var fbq: any;

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"]
})
export class CheckoutComponent implements OnInit, OnDestroy {
  @ViewChild("cardElement") cardElement: ElementRef;
  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;

  public loading: boolean = false;
  public isLoggedIn: boolean = false;

  public type: string;
  public amount: number;
  public isGift: boolean = false;
  public userSendsGiftThemselves: boolean = true;
  public giftEmail: string;
  public giftName: string;
  public campaign: string;

  public missingFields = [];

  public countries;

  public email: string;
  public emailFromUser: boolean = false;
  public firstName: string;
  public firstNameFromUser: boolean = false;
  public lastName: string;
  public lastNameFromUser: boolean = false;
  public country: string = "";
  public countryFromUser: boolean = false;
  public password: string;
  public paymentOption: string;
  public creditCardName: string;

  public serverError: string;

  public isSubscribedToNewsletter: boolean = false;
  public newsletter: boolean = false;

  constructor(
    private auth: AuthService,
    private user: UserService,
    private router: Router,
    private payment: PaymentService,
    private changeDetectorRef: ChangeDetectorRef,
    private stripeService: StripeService
  ) {
    this.countries = (countries as any).countries;
    this.isLoggedIn = auth.isLoggedIn;

    if (this.isLoggedIn) {
      this.updateUserInfo();
    }
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.card) {
      this.card.removeEventListener("change", this.cardHandler);
      this.card.destroy();
    }
  }

  async updateUserInfo() {
    const userinfo = await this.user.getUserInfo();

    if (typeof userinfo.email !== "undefined") {
      this.email = userinfo.email;
      this.emailFromUser = true;
    }
    if (typeof userinfo.firstName !== "undefined") {
      this.firstName = userinfo.firstName;
      this.firstNameFromUser = true;
    }
    if (typeof userinfo.lastName !== "undefined") {
      this.lastName = userinfo.lastName;
      this.lastNameFromUser = true;
    }
    if (typeof userinfo.country !== "undefined") {
      this.country = userinfo.country;
      this.countryFromUser = true;
    }
    if (typeof userinfo.userHasNewsletter !== "undefined") {
      this.isSubscribedToNewsletter = userinfo.userHasNewsletter;
    }
  }

  ngOnInit(): void {
    const navigatedData = this.router.getNavigatedData();
    this.dataChanged(navigatedData);
    window.scrollTo(0, 0);
    fbq('track', 'InitiateCheckout');
  }

  choose(paymentOption) {
    this.paymentOption = paymentOption;

    if (paymentOption === "creditcard" && typeof this.card === "undefined") {
      this.stripeService
        .loadStripe()
        .then(() => {
          this.card = elements.create("card");
          this.card.mount(this.cardElement.nativeElement);
          this.card.addEventListener("change", this.cardHandler);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  public checkMissingFields() {
    this.missingFields = [];

    if (typeof this.email === "undefined" || this.email === "") {
      this.missingFields.push("E-Mail");
    } else if (!this.isValid(this.email)) {
      this.missingFields.push("E-Mail Address is invalid");
    }
    if (typeof this.firstName === "undefined" || this.firstName === "") {
      this.missingFields.push("First Name");
    }
    if (typeof this.lastName === "undefined" || this.lastName === "") {
      this.missingFields.push("Last Name");
    }
    if (typeof this.country === "undefined" || this.country === "") {
      this.missingFields.push("Country");
    }
    if (!this.isLoggedIn && !this.password) {
      this.missingFields.push("Password");
    }
    if (
      typeof this.paymentOption === "undefined" ||
      this.paymentOption === ""
    ) {
      this.missingFields.push("Payment Option");
    }
    if (
      this.paymentOption === "creditcard" &&
      (typeof this.creditCardName === "undefined" || this.creditCardName === "")
    ) {
      this.missingFields.push("Credit Card Full Name");
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
      Raven.captureException(err);
      this.serverError = `While creating user: ${this.getErrorMessage(err)}`;
      this.loading = false;
      return;
    }
  }

  public async updateUserInfoIfDataChanged() {
    try {
      const firstNameUpdate = !this.firstNameFromUser
        ? this.firstName
        : undefined;
      const lastNameUpdate = !this.lastNameFromUser ? this.lastName : undefined;
      const countryUpdate = !this.countryFromUser ? this.country : undefined;
      const newsletter = this.newsletter ? this.newsletter : undefined;
      if (firstNameUpdate || lastNameUpdate || countryUpdate || newsletter) {
        await this.user.updateUser(
          firstNameUpdate,
          lastNameUpdate,
          countryUpdate,
          newsletter
        );
      }
    } catch (err) {
      Raven.captureException(err);
      this.serverError = `While updating user info: ${this.getErrorMessage(err)}`;
      this.loading = false;
      return;
    }
  }

  private async doPayment() {
    try {
      if (this.paymentOption === "coingate") {
        const redirect = await this.payment.oneTimeWithCoingate(
          this.email,
          this.amount,
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
        if (redirect) window.location.href = redirect;
        return;
      } else if (this.paymentOption === "paypal") {
        if (this.type === "subscription") {
          const redirect = await this.payment.subscribeWithPayPal(
            this.email,
            this.amount,
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
          if (redirect) window.location.href = redirect;
          return;
        } else if (this.type === "onetime") {
          const redirect = await this.payment.oneTimeWithPayPal(
            this.email,
            this.amount,
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
          if (redirect) window.location.href = redirect;
          return;
        }
      } else if (this.paymentOption === "creditcard") {
        const { token, error } = await stripe.createToken(this.card, {
          name: this.creditCardName
        });
        if (error) {
          throw error;
        }
        if (this.type === "subscription") {
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
          let queryParams = {};
          this.checkoutDone();
        } else if (this.type === "onetime") {
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
      Raven.captureException(err);
      this.serverError = `While creating payment: ${this.getErrorMessage(err)}`;
      this.loading = false;
      return;
    }
  }

  private getErrorMessage(err) {
    let error = err;
    if (typeof error === "undefined") {
      return "Unknown Error";
    }
    if (typeof error === "string") {
      return error;
    }
    if (err.error) {
      error = err.error;
    }
    if (typeof error.message === "string") {
      return error.message;
    }

    return "Unknown Error";
  }

  checkoutDone() {
    fbq("track", "Purchase");
    let queryParams = {};
    if (this.isGift) {
      (queryParams as any).isGift = this.isGift;
    }
    if (this.type === "onetime") {
      (queryParams as any).oneTime = this.amount;
    }
    this.router.navigate(["checkout-done"], { queryParams });
  }

  public async purchase() {
    this.serverError = null;
    this.error = "";

    this.checkMissingFields();

    if (this.missingFields.length === 0) {
      this.loading = true;

      if (!this.isLoggedIn) {
        await this.createUserAndLogin();
      } else {
        await this.updateUserInfoIfDataChanged();
      }

      if (this.serverError) return;

      await this.doPayment();

      this.loading = false;
    }
  }

  public isValid(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  dataChanged(data) {
    if (typeof data !== "undefined") {
      if (typeof data.type !== "undefined") {
        this.type = data.type;
      }
      if (typeof data.amount !== "undefined") {
        this.amount = data.amount;
      }
      if (typeof data.isGift !== "undefined") {
        this.isGift = data.isGift ? true : false;
      }
      if (typeof data.campaign !== "undefined") {
        this.campaign = data.campaign;
      }
    }
    window.scrollTo(0, 0);
  }

  productHasBeenSelected() {
    return (
      typeof this.type !== "undefined" && typeof this.amount !== "undefined"
    );
  }

  getProduct() {
    let text;
    if (this.type === "subscription") {
      text = "Empower Monthly Sponsorship"
      if (this.isGift) {
        text += " Gift"
      }
    } else if (this.type === "onetime") {
      if (this.campaign === "christmas") {
        text = "Christmas Gift Card - "

        if (this.amount === 30) {
          text+= "6 Months Plastic Positive"
        } else if (this.amount === 60) {
          text+= "12 Months Plastic Positive"
        } else {
          text += this.amount + " kg of plastic removed";
        }
      } else {
        text = "Empower One-Time Sponsorship";

        if (this.isGift) {
          text += " Gift"
        }
      }
    }

    return {
      text
    };
  }

  getTotal() {
    return {
      amount: this.amount,
      currency: "$"
    };
  }

  logIn() {
    this.router.navigateByData({
      url: ["login"],
      data: {
        url: ["checkout"],
        type: this.type,
        amount: this.amount,
        isGift: this.isGift,
        campaign: this.campaign
      }
    });
  }

  increaseAmount() {
    this.amount++;
  }

  decreaseAmount() {
    if (this.amount > 1) {
      this.amount--;
    }
  }
}
