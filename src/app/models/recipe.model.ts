export interface Recipe {
  id: string;
  name: string;
  description: string;
  steps: string[];
  category: string;
  cuisine: string;
  ingredients: string[];
  cookingTime: number;
  difficultyLevel: string;
  userId: string;
  rating: number;
  ratingCount: number;
  imageUrl: string;
  createdAt: Date;
  tags: string[];
  dietaryRestrictions?: string;
  timeTaken?: number;
  instructions?: string;
}