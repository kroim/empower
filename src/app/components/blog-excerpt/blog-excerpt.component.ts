import { Component, OnInit, Input } from '@angular/core';
import { post } from 'selenium-webdriver/http';

@Component({
  selector: 'app-blog-excerpt',
  templateUrl: './blog-excerpt.component.html',
  styleUrls: ['./blog-excerpt.component.scss']
})
export class BlogExcerptComponent implements OnInit {
  @Input("post") post;

  constructor() { }

  ngOnInit() {
  }

}
