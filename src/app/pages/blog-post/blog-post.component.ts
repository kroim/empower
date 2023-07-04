import { Component, OnInit } from "@angular/core";
import { WordpressService } from "../../services/wordpress.service";
import { ActivatedRoute } from "@angular/router";
import { MetaTagService } from "../../services/meta-tag.service";
import { FacebookService } from "../../services/facebook.service";
declare var FB: any;

@Component({
  selector: "app-blog-post",
  templateUrl: "./blog-post.component.html",
  styleUrls: ["./blog-post.component.scss"]
})
export class BlogPostComponent implements OnInit {
  public post;

  constructor(
    private wordpressService: WordpressService,
    private activatedRoute: ActivatedRoute,
    private metaTagService: MetaTagService,
    private facebookService: FacebookService
  ) {}

  async ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    this.post = await this.wordpressService.getPost(id);

    this.metaTagService.updateOgMetaTags(
      this.post.title,
      this.post.featured_image,
      this.post.excerpt
    );
  }

  shareToFacebook() {
    this.facebookService.loadFacebookSdk().then(() => {
      FB.ui(
        {
          method: "share",
          href: window.location.href
        },
        function(response) {}
      );
    });
    
  }

  shareToTwitter() {
    window.location.href =
      "https://twitter.com/intent/tweet?text=" +
      encodeURIComponent(window.location.href);
  }
}
