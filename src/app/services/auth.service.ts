import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CookieService } from "ngx-cookie";
import { environment } from "../../environments/environment";
import * as jwt_decode from "jwt-decode";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private url: string = environment.baseUrl;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  public get isLoggedIn() {
      try {
          if (this.cookieService.get("user")) {
              return true;
          } else {
              return false;
          }
      }
      catch(err) {
          return false;
      }
  }

  public get isAdmin() {
    let decoded;
    try {
      decoded = jwt_decode(this.token);
    } catch {
      return false;
    }

    if (decoded && decoded.isAdmin) {
      return true;
    } else {
      return false;
    }
  }

  public getCookieService() {
    return this.cookieService;
  }

  public async login(email: string, password: string) {
    try {
      const login = await this.http
        .post(this.url + "/login", {
          username: email,
          password
        })
        .toPromise();
      this.cookieService.putObject("user", login);

      return login;
    } catch (err) {
      if (err.status === 401) {
        throw "Username or password is incorrect";
      } else {
        throw err.message;
      }
    }
  }

  public get token() {
    let user = this.cookieService.getObject("user") as any;

    if (user) {
      return user.token;
    } else {
      return "";
    }
  }

  logout() {
    this.cookieService.remove("user");
  }

  public async register(
    email: string,
    password: string,
    newsletter: boolean,
    firstName?: string,
    lastName?: string,
    country?: string
  ) {
    try {
      let subscribeToNewsletter;
      if (newsletter) {
        subscribeToNewsletter = true;
      }
      const login = await this.http
        .post(this.url + "/register", {
          email,
          password,
          firstName,
          lastName,
          country,
          newsletter: subscribeToNewsletter
        })
        .toPromise();
      this.cookieService.putObject("user", login);
      return login;
    } catch (err) {
      if (err.statusCode === 409) {
        throw "User already exists";
      } else {
        this.handleError(err);
      }
    }
  }

  public async confirm(confirmCode: string) {
    try {
      await this.http
        .put(this.url + "/register/validate/" + confirmCode, {})
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
}
