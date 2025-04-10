import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { AuthService } from '../../services/auth.service';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css']
})
export class RecipeCreateComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  newRecipe: Partial<Recipe> = {
    name: '',
    description: '',
    steps: [],
    category: '',
    cuisine: '',
    ingredients: [],
    cookingTime: 0,
    difficultyLevel: '',
    tags: [],
    dietaryRestrictions: ''
  };
  
  tagInput: string = '';
  ingredientInput: string = '';
  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;
  
  cuisineOptions = [
    'American', 'Italian', 'Spanish', 'Lebanese', 'Chinese', 
    'Thai', 'Indian', 'French', 'Mexican', 'Mediterranean', 'Japanese'
  ];
  
  categoryOptions = [
    'Breakfast', 'Lunch', 'Dinner', 'Appetizer', 'Dessert', 
    'Snack', 'Soup', 'Salad', 'Main Course', 'Side Dish'
  ];
  
  difficultyOptions = ['Easy', 'Medium', 'Hard'];

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      alert('You must be logged in to create a recipe');
      this.router.navigate(['/']);
    }
  }
  
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  
  addTag(): void {
    if (this.tagInput.trim() && !this.newRecipe.tags?.includes(this.tagInput.trim())) {
      if (!this.newRecipe.tags) {
        this.newRecipe.tags = [];
      }
      this.newRecipe.tags.push(this.tagInput.trim());
      this.tagInput = '';
    }
  }
  
  removeTag(tag: string): void {
    if (this.newRecipe.tags) {
      this.newRecipe.tags = this.newRecipe.tags.filter(t => t !== tag);
    }
  }
  
  addIngredient(): void {
    if (this.ingredientInput.trim() && !this.newRecipe.ingredients?.includes(this.ingredientInput.trim())) {
      if (!this.newRecipe.ingredients) {
        this.newRecipe.ingredients = [];
      }
      this.newRecipe.ingredients.push(this.ingredientInput.trim());
      this.ingredientInput = '';
    }
  }
  
  removeIngredient(ingredient: string): void {
    if (this.newRecipe.ingredients) {
      this.newRecipe.ingredients = this.newRecipe.ingredients.filter(i => i !== ingredient);
    }
  }
  
  processDescription(): void {
    // Split description into steps if it contains line breaks
    if (this.newRecipe.description) {
      const lines = this.newRecipe.description.split('\n').filter(line => line.trim());
      if (lines.length > 1) {
        this.newRecipe.steps = lines;
      }
    }
  }
  
  submitRecipe(): void {
    // Validate form
    if (!this.newRecipe.name || !this.newRecipe.description || !this.newRecipe.category || 
        !this.newRecipe.cuisine || !this.newRecipe.cookingTime) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Process description into steps
    this.processDescription();
    
    // Add user ID
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      alert('You must be logged in to create a recipe');
      return;
    }
    
    this.newRecipe.userId = currentUser.id;
    
    // Handle image upload
    if (this.selectedFile) {
      // In a real app, you'd upload to a server
      // For now, we'll use a data URL as a placeholder
      const reader = new FileReader();
      reader.onload = () => {
        this.newRecipe.imageUrl = reader.result as string;
        this.saveRecipe();
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      // Use a placeholder image
      this.newRecipe.imageUrl = 'assets/recipe-placeholder.jpg';
      this.saveRecipe();
    }
  }
  
  saveRecipe(): void {
    const recipeId = this.recipeService.addRecipe(this.newRecipe as Recipe);
    alert('Recipe created successfully!');
    this.router.navigate(['/recipe', recipeId]);
  }
  
  cancel(): void {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      this.router.navigate(['/']);
    }
  }
}