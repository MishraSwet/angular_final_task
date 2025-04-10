import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { VerticalNavComponent } from './components/vertical-nav/vertical-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, VerticalNavComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  navIsOpen = false;
  
  toggleNav(isOpen: boolean): void {
    this.navIsOpen = isOpen;
  }
  
  closeNav(): void {
    this.navIsOpen = false;
  }
}