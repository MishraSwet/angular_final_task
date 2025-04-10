// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    
    // Store the attempted URL for redirecting after login
    const returnUrl = state.url;
    
    // Redirect to login page with a return URL
    if (confirm('You need to be logged in to access this page. Would you like to log in now?')) {
      // In a real app, you'd redirect to a login page with return URL
      // For now, we'll just open the login modal
      // You might need to implement a service to communicate with the header component
      // to open the login modal
      this.router.navigate(['/'], { queryParams: { login: true, returnUrl } });
    } else {
      this.router.navigate(['/']);
    }
    
    return false;
  }
}