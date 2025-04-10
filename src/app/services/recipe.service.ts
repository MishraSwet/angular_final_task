import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { v4 as uuidv4 } from 'uuid'; // You might need to install this: npm install uuid

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private readonly STORAGE_KEY = 'recipes';

  constructor() { }

  getAllRecipes(): Recipe[] {
    const recipes = localStorage.getItem(this.STORAGE_KEY);
    return recipes ? JSON.parse(recipes) : [];
  }

  getRecipeById(id: string): Recipe | null {
    const recipes = this.getAllRecipes();
    return recipes.find(recipe => recipe.id === id) || null;
  }

  getUserRecipes(userId: string): Recipe[] {
    const recipes = this.getAllRecipes();
    return recipes.filter(recipe => recipe.userId === userId);
  }

  addRecipe(recipe: Recipe): string {
    const recipes = this.getAllRecipes();
    
    // Generate ID if not provided
    if (!recipe.id) {
      recipe.id = uuidv4();
    }
    
    // Set creation date if not provided
    if (!recipe.createdAt) {
      recipe.createdAt = new Date();
    }
    
    // Initialize rating if not provided
    if (recipe.rating === undefined) {
      recipe.rating = 0;
    }
    
    // Initialize rating count if not provided
    if (recipe.ratingCount === undefined) {
      recipe.ratingCount = 0;
    }
    
    recipes.push(recipe);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recipes));
    
    return recipe.id;
  }

  updateRecipe(updatedRecipe: Recipe): boolean {
    const recipes = this.getAllRecipes();
    const index = recipes.findIndex(recipe => recipe.id === updatedRecipe.id);
    
    if (index !== -1) {
      recipes[index] = updatedRecipe;
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

  searchRecipes(query: string): Recipe[] {
    if (!query.trim()) return this.getAllRecipes();
    
    query = query.toLowerCase();
    const recipes = this.getAllRecipes();
    
    return recipes.filter(recipe => 
      recipe.name.toLowerCase().includes(query) ||
      recipe.description.toLowerCase().includes(query) ||
      recipe.cuisine.toLowerCase().includes(query) ||
      recipe.category.toLowerCase().includes(query) ||
      recipe.ingredients.some(i => i.toLowerCase().includes(query)) ||
      (recipe.tags && recipe.tags.some(t => t.toLowerCase().includes(query)))
    );
  }
}