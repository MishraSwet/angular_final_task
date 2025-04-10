import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recommended',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recommended.component.html',
  styleUrls: ['./recommended.component.css']
})
export class RecommendedComponent implements OnInit {
  recommendedRecipes: Recipe[] = [];

  constructor(
    private recipeService: RecipeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadRecommendedRecipes();
  }

  loadRecommendedRecipes(): void {
    // In a real app, this would use an algorithm to recommend recipes
    // For now, we'll just get the top-rated recipes
    const allRecipes = this.recipeService.getAllRecipes();
    this.recommendedRecipes = [...allRecipes]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10); // Get top 10 recipes
  }

  viewRecipeDetails(recipeId: string): void {
    this.router.navigate(['/recipe', recipeId]);
  }
}