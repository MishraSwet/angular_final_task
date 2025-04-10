// src/app/models/user.model.ts
export interface User {
  id: string;
  email: string;
  username: string; // Keep username for backward compatibility
  password?: string; // Optional because we don't want to include it in the stored user
  firstName: string;
  lastName: string;
  country?: string;
  region?: string;
  profileImage?: string;
  favorites: string[]; // Array of recipe IDs that the user has favorited
}