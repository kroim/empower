import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root"
})
export class OrderService {
  private url: string = environment.baseUrl;

  constructor(private http: HttpClient, private auth: AuthService) {}

  public async getAllOrders() {
    let headers = this.getAuthHeaders();
    return await this.http.get(this.url + "/order", { headers }).toPromise();
  }

  public async getTotalAmountForUser() {
    let headers = this.getAuthHeaders();
    const paymentsForUserResponse = await this.http
      .get(this.url + "/order/payments", { headers })
      .toPromise();
    return paymentsForUserResponse;
  }

  public async getUserImpact() {
    try {
      let headers = this.getAuthHeaders();
      return await this.http
        .get(
          this.url + "/order/payments/impact",
          { headers }
        )
        .toPromise();
    } catch (err) {
      this.handleError(err);
    }
  }

  public async redeemGift(redeemCode) {
    let headers = this.getAuthHeaders();
    try {
      const response = await this.http
        .post(
          this.url + "/order/gift/redeem",
          {
            redeemCode
          },
          { headers }
        )
        .toPromise();
      return response;
    } catch (err) {
      this.handleError(err);
    }
  }

  public async downloadGiftCard(id) {
    let headers = this.getAuthHeaders();

    try {
      const response = await this.http
        .get(this.url + "/order/" + id + "/giftcard", { headers })
        .toPromise();
      return this.url + "/order" + (response as any).url;
    } catch (err) {
      this.handleError(err);
    }
  }

  public getAuthHeaders() {
    return new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("authorization", "Bearer " + this.auth.token);
  }

  private handleError(err) {
    if (err.error && err.error.message) {
      throw err.error.message;
    } else {
      throw err.message;
    }
  }
}
