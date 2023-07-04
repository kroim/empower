import { Component, OnInit, Input } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-make-ambassador',
  templateUrl: './make-ambassador.component.html',
  styleUrls: ['./make-ambassador.component.scss']
})
export class MakeAmbassadorComponent implements OnInit {
  @Input("setLoading") setLoading;

  public ambassadorToBeEmail: string;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
  }

  async makeUserAmbassador() {
    this.setLoading(true);
    try {
      await this.adminService.makeUserAmbassador(this.ambassadorToBeEmail)
      this.setLoading(false);
      alert("User is now an ambassador");
    } catch (err) {
      this.setLoading(false);
      console.log(err);
      alert("Error: " + err);
    }
  }

}
