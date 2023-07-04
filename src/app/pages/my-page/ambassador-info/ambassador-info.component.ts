import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { Ambassador } from "../ambassador";
import { UserService } from "../../../services/user.service";
import {} from "@types/googlemaps";
import { ScriptServiceService } from "../../../services/script-service.service";

@Component({
  selector: "app-ambassador-info",
  templateUrl: "./ambassador-info.component.html",
  styleUrls: ["./ambassador-info.component.scss"]
})
export class AmbassadorInfoComponent implements OnInit {
  @Input()
  ambassador: Ambassador;
  @Input()
  profileImage: string;

  @ViewChild("gmapshow")
  gmapElementShow: any;

  @ViewChild("gmapedit")
  gmapElementEdit: any;

  public loading: boolean = false;

  showMap: google.maps.Map;
  editMap: google.maps.Map;
  showMarker: google.maps.Marker;
  editMarker: google.maps.Marker;

  public editMode: boolean = false;
  public hide1: boolean = true;
  public hide2: boolean = true;

  constructor(private userService: UserService, private scriptService: ScriptServiceService) {}

  ngOnInit() {
    this.scriptService.load('gmaps').then(() => {
      var mapProp = {
        center: new google.maps.LatLng(0, 0),
        zoom: 1,
        minZoom: 1
      };
      this.showMap = new google.maps.Map(
        this.gmapElementShow.nativeElement,
        mapProp
      );
      this.editMap = new google.maps.Map(
        this.gmapElementEdit.nativeElement,
        mapProp
      );
  
      if (this.ambassador.location && this.ambassador.location.lat && this.ambassador.location.lng) {
        this.showMarker = new google.maps.Marker({ position: this.ambassador.location, map: this.showMap });
        this.editMarker = new google.maps.Marker({ position: this.ambassador.location, map: this.editMap });
      }
  
      this.editMap.addListener("click", (event) => {
        var location = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        if (this.editMarker) {
          this.editMarker.setMap(null);
        }
        this.editMarker = new google.maps.Marker({ position: location, map: this.editMap });
      });
    });
  }

  edit() {
    this.editMode = true;
  }

  async save() {
    this.loading = true;

    if (this.editMarker) {
      const location = {
        lat: this.editMarker.getPosition().lat(),
        lng: this.editMarker.getPosition().lng()
      }
      if (this.showMarker) {
        this.showMarker.setMap(null);
      }
      this.showMarker = new google.maps.Marker({ position: location, map: this.showMap });
      this.ambassador.location = location;
    }
    
    try {
      await this.userService.updateAmbassador(this.ambassador);
    } catch (err) {
      alert("Something went wrong with updating info (not picture): " + err);
    }

    try {
      if (this.profileImage) {
        await this.userService.uploadProfilePicture(this.profileImage);
      }
    } catch (err) {
      alert("Something went wrong with updating the picture: " + err)
    }
    
    this.loading = false;
    this.editMode = false;
  }

  onChange(event: EventTarget) {
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    let file = files[0];

    if ((typeof file.size !== "undefined") && file.size > 2000000) {
      alert("File size too large! Please select an image with max 2MB of size");
    } else if (typeof file !== "undefined") {
      this.getBase64(file).then(base64 => {
        this.profileImage = base64;
      });
    }
  }

  getBase64(file): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  toggle1() {
    this.hide1 = !this.hide1;
  }

  toggle2() {
    this.hide2 = !this.hide2;
  }
}
