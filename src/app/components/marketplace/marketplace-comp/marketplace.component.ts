import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {

  links = ['sell', 'resell']; 
  activeLink = this.links[0];

  components = ['sell', 'resell']; 
  activeComponent = this.components[0];

  background: ThemePalette = 'primary';

  constructor() { }

  ngOnInit(): void {
  }

}
