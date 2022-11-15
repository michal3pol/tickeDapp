import { Component } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tickeDapp';
  links = ['sell', 'resell'];
  activeLink = this.links[0];
  background: ThemePalette = 'primary';
}
