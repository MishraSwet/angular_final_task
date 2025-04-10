export interface Recipe {
    id: string;
    name: string;
    category: string;
    cuisine: string;
    ingredients: string[];
    instructions: string;
    cookingTime: number;
    difficultyLevel: string;
    userId: string;
    rating: number;
    ratingCount: number;
    imageUrl: string;
    createdAt: Date;
  }