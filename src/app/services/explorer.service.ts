import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExplorerService {
  private url: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  public async getTransactions(cursor?) {
    const cryptoApiUrl = this.url + "/api/crypto" + (cursor ? ("?cursor=" + cursor) : "")
    return await this.http.get(cryptoApiUrl).toPromise();
  }

  public async getIpfsHash(ipfsHash) {
    return await this.http.get(this.url + "/api/crypto/ipfshash/" + ipfsHash).toPromise();
  }
}
