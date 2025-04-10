import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { VerticalNavComponent } from './components/vertical-nav/vertical-nav.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    RouterModule,
    FormsModule,
    HeaderComponent, 
    VerticalNavComponent, 
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isNavExpanded = false;

  toggleNav(isExpanded: boolean): void {
    this.isNavExpanded = isExpanded;
  }

  closeNav(): void {
    this.isNavExpanded = false;
  }
}