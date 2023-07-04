import { Injectable } from '@angular/core';
import { BaseService } from './serviceBase';
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class OpenAmbassadorService extends BaseService {

  constructor(http: HttpClient, auth: AuthService) {
    super(http, auth);
  }

  async getAllAmbassadors() {
    return await this.http.get(this.url + "/api/ambassador").toPromise();
  }
}
