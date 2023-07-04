import {ChangeDetectorRef, Component, OnInit, TemplateRef} from '@angular/core';
// import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { combineLatest, Subscription } from 'rxjs';

@Component({
  selector: 'app-newfooter',
  templateUrl: './newfooter.component.html',
  styleUrls: ['./newfooter.component.scss']
})
export class NewfooterComponent implements OnInit {
  footerModalType: string;
  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];
  constructor(private modalService: BsModalService, private changeDetection: ChangeDetectorRef) { }

  ngOnInit() {
  }

  openFooterModal(content: TemplateRef<any>, type: string) {
    if (type === 'privacy') {
      this.footerModalType = 'privacy';
    } else if (type === 'faq') {
      this.footerModalType = 'faq';
    } else {
      this.footerModalType = 'news';
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

}
