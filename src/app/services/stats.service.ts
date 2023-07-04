import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private url: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  public async getTotalSupportKgs() {
    return await this.http.get(this.url + "/api/stats").toPromise();
  }

  public async getAmbassadorProfile(ambassadorId) {
    return await this.http.get(this.url + "/api/ambassador?id=" + ambassadorId).toPromise();
  }
}
