import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  show(e) {
    const target = e.currentTarget;
    const parent = target.parentElement;
    const child = parent.getElementsByClassName("question-answer")[0];

    if (child.className === "question-answer") {
      child.className += " show";
      target.className += " replaced";
    } else {
      child.className = "question-answer";
      target.className = "sign";
    }
  }

}
