import { Component, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sponsor',
  templateUrl: './sponsor.component.html',
  styleUrls: ['./sponsor.component.scss']
})
export class SponsorComponent{
  @Input("main") main;
  @Output() onGo = new EventEmitter();
  @ViewChild('giftDiv') public giftDiv:ElementRef;

  constructor(private router: Router) {}

  public hideAnswer: boolean = true;

  public wantToChoose: boolean = false;
  public isGift: boolean = false;

  public customOneTimeAmountModel = 100;
  public customSubscribeAmountModel = 25;

  supportLevel1() {
    this.checkout('subscription', 3);
  }

  supportLevel2() {
    this.checkout('subscription', 5);
  }

  supportLevel3() {
    this.checkout('subscription', 10);
  }

  giftHalfYear() {
    this.checkout('onetime', 30, true);
  }

  giftOneYear() {
    this.checkout('onetime', 60, true);
  }

  customSubscribe() {
    this.checkout('subscription', this.customSubscribeAmountModel, this.isGift);
  }

  customOneTime() {
    this.checkout('onetime', this.customOneTimeAmountModel, this.isGift);
  }

  toggleGift() {
    this.wantToChoose = !this.wantToChoose;
    this.isGift = this.wantToChoose;
    setTimeout(() => {
      this.giftDiv.nativeElement.scrollIntoView({block: "nearest"});
    });
    
  }

  toggleCustom() {
    this.wantToChoose = !this.wantToChoose;
    this.isGift = false;
  }

  private checkout(type, amount, isGift?) {
    const data = {
      type,
      amount,
      isGift
    };

    this.router.navigateByData({
      url: ['checkout'],
      data
    });
    this.onGo.emit(data);
  }
}
