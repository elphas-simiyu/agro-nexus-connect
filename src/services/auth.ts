import { api } from "./api";

export interface User {
  id: string;
  username: string;
  email: string;
  user_type: "farmer" | "buyer";
  first_name?: string;
  last_name?: string;
  location?: string;
  farming_type?: string;
  interests?: string[];
  farm_size?: string;
  phone?: string;
  avatar?: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  user_type: "farmer" | "buyer";
  first_name?: string;
  last_name?: string;
  location?: string;
  farming_type?: string;
  interests?: string[];
  farm_size?: string;
}

class AuthService {
  private tokenKey = "agronexus_token";
  private userKey = "agronexus_user";

  /**
   * Register new user with extended profile data
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/register", data);
      const { token, user } = response.data;
      
      this.setToken(token);
      this.setUser(user);
      
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;
      
      this.setToken(token);
      this.setUser(user);
      
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  async getMe(): Promise<User> {
    try {
      const response = await api.get("/auth/me");
      const user = response.data.user;
      this.setUser(user);
      return user;
    } catch (error) {
      console.error("Get user error:", error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await api.put("/auth/profile", data);
      const user = response.data.user;
      this.setUser(user);
      return user;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.clearAuth();
    }
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Set token in localStorage
   */
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Get stored user
   */
  getUser(): User | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Set user in localStorage
   */
  setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Check if user is farmer
   */
  isFarmer(): boolean {
    return this.getUser()?.user_type === "farmer";
  }

  /**
   * Check if user is buyer
   */
  isBuyer(): boolean {
    return this.getUser()?.user_type === "buyer";
  }

  /**
   * Clear authentication data
   */
  clearAuth(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }
}

export default new AuthService();
