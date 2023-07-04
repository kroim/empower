import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-blog-author-box',
  templateUrl: './blog-author-box.component.html',
  styleUrls: ['./blog-author-box.component.scss']
})
export class BlogAuthorBoxComponent implements OnInit {
  @Input("post") post;

  constructor() { }

  ngOnInit() {
  }

}
