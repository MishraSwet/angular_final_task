// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { ContentComponent } from './components/content/content.component';
import { RecipeCreateComponent } from './components/recipe-create/recipe-create.component';
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { MyRecipesComponent } from './components/my-recipes/my-recipes.component';
import { RecommendedComponent } from './components/recommended/recommended.component';
import { PreferencesComponent } from './components/preferences/preferences.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: ContentComponent },
  { path: 'submit-recipe', component: RecipeCreateComponent, canActivate: [AuthGuard] },
  { path: 'recipe/:id', component: RecipeDetailComponent },
  { path: 'favorites', component: FavoritesComponent, canActivate: [AuthGuard] },
  { path: 'my-recipes', component: MyRecipesComponent, canActivate: [AuthGuard] },
  { path: 'recommended', component: RecommendedComponent },
  { path: 'preferences', component: PreferencesComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' } // Redirect any unknown paths to home
];