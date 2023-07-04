import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { OpenAmbassadorService } from "../../../services/open-ambassador.service";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"]
})
export class MapComponent implements OnInit {
  @Input()
  selectedAmbassadorId;

  @ViewChild("gmap")
  gmapElement: any;
  map: google.maps.Map;

  private ambassadors;

  constructor(private openAmbassadorService: OpenAmbassadorService) {}

  ngOnInit() {
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
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    this.openAmbassadorService.getAllAmbassadors().then(_ambassadors => {
      this.ambassadors = _ambassadors;

      for (let user of this.ambassadors) {
        if (user.location && user.location.lat && user.location.lng) {
          const marker = new google.maps.Marker({ position: user.location, map: this.map });

          const imageContent = user.profileImage ? `
            <img style="max-width: 200px" src="${user.profileImage}">
            <br>
          ` : ``

          const whoAmIContent = user.who ? `
            <b>Who am I?</b> ${user.who}
            <br>
            ` : '';
          
          const whyPlasticContent = user.whyPlastic ? `
            <b>Why the plastic problem?</b> ${user.whyPlastic}
            <br>
          ` : '';

          const whyEmpowerContent = user.whyEmpower ? `
            <b>Why Empower?</b> ${user.whyEmpower}
            <br>
          ` : '';

          const content = `
          <div style="color: #000">
            ${imageContent}
            <b>Name:</b> ${user.firstName} ${user.lastName}
            <br>
            ${whoAmIContent}
            ${whyPlasticContent}
            ${whyEmpowerContent}
          </div>
          `;

          var infowindow = new google.maps.InfoWindow({
            content: ''
          });

          marker.addListener("click", () => {
            infowindow.setContent(content);
            infowindow.open(this.map, marker);
          });
        }
      }
    });
  }
}
