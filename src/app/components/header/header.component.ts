import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() navToggled = new EventEmitter<boolean>();
  @Input() navIsOpen = false;
  
  showLoginModal = false;
  showRegisterModal = false;
  showProfileDropdown = false;
  
  loginData = {
    email: '',
    password: ''
  };
  
  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    region: '',
    password: '',
    confirmPassword: '',
    imageFile: null as File | null
  };
  
  countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Spain', 'Italy', 'Japan', 'China', 'India', 'Brazil'];
  regions = ['North', 'South', 'East', 'West', 'Central', 'Northeast', 'Northwest', 'Southeast', 'Southwest'];
  
  constructor(
    public authService: AuthService,
    private router: Router
  ) { }
  
  get currentUser(): User | null {
    return this.authService.currentUserValue;
  }
  
  toggleNav(): void {
    this.navIsOpen = true;
    this.navToggled.emit(true);
  }
  
  navigateToHome(): void {
    this.router.navigate(['/']);
  }
  
  openLoginModal(): void {
    this.showLoginModal = true;
    this.showRegisterModal = false;
  }
  
  openRegisterModal(): void {
    this.showRegisterModal = true;
    this.showLoginModal = false;
  }
  
  closeModals(): void {
    this.showLoginModal = false;
    this.showRegisterModal = false;
  }
  
  toggleProfileDropdown(): void {
    this.showProfileDropdown = !this.showProfileDropdown;
  }
  
  submitLogin(): void {
    if (this.loginData.email && this.loginData.password) {
      const success = this.authService.login(this.loginData.email, this.loginData.password);
      if (success) {
        this.closeModals();
        // Reset form
        this.loginData = { email: '', password: '' };
      } else {
        alert('Invalid email or password');
      }
    } else {
      alert('Please enter email and password');
    }
  }
  
  submitRegistration(): void {
    // Validate form
    if (!this.registerData.firstName || !this.registerData.lastName || !this.registerData.email) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (this.registerData.password !== this.registerData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    // Create user object
    const user = {
      email: this.registerData.email,
      password: this.registerData.password,
      firstName: this.registerData.firstName,
      lastName: this.registerData.lastName,
      country: this.registerData.country,
      region: this.registerData.region
    };
    
    // Register user
    const success = this.authService.register(user);
    if (success) {
      this.closeModals();
      // Reset form
      this.registerData = {
        firstName: '',
        lastName: '',
        email: '',
        country: '',
        region: '',
        password: '',
        confirmPassword: '',
        imageFile: null
      };
    } else {
      alert('Registration failed. Email may already be in use.');
    }
  }
  
  logout(): void {
    this.authService.logout();
    this.showProfileDropdown = false;
    this.router.navigate(['/']);
  }
  
  navigateToProfile(): void {
    this.showProfileDropdown = false;
    // Navigate to profile page
    // this.router.navigate(['/profile']);
  }
  
  navigateToSettings(): void {
    this.showProfileDropdown = false;
    this.router.navigate(['/preferences']);
  }
  
  forgotPassword(): void {
    alert('Password reset functionality will be implemented in a future update.');
  }
}