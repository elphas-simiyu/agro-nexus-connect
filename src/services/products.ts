import { api, fetcher } from "./api";

export interface Product {
  id: string;
  name: string;
  description?: string;
  farmerId: string;
  farmer: string;
  farmerAvatar?: string;
  location: string;
  price: number;
  unit: string;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  category: string;
  available: number;
  organic: boolean;
  certified?: boolean;
  harvestDate?: string;
  expiryDate?: string;
  minOrder?: number;
  maxOrder?: number;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  category?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  organic?: boolean;
  location?: string;
  farmerId?: string;
  sortBy?: "price" | "rating" | "newest" | "popularity";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pages: number;
}

class ProductsService {
  /**
   * Get all products with optional filters
   */
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    try {
      const response = await api.get("/products", { params: filters });
      return response.data.products || response.data;
    } catch (error) {
      console.error("Get products error:", error);
      throw error;
    }
  }

  /**
   * Get products with pagination
   */
  async getProductsPaginated(filters?: ProductFilters): Promise<ProductsResponse> {
    try {
      const response = await api.get("/products", { params: filters });
      return response.data;
    } catch (error) {
      console.error("Get products error:", error);
      throw error;
    }
  }

  /**
   * Get single product by ID
   */
  async getProduct(id: string): Promise<Product> {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data.product || response.data;
    } catch (error) {
      console.error("Get product error:", error);
      throw error;
    }
  }

  /**
   * Create a new product (for farmers)
   */
  async createProduct(data: Partial<Product>): Promise<Product> {
    try {
      const response = await api.post("/products", data);
      return response.data.product;
    } catch (error) {
      console.error("Create product error:", error);
      throw error;
    }
  }

  /**
   * Update a product (for farmers)
   */
  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    try {
      const response = await api.put(`/products/${id}`, data);
      return response.data.product;
    } catch (error) {
      console.error("Update product error:", error);
      throw error;
    }
  }

  /**
   * Delete a product (for farmers)
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      console.error("Delete product error:", error);
      throw error;
    }
  }

  /**
   * Get farmer's products
   */
  async getFarmerProducts(farmerId?: string): Promise<Product[]> {
    try {
      const response = await api.get("/products/farmer", {
        params: farmerId ? { farmerId } : {},
      });
      return response.data.products;
    } catch (error) {
      console.error("Get farmer products error:", error);
      throw error;
    }
  }

  /**
   * Get product categories
   */
  async getCategories(): Promise<{ id: string; name: string; count: number }[]> {
    try {
      const response = await api.get("/products/categories");
      return response.data.categories;
    } catch (error) {
      console.error("Get categories error:", error);
      throw error;
    }
  }

  /**
   * Search products
   */
  async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await api.get("/products/search", { params: { q: query } });
      return response.data.products;
    } catch (error) {
      console.error("Search products error:", error);
      throw error;
    }
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit: number = 6): Promise<Product[]> {
    try {
      const response = await api.get("/products/featured", { params: { limit } });
      return response.data.products;
    } catch (error) {
      console.error("Get featured products error:", error);
      throw error;
    }
  }
}

export default new ProductsService();
