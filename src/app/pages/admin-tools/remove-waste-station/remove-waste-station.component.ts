import { Component, OnInit, Input } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-remove-waste-station',
  templateUrl: './remove-waste-station.component.html',
  styleUrls: ['./remove-waste-station.component.scss']
})
export class RemoveWasteStationComponent implements OnInit {
  @Input("setLoading") setLoading;

  constructor(private adminService: AdminService) { }

  public publicKey;

  ngOnInit() {
  }

  async removeWasteStation() {
    this.setLoading(true);
    try {
      await this.adminService.removeWasteStation(this.publicKey);
      this.setLoading(false);
      alert("Waste station remove!");
    } catch (err) {
      this.setLoading(false);
      console.log(err);
      alert("Error: " + err);
    }
  }

}
