import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-vertical-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vertical-nav.component.html',
  styleUrls: ['./vertical-nav.component.css']
})
export class VerticalNavComponent {
  @Input() isExpanded = false;
  @Output() navClosed = new EventEmitter<void>();

  constructor() { }

  closeNav(): void {
    this.navClosed.emit();
  }

  navigateTo(route: string): void {
    // Navigation logic
    // You might want to close the nav after navigation on mobile
    this.navClosed.emit();
  }
}