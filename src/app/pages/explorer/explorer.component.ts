import { Component, OnInit } from '@angular/core';
import { ExplorerService } from '../../services/explorer.service';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent implements OnInit {
  public loading: boolean = false;
  public records = [];
  private cursor;

  constructor(private explorerService: ExplorerService) {
    
  }

  ngOnInit() {
    this.loadMore();
  }

  async loadMore() {
    this.loading = true;

    try {
      const getTransactionObj = await this.explorerService.getTransactions(this.cursor);
      this.records = this.records.concat((getTransactionObj as any).records);
      this.cursor = (getTransactionObj as any).cursor;
      this.loading = false;
    } catch (err) {
      this.loading = false;
      throw err;
    }
  }

  async getIpfsRecord(tx) {
    this.loading = true;

    try {
      const ipfsObj = await this.explorerService.getIpfsHash(tx.ipfsHash);

      for (let rec of this.records) {
        if (rec.id == tx.id) {
          rec.ipfsObj = JSON.stringify(ipfsObj);
        }
      }
      this.loading = false;
    } catch (err) {
      this.loading = false;
      throw err;
    }
  }

}
