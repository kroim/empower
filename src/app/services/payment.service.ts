import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class PaymentService {
  private url: string = environment.baseUrl;

  constructor(private http: HttpClient, private auth: AuthService) {}

  public async oneTimeWithCoingate(email, amount, referenceCode?, gift?) {
    let headers = this.getAuthHeaders();
    try {
      const response = await this.http
        .post(
          this.url + "/order/onetime/coingate",
          {
            email,
            amount,
            referenceCode,
            gift
          },
          { headers }
        )
        .toPromise();
      return (response as any).redirect;
    } catch (err) {
      this.handleError(err);
    }
  }

  public async oneTimeWithPayPal(email, amount, referenceCode?, gift?) {
    let headers = this.getAuthHeaders();
    try {
      const response = await this.http
        .post(
          this.url + "/order/onetime/paypal",
          {
            email,
            amount,
            referenceCode,
            gift
          },
          { headers }
        )
        .toPromise();
      return (response as any).redirect;
    } catch (err) {
      this.handleError(err);
    }
  }

  public async exectuePaypalOnetime(paymentId, payerId) {
    let headers = this.getAuthHeaders();
    try {
      return await this.http
        .post(
          this.url + "/order/onetime/paypal/execute",
          {
            paymentId,
            payerId
          },
          { headers }
        )
        .toPromise();
    } catch (err) {
      this.handleError(err);
    }
  }

  public async oneTimeWithStripe(email, amount, token, referenceCode?, gift?) {
    let headers = this.getAuthHeaders();
    try {
      return await this.http
        .post(
          this.url + "/order/onetime/stripe",
          {
            email,
            amount,
            token,
            referenceCode,
            gift
          },
          { headers }
        )
        .toPromise();
    } catch (err) {
      this.handleError(err);
    }
  }

  public async subscribeWithPayPal(email, amount, referenceCode?, gift?) {
    let headers = this.getAuthHeaders();
    try {
      const response = await this.http
        .post(
          this.url + "/order/recurring/paypal",
          {
            email,
            amount,
            referenceCode,
            gift
          },
          { headers }
        )
        .toPromise();
      return (response as any).redirect;
    } catch (err) {
      this.handleError(err);
    }
  }

  public async exectuePaypalSubscription(token) {
    let headers = this.getAuthHeaders();
    try {
      return await this.http
        .post(
          this.url + "/order/recurring/paypal/execute",
          {
            token
          },
          { headers }
        )
        .toPromise();
    } catch (err) {
      this.handleError(err);
    }
  }

  public async subscribeWithStripe(email, amount, token, referenceCode?, gift?) {
    let headers = this.getAuthHeaders();
    try {
      return await this.http
        .post(
          this.url + "/order/recurring/stripe",
          {
            email,
            amount,
            token,
            referenceCode,
            gift
          },
          { headers }
        )
        .toPromise();
    } catch (err) {
      this.handleError(err);
    }
  }

  private handleError(err) {
    if (err.error && err.error.message) {
      throw err.error.message;
    } else {
      throw err.message;
    }
  }

  public getAuthHeaders() {
    return new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("authorization", "Bearer " + this.auth.token);
  }
}
