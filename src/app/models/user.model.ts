export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  region?: string;
  favorites: string[];
  profileImage?: string;
}