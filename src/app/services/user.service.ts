import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Ambassador } from "../pages/my-page/ambassador";

@Injectable({
  providedIn: "root"
})
export class UserService {
  private url: string = environment.baseUrl;

  constructor(private http: HttpClient, private auth: AuthService) {}

  public async getUserInfo(): Promise<any> {
    try {
      let headers = this.getAuthHeaders();

      return await this.http.get(this.url + "/user", { headers }).toPromise();
    } catch (err) {
      this.handleError(err);
    }
  }

  public async updateUser(
    firstName?: string,
    lastName?: string,
    country?: string,
    newsletter?: boolean
  ) {
    try {
      let headers = this.getAuthHeaders();

      return await this.http
        .put(
          this.url + "/user",
          {
            firstName,
            lastName,
            country,
            newsletter
          },
          { headers }
        )
        .toPromise();
    } catch (err) {
      this.handleError(err);
    }
  }

  public async updateAmbassador(ambassador: Ambassador) {
    try {
      let headers = this.getAuthHeaders();

      return await this.http
        .put(this.url + "/user/ambassador", ambassador, { headers })
        .toPromise();
    } catch (err) {
      this.handleError(err);
    }
  }

  public async uploadProfilePicture(file: string) {
    try {
      let headers = new HttpHeaders().set(
        "authorization",
        "Bearer " + this.auth.token
      );
      return await this.http
        .post(this.url + "/user/profile-picture", {file}, { headers })
        .toPromise();

    } catch (err) {
      this.handleError(err);
    }
  }

  public async resetPassword(email: string) {
    try {
      await this.http
        .post(this.url + "/user/reset-password", {
          email
        })
        .toPromise();
    } catch (err) {
      this.handleError(err);
    }
  }

  public async changePassword(password: string, resetCode?: string) {
    try {
      if (resetCode) {
        return await this.http
          .put(this.url + "/user/reset-password", {
            resetCode,
            password
          })
          .toPromise();
      } else {
        let headers = this.getAuthHeaders();
        return await this.http
          .put(
            this.url + "/user",
            {
              password
            },
            { headers }
          )
          .toPromise();
      }
    } catch (err) {
      this.handleError(err);
    }
  }

  public async applyForAmbassador(name, country, why, how, relevant, involved, social) {
    try {
      let headers = this.getAuthHeaders();
      await this.http
        .post(
          this.url + "/user/ambassador/apply",
          {
            name,
            country,
            why,
            how,
            relevant,
            involved,
            social
          },
          { headers }
        )
        .toPromise();
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
