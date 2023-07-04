import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../services/stats.service';

@Component({
  selector: 'app-totalt-cleaning-stats',
  templateUrl: './totalt-cleaning-stats.component.html',
  styleUrls: ['./totalt-cleaning-stats.component.scss']
})
export class TotaltCleaningStatsComponent implements OnInit {

  public total = 0;
  public rate = 0.0;
  private totalUnfixed = 0;

  private decimalPlaces = 4;

  constructor(private stats: StatsService) {
    stats.getTotalSupportKgs().then(total => {
      this.total = parseFloat((total as any).totalPlasticWasteFundKgs.toFixed(this.decimalPlaces));
      this.totalUnfixed = this.total;
      this.rate = (total as any).rate;

      setInterval(() => {
        this.totalUnfixed += this.rate;
        this.total = parseFloat((this.totalUnfixed).toFixed(this.decimalPlaces));
      }, 1000);
    });
  }

  ngOnInit() {
  }

}
