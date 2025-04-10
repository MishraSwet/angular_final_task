import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {
  preferences = {
    favoriteCuisines: [] as string[],
    dietaryRestrictions: [] as string[],
    cookingTimePreference: 'any',
    difficultyPreference: 'any',
    notificationPreferences: {
      newRecipes: true,
      comments: true,
      favorites: true
    }
  };
  
  cuisines = [
    'American', 'Italian', 'Spanish', 'Lebanese', 'Chinese', 
    'Thai', 'Indian', 'French', 'Mexican', 'Mediterranean', 'Japanese'
  ];
  
  dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
    'Nut-Free', 'Low-Carb', 'Keto', 'Paleo'
  ];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.router.navigate(['/']);
      return;
    }
    
    // Load user preferences
    const savedPreferences = this.userService.getUserPreferences(currentUser.id);
    if (savedPreferences) {
      this.preferences = savedPreferences;
    }
  }
  
  toggleCuisine(cuisine: string): void {
    const index = this.preferences.favoriteCuisines.indexOf(cuisine);
    if (index === -1) {
      this.preferences.favoriteCuisines.push(cuisine);
    } else {
      this.preferences.favoriteCuisines.splice(index, 1);
    }
  }
  
  toggleDietaryRestriction(restriction: string): void {
    const index = this.preferences.dietaryRestrictions.indexOf(restriction);
    if (index === -1) {
      this.preferences.dietaryRestrictions.push(restriction);
    } else {
      this.preferences.dietaryRestrictions.splice(index, 1);
    }
  }
  
  savePreferences(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.userService.saveUserPreferences(currentUser.id, this.preferences);
      alert('Preferences saved successfully!');
    }
  }
}