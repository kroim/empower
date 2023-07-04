import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-newabout',
  templateUrl: './newabout.component.html',
  styleUrls: ['./newabout.component.scss']
})
export class NewaboutComponent implements OnInit {

  constructor() { }
  profile_infos = [
      {img:'wilhelm.jpg',name:'Wilhelm Myrer',role:'CEO & Founder'},
      {img:'carl.jpg',name:'Carl Nesset',role:'COO'},
      {img:'gjermund.jpg',name:'Gjermund Bjaanes',role:'CTO'},
      {img:'anette.jpg',name:'Anette Simonsen',role:'Social Media'},
      {img:'fredrik.jpg',name:'Fredrik Hertzberg',role:'Sales & Communication'},
      {img:'anna.jpg',name:'Anna Torst Saatvedt',role:'Graphic Design'},
      {img:'simen.png',name:'Simen Knudsen',role:'Ocean Ambassador'},
      {img:'truls.png',name:'Truls Haugland',role:'UX/UI'},
  ];

  ngOnInit() {
  }

}
