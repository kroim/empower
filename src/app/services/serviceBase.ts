import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";

export class BaseService {
  protected url: string = environment.baseUrl;

  constructor(protected http: HttpClient, protected auth: AuthService) {
  }

  protected getAuthHeaders() {
    return new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("authorization", "Bearer " + this.auth.token);
  }

  protected handleError(err) {
    if (err.error && err.error.message) {
      throw err.error.message;
    } else {
      throw err.message;
    }
  }
}
