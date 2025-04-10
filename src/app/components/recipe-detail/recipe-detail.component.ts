import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  recipe: Recipe | null = null;
  isOwner = false;
  isEditing = false;
  isFavorite = false;
  
  editableRecipe: Partial<Recipe> = {};
  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;
  
  newTag: string = '';
  newIngredient: string = '';
  newComment: string = '';
  
  cuisineOptions = [
    'American', 'Italian', 'Spanish', 'Lebanese', 'Chinese', 
    'Thai', 'Indian', 'French', 'Mexican', 'Mediterranean', 'Japanese'
  ];
  
  categoryOptions = [
    'Breakfast', 'Lunch', 'Dinner', 'Appetizer', 'Dessert', 
    'Snack', 'Soup', 'Salad', 'Main Course', 'Side Dish'
  ];
  
  difficultyOptions = ['Easy', 'Medium', 'Hard'];
  
  comments = [
    { id: 1, userId: 'user1', username: 'Person 1', text: 'The comment provided by Person1 will go here...', rating: 5 },
    { id: 2, userId: 'user2', username: 'Person 2', text: 'The comment provided by Person2 will go here...', rating: 4 }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const recipeId = params['id'];
      if (recipeId) {
        this.loadRecipe(recipeId);
      }
    });
  }
  
  loadRecipe(id: string): void {
    const recipe = this.recipeService.getRecipeById(id);
    if (recipe) {
      this.recipe = recipe;
      
      // Check if current user is the owner
      const currentUser = this.authService.currentUserValue;
      if (currentUser) {
        this.isOwner = recipe.userId === currentUser.id;
        this.isFavorite = this.userService.getFavorites(currentUser.id).includes(recipe.id);
      }
      
      // Initialize editable recipe
      this.editableRecipe = { ...recipe };
    } else {
      alert('Recipe not found');
      this.router.navigate(['/']);
    }
  }
  
  toggleEdit(): void {
    if (!this.isOwner) return;
    
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      // Make a copy for editing
      this.editableRecipe = { ...this.recipe };
    }
  }
  
  triggerFileInput(): void {
    if (this.isEditing) {
      this.fileInput.nativeElement.click();
    }
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
    if (this.newTag.trim() && !this.editableRecipe.tags?.includes(this.newTag.trim())) {
      if (!this.editableRecipe.tags) {
        this.editableRecipe.tags = [];
      }
      this.editableRecipe.tags.push(this.newTag.trim());
      this.newTag = '';
    }
  }
  
  removeTag(tag: string): void {
    if (this.editableRecipe.tags) {
      this.editableRecipe.tags = this.editableRecipe.tags.filter(t => t !== tag);
    }
  }
  
  addIngredient(): void {
    if (this.newIngredient.trim() && !this.editableRecipe.ingredients?.includes(this.newIngredient.trim())) {
      if (!this.editableRecipe.ingredients) {
        this.editableRecipe.ingredients = [];
      }
      this.editableRecipe.ingredients.push(this.newIngredient.trim());
      this.newIngredient = '';
    }
  }
  
  removeIngredient(ingredient: string): void {
    if (this.editableRecipe.ingredients) {
      this.editableRecipe.ingredients = this.editableRecipe.ingredients.filter(i => i !== ingredient);
    }
  }
  
  updateRecipe(): void {
    if (!this.recipe || !this.isOwner) return;
    
    // Validate form
    if (!this.editableRecipe.name || !this.editableRecipe.description) {
      alert('Recipe name and description are required');
      return;
    }
    
    // Handle image upload
    if (this.selectedFile) {
      // In a real app, you'd upload to a server
      // For now, we'll use a data URL as a placeholder
      const reader = new FileReader();
      reader.onload = () => {
        this.editableRecipe.imageUrl = reader.result as string;
        this.saveUpdatedRecipe();
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.saveUpdatedRecipe();
    }
  }
  
  saveUpdatedRecipe(): void {
    if (!this.recipe) return;
    
    const success = this.recipeService.updateRecipe({
      ...this.recipe,
      ...this.editableRecipe
    } as Recipe);
    
    if (success) {
      alert('Recipe updated successfully');
      this.isEditing = false;
      this.loadRecipe(this.recipe.id); // Reload the recipe
    } else {
      alert('Failed to update recipe');
    }
  }
  
  deleteRecipe(): void {
    if (!this.recipe || !this.isOwner) return;
    
    if (confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      const success = this.recipeService.deleteRecipe(this.recipe.id);
      if (success) {
        alert('Recipe deleted successfully');
        this.router.navigate(['/']);
      } else {
        alert('Failed to delete recipe');
      }
    }
  }
  
  toggleFavorite(): void {
    if (!this.recipe) return;
    
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      if (confirm('Please log in to save favorites. Would you like to log in now?')) {
        this.router.navigate(['/login']);
      }
      return;
    }
    
    if (this.isFavorite) {
      this.userService.removeFromFavorites(currentUser.id, this.recipe.id);
    } else {
      this.userService.addToFavorites(currentUser.id, this.recipe.id);
    }
    
    this.isFavorite = !this.isFavorite;
  }
  
  addComment(): void {
    if (!this.newComment.trim()) return;
    
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      if (confirm('Please log in to add comments. Would you like to log in now?')) {
        this.router.navigate(['/login']);
      }
      return;
    }
    
    // In a real app, you'd save this to a database
    this.comments.push({
      id: this.comments.length + 1,
      userId: currentUser.id,
      username: currentUser.username,
      text: this.newComment,
      rating: 5 // Default rating
    });
    
    this.newComment = '';
  }
  
  cancelEdit(): void {
    this.isEditing = false;
    this.imagePreviewUrl = null;
    this.selectedFile = null;
  }
}