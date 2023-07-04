import { Component, OnInit, Input } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-update-crypto',
  templateUrl: './update-crypto.component.html',
  styleUrls: ['./update-crypto.component.scss']
})
export class UpdateCryptoComponent implements OnInit {
  @Input("setLoading") setLoading;
  
  constructor(private adminService: AdminService) { }

  ngOnInit() {
  }

  async updateCrypto() {
    this.setLoading(true);
    try {
      await this.adminService.updateCrypto()
      this.setLoading(false);
      alert("Crypto updated");
    } catch (err) {
      this.setLoading(false);
      console.log(err);
      alert("Error: " + err);
    }
  }

}
