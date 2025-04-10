// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly USERS_KEY = 'users';
  private readonly FAVORITES_PREFIX = 'user_favorites_';

  constructor() { }

  getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  getUserById(id: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  updateUser(updatedUser: User): boolean {
    const users = this.getUsers();
    const index = users.findIndex(user => user.id === updatedUser.id);
    
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      return true;
    }
    
    return false;
  }

  getFavorites(userId: string): string[] {
    const user = this.getUserById(userId);
    if (user && user.favorites) {
      return user.favorites;
    }
    
    // Fallback to the old storage method
    const favoritesKey = `${this.FAVORITES_PREFIX}${userId}`;
    const favorites = localStorage.getItem(favoritesKey);
    return favorites ? JSON.parse(favorites) : [];
  }

  addToFavorites(userId: string, recipeId: string): void {
    const user = this.getUserById(userId);
    if (user) {
      if (!user.favorites) {
        user.favorites = [];
      }
      
      if (!user.favorites.includes(recipeId)) {
        user.favorites.push(recipeId);
        this.updateUser(user);
      }
    }
  }

  removeFromFavorites(userId: string, recipeId: string): void {
    const user = this.getUserById(userId);
    if (user && user.favorites) {
      user.favorites = user.favorites.filter(id => id !== recipeId);
      this.updateUser(user);
    }
  }

  getUserPreferences(userId: string): any {
    const key = `user_preferences_${userId}`;
    const preferences = localStorage.getItem(key);
    return preferences ? JSON.parse(preferences) : null;
  }

  saveUserPreferences(userId: string, preferences: any): void {
    const key = `user_preferences_${userId}`;
    localStorage.setItem(key, JSON.stringify(preferences));
  }
}