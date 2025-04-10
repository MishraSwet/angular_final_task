import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  @Output() navToggled = new EventEmitter<boolean>();
  
  isLoggedIn = false;
  userProfileImage: string | null = null;
  isNavOpen = false;
  showUserMenu = false;
  
  // Modal controls
  showLoginModal = false;
  showRegisterModal = false;
  
  // Form data
  loginData = {
    username: '',
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
  
  // Sample data for dropdowns
  countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'India', 'Germany', 'France'];
  regions = ['North', 'South', 'East', 'West', 'Central'];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      this.userProfileImage = user ? 'assets/default-profile.png' : null;
    });
  }

  toggleNav(): void {
    this.isNavOpen = !this.isNavOpen;
    this.navToggled.emit(this.isNavOpen);
  }
  
  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }
  
  openLoginModal(): void {
    this.showLoginModal = true;
    this.showRegisterModal = false;
    this.showUserMenu = false;
  }
  
  openRegisterModal(): void {
    this.showRegisterModal = true;
    this.showLoginModal = false;
    this.showUserMenu = false;
  }
  
  closeModals(event?: Event): void {
    // Only close if clicking the overlay, not the modal itself
    if (event) {
      const target = event.target as HTMLElement;
      if (target.classList.contains('modal-overlay')) {
        this.showLoginModal = false;
        this.showRegisterModal = false;
      }
    } else {
      this.showLoginModal = false;
      this.showRegisterModal = false;
    }
  }
  
  submitLogin(): void {
    if (this.loginData.username && this.loginData.password) {
      const success = this.authService.login(this.loginData.username, this.loginData.password);
      if (success) {
        this.closeModals();
        // Reset form
        this.loginData = { username: '', password: '' };
      } else {
        alert('Invalid username or password');
      }
    } else {
      alert('Please enter username and password');
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
      username: this.registerData.email,
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
  
  forgotPassword(): void {
    alert('Password reset functionality will be implemented here');
  }
  
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.registerData.imageFile = input.files[0];
    }
  }
  
  viewProfile(): void {
    // Navigate to profile page
    this.showUserMenu = false;
  }
  
  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
  }
}