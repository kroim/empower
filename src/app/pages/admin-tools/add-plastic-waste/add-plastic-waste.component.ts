import { Component, OnInit, Input } from '@angular/core';
import { AdminService } from '../admin.service';


@Component({
  selector: 'app-add-plastic-waste',
  templateUrl: './add-plastic-waste.component.html',
  styleUrls: ['./add-plastic-waste.component.scss']
})
export class AddPlasticWasteComponent implements OnInit {
  @Input("setLoading") setLoading;

  public privateKey: string = "";
  public amount: number = 0;
  public email: string = "";
  public password: string = "";


  constructor(private adminService: AdminService) {
  }

  ngOnInit() {
  }

  async addPlasticWaste() {
    this.setLoading(true);
    try {
      await this.adminService.addPlasticWaste(this.email, this.password, this.privateKey, this.amount);
      this.setLoading(false);
      alert("Plastic waste delivered!");
    } catch (err) {
      this.setLoading(false);
      console.log(err);
      alert("Error: " + err);
    }
  }

}
