import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription',
  templateUrl: "./subscription.component.html",
  styleUrls: ["./subscription.component.scss"]
})
export class SubscriptionComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
  }

  subscribe() {
    const data = {
      type: "subscription",
      amount: 5,
      isGift: false
    };

    this.router.navigateByData({
      url: ['checkout'],
      data
    });
  }

}
