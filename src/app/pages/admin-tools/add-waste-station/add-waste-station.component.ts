import { Component, OnInit, Input } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-add-waste-station',
  templateUrl: './add-waste-station.component.html',
  styleUrls: ['./add-waste-station.component.scss']
})
export class AddWasteStationComponent implements OnInit {
  @Input("setLoading") setLoading;

  constructor(private adminService: AdminService) { }

  public publicKey;
  public location = {
    lat: "",
    lng: ""
  }
  public description;
  public dailyLimitation;
  public email;

  ngOnInit() {
  }

  async addWasteStation() {
    this.setLoading(true);
    try {
      await this.adminService.addWasteStation(this.publicKey, this.location, this.dailyLimitation, this.email, this.description);
      this.setLoading(false);
      alert("Waste station added!");
    } catch (err) {
      this.setLoading(false);
      console.log(err);
      alert("Error: " + err);
    }
  }

}
