import {ChangeDetectorRef, Component, OnInit, TemplateRef} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {StatsService} from '../../services/stats.service';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {filter} from 'rxjs/internal/operators';
import {combineLatest, Subscription} from 'rxjs';

@Component({
  selector: 'app-newheader',
  templateUrl: './newheader.component.html',
  styleUrls: ['./newheader.component.scss']
})

export class NewheaderComponent implements OnInit {
  public total = 0;
  public rate = 0.0;
  private totalUnfixed = 0;
  private decimalPlaces = 4;
  isCollapsed: boolean;
  private selected: string;
  public first_name: string;
  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];
  headerModalType: string;

  constructor(private router: Router,
              private modalService: BsModalService,
              private auth: AuthService,
              private stats: StatsService,
              private user: UserService,
              private changeDetection: ChangeDetectorRef) {
    stats.getTotalSupportKgs().then(total => {
      this.total = parseFloat((total as any).totalPlasticWasteFundKgs.toFixed(this.decimalPlaces));
      this.totalUnfixed = this.total;
      this.rate = (total as any).rate;

      setInterval(() => {
        this.totalUnfixed += this.rate;
        this.total = parseFloat((this.totalUnfixed).toFixed(this.decimalPlaces));
        if (this.isLoggedIn && this.first_name === 'unknown') {
          this.user.getUserInfo().then(customer => {
            this.first_name = customer.firstName;
          });
        }
        if (this.isLoggedIn && (this.headerModalType === 'login' || this.headerModalType === 'register')) {
          try {
            this.modalRef.hide();
          } catch (e) {
          }
        }
        if (!this.isLoggedIn && this.headerModalType === 'account') {
          try {
            this.modalRef.hide();
          } catch (err) {
          }
        }
      }, 1000);
    });
  }

  ngOnInit() {
    this.isCollapsed = true;
    this.first_name = 'unknown';
    this.user.getUserInfo().then(user => {
      this.first_name = user.firstName;
    });
  }

  goHome() {
    this.isCollapsed = true;
    this.router.navigate(['']);
  }

  goTo(location: string) {
    this.isCollapsed = true;
    this.router.navigate([location]);
  }

  get isLoggedIn() {
    return this.auth.isLoggedIn;
  }

  openHeaderModal(content: TemplateRef<any>, type: string) {
    try {
      this.modalRef.hide();
    } catch (e) {
    }
    if (type === 'login') {
      this.headerModalType = 'login';
    } else if (type === 'register') {
      this.headerModalType = 'register';
    } else if (type === 'forgot') {
      this.headerModalType = 'forgot';
    } else if (type === 'account') {
      this.headerModalType = 'account';
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
