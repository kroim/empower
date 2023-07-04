import { Injectable } from "@angular/core";
import { BaseService } from "../../services/serviceBase";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "../../services/auth.service";
import * as StellarSdk from "stellar-sdk";

declare const StellarSdk: any;

@Injectable({
  providedIn: "root"
})
export class AdminService extends BaseService {
  constructor(protected http: HttpClient, protected auth: AuthService) {
    super(http, auth);
  }

  public async makeUserAmbassador(email) {
    console.log("Make user ambassador");
    try {
      let headers = this.getAuthHeaders();

      return await this.http
        .post(
          this.url + "/user/ambassador",
          {
            email
          },
          { headers }
        )
        .toPromise();
    } catch (err) {
      console.log(err);
      this.handleError(err);
    }
  }

  public async addWasteStation(publicKey, location, dailyLimitation, email, description) {
    try {
      let headers = this.getAuthHeaders();

      return await this.http
        .post(
          this.url + "/crypto/addWasteStation",
          {
            wasteStation: {
              publicKey,
              location,
              dailyLimitation,
              email,
              description
            }
          },
          { headers }
        )
        .toPromise();
    } catch (err) {
      console.log(err);
      this.handleError(err);
    }
  }

  public async removeWasteStation(publicKey) {
    try {
      let headers = this.getAuthHeaders();

      return await this.http
        .post(
          this.url + "/crypto/removeWasteStation",
          {
            wasteStation: {
              publicKey
            }
          },
          { headers }
        )
        .toPromise();
    } catch (err) {
      console.log(err);
      this.handleError(err);
    }
  }

  public async updateCrypto() {
    try {
      let headers = this.getAuthHeaders();

      return await this.http
        .post(this.url + "/crypto/update", {}, { headers })
        .toPromise();
    } catch (err) {
      console.log(err);
      this.handleError(err);
    }
  }

  public async addPlasticWaste(email, password, privateKey, amount) {
    const loginResponse = await this.http
      .post(this.url + "/login", {
        username: email,
        password
      })
      .toPromise();
    const token = (loginResponse as any).token;

    const signer = StellarSdk.Keypair.fromSecret(privateKey);
    const data = signer.publicKey() + ":" + amount + ":" + new Date().getTime();
    const signature = signer.sign(data).toString("base64");

    const deliverResponse = await this.http.post(
      this.url + "/crypto/deliverWaste",
      {
        signature,
        data,
        signer: signer.publicKey()
      },
      {
        headers: new HttpHeaders()
          .set("Content-Type", "application/json")
          .set("authorization", "Bearer " + token)
      }
    ).toPromise();
    console.log(deliverResponse);
  }
}
