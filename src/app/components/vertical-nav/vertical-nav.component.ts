import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

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

  constructor(private router: Router) { }

  closeNav(): void {
    this.navClosed.emit();
  }

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
    this.navClosed.emit();
  }
}