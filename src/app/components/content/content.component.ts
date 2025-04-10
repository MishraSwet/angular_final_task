import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit, AfterViewInit {
  @ViewChild('cuisineContainer') cuisineContainer!: ElementRef;
  
  allRecipes: Recipe[] = [];
  displayedRecipes: Recipe[] = [];
  showFilters = false;
  showSortOptions = false;
  selectedCuisine: string = '';
  
  // Slider variables
  cuisineScrollPosition = 0;
  maxScrollPosition = 0;
  scrollAmount = 300;
  
  // Filter variables
  filterCuisine: string = '';
  filterCategory: string = '';
  filterCookingTime: number | null = null;
  filterDifficulty: string = '';
  sortBy: 'popularity' | 'latest' = 'popularity';
  
  cuisines = [
    'American', 'Italian', 'Spanish', 'Lebanese', 'Chinese', 
    'Thai', 'Indian', 'French', 'Mexican', 'Mediterranean', 'Japanese'
  ];
  
  categories = [
    'Breakfast', 'Lunch', 'Dinner', 'Appetizer', 'Dessert', 
    'Snack', 'Soup', 'Salad', 'Main Course', 'Side Dish'
  ];

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadRecipes();
    
    // If we don't have any recipes yet, let's create some sample data
    if (this.allRecipes.length === 0) {
      this.createSampleRecipes();
      this.loadRecipes();
    }
  }
  
  ngAfterViewInit(): void {
    // Calculate max scroll position after view is initialized
    setTimeout(() => {
      this.calculateMaxScrollPosition();
    }, 500);
    
    // Recalculate on window resize
    window.addEventListener('resize', () => {
      this.calculateMaxScrollPosition();
    });
  }
  
  calculateMaxScrollPosition(): void {
    if (this.cuisineContainer) {
      const containerWidth = this.cuisineContainer.nativeElement.clientWidth;
      const scrollWidth = this.cuisineContainer.nativeElement.scrollWidth;
      this.maxScrollPosition = scrollWidth - containerWidth;
    }
  }
  
  slideCuisines(direction: 'prev' | 'next'): void {
    if (!this.cuisineContainer) return;
    
    const container = this.cuisineContainer.nativeElement;
    
    if (direction === 'prev') {
      this.cuisineScrollPosition = Math.max(0, this.cuisineScrollPosition - this.scrollAmount);
    } else {
      this.cuisineScrollPosition = Math.min(this.maxScrollPosition, this.cuisineScrollPosition + this.scrollAmount);
    }
    
    container.scrollLeft = this.cuisineScrollPosition;
  }

  loadRecipes(): void {
    this.allRecipes = this.recipeService.getAllRecipes();
    this.displayedRecipes = [...this.allRecipes];
    this.applySorting();
  }

  createSampleRecipes(): void {
    const sampleRecipes: Partial<Recipe>[] = [
      {
        name: 'Spaghetti Carbonara',
        category: 'Main Course',
        cuisine: 'Italian',
        ingredients: ['Pasta', 'Eggs', 'Pancetta', 'Parmesan', 'Black Pepper'],
        instructions: 'Cook pasta, mix eggs with cheese, combine with hot pasta, add pancetta.',
        cookingTime: 25,
        difficultyLevel: 'Medium',
        userId: 'sample',
        rating: 4.8,
        ratingCount: 1243,
        imageUrl: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Chicken Tikka Masala',
        category: 'Main Course',
        cuisine: 'Indian',
        ingredients: ['Chicken', 'Yogurt', 'Tomato Sauce', 'Spices', 'Cream'],
        instructions: 'Marinate chicken in yogurt and spices, grill, then simmer in tomato sauce.',
        cookingTime: 45,
        difficultyLevel: 'Medium',
        userId: 'sample',
        rating: 4.7,
        ratingCount: 987,
        imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Avocado Toast',
        category: 'Breakfast',
        cuisine: 'American',
        ingredients: ['Bread', 'Avocado', 'Salt', 'Pepper', 'Lemon Juice'],
        instructions: 'Toast bread, mash avocado with lemon juice, spread on toast, season.',
        cookingTime: 10,
        difficultyLevel: 'Easy',
        userId: 'sample',
        rating: 4.5,
        ratingCount: 756,
        imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Pad Thai',
        category: 'Main Course',
        cuisine: 'Thai',
        ingredients: ['Rice Noodles', 'Shrimp', 'Tofu', 'Bean Sprouts', 'Peanuts'],
        instructions: 'Stir-fry noodles with sauce, add proteins and vegetables, garnish with peanuts.',
        cookingTime: 30,
        difficultyLevel: 'Medium',
        userId: 'sample',
        rating: 4.6,
        ratingCount: 1098,
        imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Chocolate Chip Cookies',
        category: 'Dessert',
        cuisine: 'American',
        ingredients: ['Flour', 'Butter', 'Sugar', 'Chocolate Chips', 'Eggs'],
        instructions: 'Mix ingredients, form cookies, bake until golden.',
        cookingTime: 20,
        difficultyLevel: 'Easy',
        userId: 'sample',
        rating: 4.9,
        ratingCount: 2145,
        imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Beef Tacos',
        category: 'Main Course',
        cuisine: 'Mexican',
        ingredients: ['Ground Beef', 'Taco Shells', 'Lettuce', 'Tomato', 'Cheese'],
        instructions: 'Cook seasoned beef, assemble in shells with toppings.',
        cookingTime: 25,
        difficultyLevel: 'Easy',
        userId: 'sample',
        rating: 4.7,
        ratingCount: 876,
        imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
      }
    ];

    sampleRecipes.forEach(recipe => {
      this.recipeService.addRecipe(recipe as Recipe);
    });
  }

  selectCuisine(cuisine: string): void {
    if (this.selectedCuisine === cuisine) {
      this.selectedCuisine = '';
      this.filterCuisine = '';
    } else {
      this.selectedCuisine = cuisine;
      this.filterCuisine = cuisine;
    }
    this.applyFilters();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    this.showSortOptions = false;
  }

  toggleSortOptions(): void {
    this.showSortOptions = !this.showSortOptions;
    if (this.showSortOptions) {
      this.showFilters = true;
    }
  }

  applyFilters(): void {
    let filteredRecipes = this.allRecipes;
    
    if (this.filterCuisine) {
      filteredRecipes = filteredRecipes.filter(r => r.cuisine === this.filterCuisine);
    }
    
    if (this.filterCategory) {
      filteredRecipes = filteredRecipes.filter(r => r.category === this.filterCategory);
    }
    
    if (this.filterCookingTime) {
      filteredRecipes = filteredRecipes.filter(r => r.cookingTime <= this.filterCookingTime!);
    }
    
    if (this.filterDifficulty) {
      filteredRecipes = filteredRecipes.filter(r => r.difficultyLevel === this.filterDifficulty);
    }
    
    this.displayedRecipes = filteredRecipes;
    this.applySorting();
  }

  applySorting(): void {
    if (this.sortBy === 'popularity') {
      this.displayedRecipes = [...this.displayedRecipes].sort((a, b) => b.rating - a.rating);
    } else {
      this.displayedRecipes = [...this.displayedRecipes].sort((a, b) => 
        new Date(b.createdAt || new Date()).getTime() - new Date(a.createdAt || new Date()).getTime()
      );
    }
  }

  resetFilters(): void {
    this.filterCuisine = '';
    this.filterCategory = '';
    this.filterCookingTime = null;
    this.filterDifficulty = '';
    this.selectedCuisine = '';
    this.sortBy = 'popularity';
    this.displayedRecipes = [...this.allRecipes];
    this.applySorting();
  }

  toggleFavorite(recipeId: string): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      if (this.isFavorite(recipeId)) {
        this.userService.removeFromFavorites(currentUser.id, recipeId);
      } else {
        this.userService.addToFavorites(currentUser.id, recipeId);
      }
    } else {
      // Prompt to login
      if (confirm('Please log in to save favorites. Would you like to log in now?')) {
        this.router.navigate(['/login']);
      }
    }
  }

  isFavorite(recipeId: string): boolean {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return false;
    
    const favorites = this.userService.getFavorites(currentUser.id);
    return favorites.includes(recipeId);
  }

  viewRecipeDetails(recipeId: string): void {
    this.router.navigate(['/recipe', recipeId]);
  }

  formatRatingCount(count: number): string {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  }
}