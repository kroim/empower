import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
/*import { CookieService } from 'ngx-cookie';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { isPlatformBrowser } from '@angular/common';*/

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(
    /*private cookieService: CookieService,
    private ngxSmartModalService: NgxSmartModalService,
    @Inject(PLATFORM_ID) private platformId: Object*/
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    /*if (isPlatformBrowser(this.platformId)) {
      const popupModalShown = this.cookieService.get(
        'christmasPopupModalShown'
      );
      if (!popupModalShown) {
        this.cookieService.putObject('christmasPopupModalShown', true);
        setTimeout(() => {
          this.ngxSmartModalService.getModal('myModal').open();
        }, 1000);
      }
    }*/
  }
}
