import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class WordpressService {
  constructor(private httpClient: HttpClient) {

  }

  async getLatestsPosts() {
    return this.httpClient.get("https://public-api.wordpress.com/rest/v1.1/sites/https%3A%2F%2Fempowerbackend.wordpress.com/posts?category=published").toPromise();
  }

  async getLatestDraftPosts() {
    return this.httpClient.get("https://public-api.wordpress.com/rest/v1.1/sites/https%3A%2F%2Fempowerbackend.wordpress.com/posts?category=draft").toPromise();
  }

  async getPost(slug) {
    return this.httpClient.get("https://public-api.wordpress.com/rest/v1.1/sites/https%3A%2F%2Fempowerbackend.wordpress.com/posts/slug:" + slug).toPromise();
  }
}
