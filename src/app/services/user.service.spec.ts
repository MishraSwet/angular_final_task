import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly STORAGE_KEY = 'users';

  constructor() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }
  }

  getAllUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  }

  getUserById(id: string): User | undefined {
    const users = this.getAllUsers();
    return users.find(user => user.id === id);
  }

  addUser(user: User): boolean {
    const users = this.getAllUsers();
    
    // Check if email already exists
    if (users.some(u => u.email === user.email)) {
      return false;
    }
    
    // Add new user with ID
    const newUser = {
      ...user,
      id: uuidv4(),
      favorites: []
    };
    
    users.push(newUser);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    return true;
  }

  updateUser(user: User): boolean {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === user.id);
    
    if (index !== -1) {
      users[index] = user;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
      return true;
    }
    return false;
  }

  addToFavorites(userId: string, recipeId: string): boolean {
    const user = this.getUserById(userId);
    if (user) {
      if (!user.favorites.includes(recipeId)) {
        user.favorites.push(recipeId);
        return this.updateUser(user);
      }
    }
    return false;
  }

  removeFromFavorites(userId: string, recipeId: string): boolean {
    const user = this.getUserById(userId);
    if (user) {
      user.favorites = user.favorites.filter(id => id !== recipeId);
      return this.updateUser(user);
    }
    return false;
  }
}