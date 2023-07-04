import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public loading: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  setLoading(_loading) {
    this.loading = _loading;
  }

}
