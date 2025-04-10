import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent {
  favoriteRecipes: Recipe[] = [];

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.loadFavorites();
  }

  loadFavorites(): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.router.navigate(['/']);
      return;
    }

    const favoriteIds = this.userService.getFavorites(currentUser.id);
    this.favoriteRecipes = favoriteIds
      .map(id => this.recipeService.getRecipeById(id))
      .filter(recipe => recipe !== null) as Recipe[];
  }

  viewRecipeDetails(recipeId: string): void {
    this.router.navigate(['/recipe', recipeId]);
  }

  browseCookbook(): void {
    this.router.navigate(['/']);
  }
}