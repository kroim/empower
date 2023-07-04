import {Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import {debugOutputAstAsTypeScript} from '@angular/compiler';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import { combineLatest, Subscription } from 'rxjs';

@Component({
  selector: 'app-newhome',
  templateUrl: './newhome.component.html',
  styleUrls: ['./newhome.component.scss']
})
export class NewhomeComponent implements OnInit {

  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];
  modal_params: any;
  sending_params: any;

  constructor(private modalService: BsModalService, private changeDetection: ChangeDetectorRef) {
  }

  sliderMin: number = 1;
  sliderMax: number = 10;
  sliderValue: number;
  checkoutDoneFlag: boolean;

  ngOnInit() {
    this.sliderValue = 5;
    this.control_slider_text();
    this.checkoutDoneFlag = false;
  }

  control_slider_text() {
    const sliderCtrl = <HTMLElement>document.getElementsByClassName('home_range')[0];
    const sliderTxtCtrl = <HTMLElement>document.getElementById('home_slider_value');
    const leftPos = sliderCtrl.offsetLeft + 25;
    const totalWidth = sliderCtrl.offsetWidth - 50;
    const min = this.sliderMin;
    const max = this.sliderMax;
    const valPos = (this.sliderValue - this.sliderMin) / (this.sliderMax - this.sliderMin);
    const curPos = leftPos + valPos * totalWidth;
    sliderTxtCtrl.style.left = curPos.toFixed(3) + 'px';
  }

  scrollMove(destination) {
    let scTop = window.scrollY;
    const scStep = (document.getElementById(destination).offsetTop - scTop) / 50;
    const frame = function () {
      scTop += scStep;  // update parameters
      // document.getElementsByTagName('html')[0].scrollTop = scTop; // show frame
      window.scrollTo(0, scTop);
      // alert(scTop);
      if (scStep > 0) {
        if (scTop >= document.getElementById(destination).offsetTop) {  // check finish condition
          clearInterval(id);
        }
      } else {
        if (scTop <= document.getElementById(destination).offsetTop) {  // check finish condition
          clearInterval(id);
        }
      }
    };
    const id = setInterval(frame, 10); // draw every 10ms
  }

  openSubModal(content: TemplateRef<any>, type: string) {
    this.checkoutDoneFlag = false;
    try {
      this.modalRef.hide();
    } catch (e) {
    }
    if (type === 'sub') {
      this.modal_params = {
        pay_type: 'sub',
        value: this.sliderValue,
      };
    } else if (type === 'gift') {
      this.modal_params = {
        pay_type: 'gift',
        value: this.sliderValue,
      };
    }
    // modal events
    const _combine = combineLatest(
      this.modalService.onShown,
      this.modalService.onHidden
    ).subscribe(() => this.changeDetection.markForCheck());
    this.subscriptions.push(
      this.modalService.onShown.subscribe((reason: string) => {
        console.log(`onShown event has been fired`);
        document.body.classList.add('modal-background-custom-content');
      })
    );
    this.subscriptions.push(
      this.modalService.onHidden.subscribe((reason: string) => {
        const _reason = reason ? `, dismissed by ${reason}` : '';
        console.log(`onHidden event has been fired${_reason}`);
        document.body.classList.remove('modal-background-custom-content');
        this.unsubscribe();
      })
    );

    this.subscriptions.push(_combine);
    this.modalRef = this.modalService.show(content, Object.assign({}, {class: 'modal-lg'}));
  }
  unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  modalData(checkoutModalData: any) {
    if (checkoutModalData) {
      this.sending_params = {
        payment: checkoutModalData.payment,
        amount: checkoutModalData.amount,
        isGift: checkoutModalData.isGift
      };
      this.checkoutDoneFlag = true;
    }
  }
}
