import { Component, OnInit } from '@angular/core';
import { WordpressService } from '../../services/wordpress.service';
import { MetaTagService } from "../../services/meta-tag.service";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  public wpPosts = {
    found: 0,
    posts: []
  };

  constructor(private wordpressService: WordpressService, private metaTagService: MetaTagService, private activatedRoute: ActivatedRoute) { }

  async ngOnInit() {
    this.metaTagService.updateOgMetaTags(
      "The Empower Blog",
      undefined,
      "Read the latest stories and information from the Empower Team and our Ambassadors!"
    );

    this.activatedRoute.queryParams.subscribe(async _params => {
      if (typeof _params.draft !== "undefined") {
        this.wpPosts = (await this.wordpressService.getLatestDraftPosts() as any);
      } else {
        this.wpPosts = (await this.wordpressService.getLatestsPosts() as any);
      }
    });
  }

}
