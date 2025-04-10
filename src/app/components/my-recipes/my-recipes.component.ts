import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-recipes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-recipes.component.html',
  styleUrls: ['./my-recipes.component.css']
})
export class MyRecipesComponent {
  userRecipes: Recipe[] = [];

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService,
    private router: Router
  ) {
    this.loadUserRecipes();
  }

  loadUserRecipes(): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.router.navigate(['/']);
      return;
    }

    this.userRecipes = this.recipeService.getUserRecipes(currentUser.id);
  }

  viewRecipeDetails(recipeId: string): void {
    this.router.navigate(['/recipe', recipeId]);
  }

  addNewRecipe(): void {
    this.router.navigate(['/submit-recipe']);
  }
}