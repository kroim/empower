import { Injectable } from "@angular/core";
import { Meta } from "@angular/platform-browser";

const defaultOgTitle = "Empower - Let's clean the world of plastic waste!";
const defaultOgImage = "https://empower.eco/assets/share-picture.jpg";
const defaultOgDescription = "A global solution to plastic waste - incentivise clean-ups - digital deposit system - local aid. Join the #plasticwastemovement";

@Injectable({
  providedIn: "root"
})
export class MetaTagService {
  constructor(private meta: Meta) {}

  private updateMetaTag(property, content) {
    this.meta.updateTag({property, content});
  }

  updateOgMetaTags(title, image, description) {
    if (typeof title !== "undefined") {
      this.updateMetaTag("og:title", title);
    }
    if (typeof image !== "undefined") {
      this.updateMetaTag("og:image", image);
    }
    if (typeof description !== "undefined") {
      this.updateMetaTag("og:description", description);
    }
  }

  resetMetaTagsToDefault() {
    this.updateOgMetaTags(
      defaultOgTitle,
      defaultOgImage,
      defaultOgDescription
    );
  }

  createDefaultOgMetaTags() {
    this.meta.addTags([
      {property: "og:title", content: defaultOgTitle},
      {property: "og:image", content: defaultOgImage},
      {property: "og:description", content: defaultOgDescription}
    ]);
  }
}
