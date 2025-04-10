import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private readonly STORAGE_KEY = 'recipes';

  constructor() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }
  }

  getAllRecipes(): Recipe[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  }

  getRecipeById(id: string): Recipe | undefined {
    const recipes = this.getAllRecipes();
    return recipes.find(recipe => recipe.id === id);
  }

  getRecipesByUser(userId: string): Recipe[] {
    const recipes = this.getAllRecipes();
    return recipes.filter(recipe => recipe.userId === userId);
  }

  getFavoriteRecipes(favoriteIds: string[]): Recipe[] {
    const recipes = this.getAllRecipes();
    return recipes.filter(recipe => favoriteIds.includes(recipe.id));
  }

  addRecipe(recipe: Recipe): string {
    const recipes = this.getAllRecipes();
    const newRecipe = {
      ...recipe,
      id: uuidv4(),
      rating: 0,
      ratingCount: 0,
      createdAt: new Date()
    };
    
    recipes.push(newRecipe);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recipes));
    return newRecipe.id;
  }

  updateRecipe(recipe: Recipe): boolean {
    const recipes = this.getAllRecipes();
    const index = recipes.findIndex(r => r.id === recipe.id);
    
    if (index !== -1) {
      recipes[index] = recipe;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recipes));
      return true;
    }
    return false;
  }

  deleteRecipe(id: string): boolean {
    const recipes = this.getAllRecipes();
    const filteredRecipes = recipes.filter(recipe => recipe.id !== id);
    
    if (filteredRecipes.length !== recipes.length) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredRecipes));
      return true;
    }
    return false;
  }

  rateRecipe(id: string, rating: number): boolean {
    const recipe = this.getRecipeById(id);
    if (recipe) {
      const totalRating = recipe.rating * recipe.ratingCount;
      recipe.ratingCount += 1;
      recipe.rating = (totalRating + rating) / recipe.ratingCount;
      return this.updateRecipe(recipe);
    }
    return false;
  }

  filterRecipes(category?: string, cuisine?: string, cookingTime?: number, difficulty?: string): Recipe[] {
    let recipes = this.getAllRecipes();
    
    if (category) {
      recipes = recipes.filter(r => r.category === category);
    }
    
    if (cuisine) {
      recipes = recipes.filter(r => r.cuisine === cuisine);
    }
    
    if (cookingTime) {
      recipes = recipes.filter(r => r.cookingTime <= cookingTime);
    }
    
    if (difficulty) {
      recipes = recipes.filter(r => r.difficultyLevel === difficulty);
    }
    
    return recipes;
  }

  sortRecipes(recipes: Recipe[], sortBy: 'popularity' | 'latest'): Recipe[] {
    if (sortBy === 'popularity') {
      return [...recipes].sort((a, b) => b.rating - a.rating);
    } else {
      return [...recipes].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
  }
}