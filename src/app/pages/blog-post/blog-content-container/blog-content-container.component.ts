import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'app-blog-content-container',
  templateUrl: './blog-content-container.component.html',
  styleUrls: ['./blog-content-container.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BlogContentContainerComponent implements OnInit {
  @Input("content") content;
  
  constructor() { }

  ngOnInit() {
  }

}
