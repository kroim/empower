import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";
import { OrderService } from "../../services/order.service";
import { Ambassador } from "./ambassador";
import * as countries from "../../../countries.json";
import { ScriptServiceService } from "../../services/script-service.service";

@Component({
  selector: "app-my-page",
  templateUrl: "./my-page.component.html",
  styleUrls: ["./my-page.component.scss"]
})
export class MyPageComponent implements OnInit {
  @ViewChild("impactmap") impactmap: any;
  private map;

  public loading: boolean = false;

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

  public profileEditMode: boolean = false;
  public editFirstName: string;
  public editLastName: string;
  public editCountry: string;
  public editError: string;

  constructor(
    private auth: AuthService,
    private router: Router,
    private user: UserService,
    private order: OrderService,
    private scriptService: ScriptServiceService
  ) {
    this.countries = (countries as any).countries;
  }

  ngOnInit() {
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
        this.isAmbassador = user.isAmbassador ? user.isAmbassador : false;
        this.profileImage = user.profileImage;
        if (this.isAmbassador) {
          this.ambassador = user.ambassador as Ambassador;
        }

        this.editFirstName = user.firstName;
        this.editLastName = user.lastName;
        this.editCountry = user.country;
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
          this.scriptService.load("gmaps").then(() => {
            var mapProp = {
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
              const marker = new google.maps.Marker({
                position: {
                  lat:  !isNaN(impact.location.lat) ? parseFloat(impact.location.lat) : 0,
                  lng: !isNaN(impact.location.lng) ? parseFloat(impact.location.lng) : 0
                },
                map: this.map
              });

              var infowindow = new google.maps.InfoWindow({
                content: ""
              });

              marker.addListener("click", () => {
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
        alert("Something went wrong while loading user page: " + err);
      });
  }

  edit() {
    this.profileEditMode = !this.profileEditMode;
  }

  buy() {
    this.router.navigate(["checkout"]);
  }

  async saveEdit() {
    this.loading = true;
    try {
      await this.user.updateUser(
        this.editFirstName,
        this.editLastName,
        this.editCountry
      );
      this.firstName = this.editFirstName;
      this.lastName = this.editLastName;
      this.country = this.editCountry;
      this.profileEditMode = false;
    } catch (err) {
      this.editError = err;
    }
    this.loading = false;
  }

  logout() {
    this.auth.logout();
    this.router.navigate([""]);
  }

  changePassword() {
    this.router.navigate(["change-password"]);
  }

  async downloadGiftCard(id) {
    const giftCardUrl = await this.order.downloadGiftCard(id);
    window.location.href = giftCardUrl;
  }
}
