// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'currentUser';
  private readonly USERS_KEY = 'users';
  
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor() {
    const storedUser = localStorage.getItem(this.STORAGE_KEY);
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  register(user: any): boolean {
    const users = this.getUsers();
    
    // Check if email already exists
    if (users.some(u => u.email === user.email)) {
      return false;
    }
    
    // Create a new user with a unique ID
    const newUser: User = {
      id: this.generateUserId(),
      email: user.email,
      username: user.email.split('@')[0], // Generate username from email
      password: user.password, // In a real app, you'd hash this
      firstName: user.firstName,
      lastName: user.lastName,
      country: user.country,
      region: user.region,
      profileImage: user.profileImage || 'assets/default-profile.png',
      favorites: [] // Initialize with empty favorites
    };
    
    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    
    // Auto login after registration
    this.setCurrentUser(newUser);
    
    return true;
  }

  login(email: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      this.setCurrentUser(user);
      return true;
    }
    
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  private setCurrentUser(user: User): void {
    // Remove password before storing in local storage
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userWithoutPassword));
    this.currentUserSubject.next(userWithoutPassword as User);
  }

  private getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  private generateUserId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }
}