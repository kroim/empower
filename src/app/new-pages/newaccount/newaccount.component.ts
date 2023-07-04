import {Component, OnInit, ViewChild} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { OrderService } from '../../services/order.service';
import { Ambassador } from '../../pages/my-page/ambassador';
import * as countries from '../../../countries.json';
import { ScriptServiceService } from '../../services/script-service.service';

@Component({
  selector: 'app-newaccount',
  templateUrl: './newaccount.component.html',
  styleUrls: ['./newaccount.component.scss']
})
export class NewaccountComponent implements OnInit {
  @ViewChild("impactmap") impactmap: any;
  private map;
  public loading: boolean;
  public countries;

  public email: string;
  public firstName: string;
  public lastName: string;
  public country: string;
  public isAmbassador: boolean;
  public profileImage: string;
  public ambassador: Ambassador;

  public userTotal = 0;

  public orders: any = {
    orderList: [],
    giftList: []
  };
  public impacts = [];

  public profileEditMode: boolean;
  public cardUpdateMode: boolean;
  public editFirstName: string;
  public editLastName: string;
  public editCountry: string;
  public editPassword: string;
  public editRepeatPassword: string;
  public editError: string;

  personalShow: boolean;
  paymentShow: boolean;
  fundedShow: boolean;
  orderShow: boolean;

  constructor(private auth: AuthService,
              private router: Router,
              private user: UserService,
              private order: OrderService,
              private scriptService: ScriptServiceService) {
    this.countries = (countries as any).countries;
  }

  ngOnInit() {
    this.personalShow = false;
    this.paymentShow = false;
    this.fundedShow = false;
    this.orderShow = false;
    this.profileEditMode = true;
    this.cardUpdateMode = true;
    window.scrollTo(0, 0);

    this.loading = true;
    let promises = [];
    promises.push(
        this.order.getTotalAmountForUser().then(res => {
          this.userTotal = (res as any).totalAmountForUser.toFixed(4);
        })
    );
    promises.push(
        this.user.getUserInfo().then(user => {
          this.email = user.email;
          this.firstName = user.firstName;
          this.lastName = user.lastName;
          this.country = user.country;
          this.editFirstName = user.firstName;
          this.editLastName = user.lastName;
          this.editCountry = user.country;
          this.isAmbassador = user.isAmbassador ? user.isAmbassador : false;
          this.profileImage = user.profileImage;
          if (this.isAmbassador) {
            this.ambassador = user.ambassador as Ambassador;
          }
        })
    );
    promises.push(
        this.order.getAllOrders().then(orders => {
          this.orders = orders;
        })
    );
    promises.push(
        this.order.getUserImpact().then(impactObj => {
          for (let impact in impactObj) {
            if (impactObj.hasOwnProperty(impact)) {
              this.impacts.push({
                publicKeys: impactObj[impact].publicKeys,
                amount: impactObj[impact].amount,
                location: impactObj[impact].location
              });
            }
          }

          if (this.impacts.length > 0) {
            this.scriptService.load('gmaps').then(() => {
              let mapProp = {
                center: new google.maps.LatLng(0, 0),
                zoom: 1,
                minZoom: 1,
                disableDefaultUI: true,
                zoomControl: true,
                scaleControl: true,
                rotateControl: true,
                fullscreenControl: true
              };
              this.map = new google.maps.Map(
                  this.impactmap.nativeElement,
                  mapProp
              );

              for (let impact of this.impacts) {
                let marker = new google.maps.Marker({
                  position: {
                    lat:  !isNaN(impact.location.lat) ? parseFloat(impact.location.lat) : 0,
                    lng: !isNaN(impact.location.lng) ? parseFloat(impact.location.lng) : 0
                  },
                  map: this.map
                });

                let infowindow = new google.maps.InfoWindow({
                  content: ''
                });

                marker.addListener('click', () => {
                  infowindow.setContent(`<div style="color: #000">
                Amount: ${impact.amount} kg
              </div>`);
                  infowindow.open(this.map, marker);
                });
              }
            });
          }
        })
    );
    Promise.all(promises)
        .then(() => {
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          alert('Something went wrong while loading user page: ' + err);
        });
  }

  showHide(type) {
    if (type === 'personal') {
      this.personalShow = !this.personalShow;
    } else if (type === 'payment') {
      this.paymentShow = !this.paymentShow;
    } else if (type === 'funded') {
      this.fundedShow = !this.fundedShow;
    } else if (type === 'order') {
      this.orderShow = !this.orderShow;
    }
  }

  editFunc(type) {
    if (type === 'personal') {
      this.profileEditMode = !this.profileEditMode;
    } else if (type === 'payment') {
      this.cardUpdateMode = !this.cardUpdateMode;
    }
  }

  async saveChanges() {
    if (this.firstName === '' || this.lastName === '' || this.country === '') {
      this.editError = 'Empty Fields';
    } else {
      try {
        await this.user.updateUser(
            this.firstName, this.lastName, this.country
        );
      } catch (err) {
        this.editError = err;
      }
    }
  }

  cancelChanges() {
    this.firstName = this.editFirstName;
    this.lastName = this.editLastName;
    this.country = this.editCountry;
    this.profileEditMode = true;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
