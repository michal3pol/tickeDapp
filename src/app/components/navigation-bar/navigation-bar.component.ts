import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  links = ['login', 'transfer']; // TO CHANGE ?(sell, resell)
  activeLink = this.links[0];
  background: ThemePalette = 'primary';
  
  constructor() { }

  ngOnInit(): void {
  }

}
