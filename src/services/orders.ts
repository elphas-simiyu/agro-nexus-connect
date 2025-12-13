import { api } from "./api";
import { CartItem } from "@/contexts/CartContext";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  farmerId: string;
  farmerName: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  county: string;
  postalCode?: string;
  notes?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: "paystack" | "wallet" | "cod";
  paymentReference?: string;
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: "paystack" | "wallet" | "cod";
}

class OrdersService {
  /**
   * Create a new order
   */
  async createOrder(data: CreateOrderData): Promise<Order> {
    try {
      const response = await api.post("/orders", data);
      return response.data.order;
    } catch (error) {
      console.error("Create order error:", error);
      throw error;
    }
  }

  /**
   * Get user's orders
   */
  async getOrders(params?: { status?: string; page?: number; limit?: number }): Promise<{
    orders: Order[];
    total: number;
    page: number;
    pages: number;
  }> {
    try {
      const response = await api.get("/orders", { params });
      return response.data;
    } catch (error) {
      console.error("Get orders error:", error);
      throw error;
    }
  }

  /**
   * Get single order by ID
   */
  async getOrder(orderId: string): Promise<Order> {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data.order;
    } catch (error) {
      console.error("Get order error:", error);
      throw error;
    }
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`, { reason });
      return response.data.order;
    } catch (error) {
      console.error("Cancel order error:", error);
      throw error;
    }
  }

  /**
   * Get farmer's orders (for farmer dashboard)
   */
  async getFarmerOrders(params?: { status?: string; page?: number; limit?: number }): Promise<{
    orders: Order[];
    total: number;
    page: number;
    pages: number;
  }> {
    try {
      const response = await api.get("/orders/farmer", { params });
      return response.data;
    } catch (error) {
      console.error("Get farmer orders error:", error);
      throw error;
    }
  }

  /**
   * Update order status (for farmers)
   */
  async updateOrderStatus(
    orderId: string,
    status: Order["status"],
    trackingNumber?: string
  ): Promise<Order> {
    try {
      const response = await api.put(`/orders/${orderId}/status`, {
        status,
        trackingNumber,
      });
      return response.data.order;
    } catch (error) {
      console.error("Update order status error:", error);
      throw error;
    }
  }

  /**
   * Track order
   */
  async trackOrder(orderId: string): Promise<{
    order: Order;
    timeline: { status: string; timestamp: string; description: string }[];
  }> {
    try {
      const response = await api.get(`/orders/${orderId}/track`);
      return response.data;
    } catch (error) {
      console.error("Track order error:", error);
      throw error;
    }
  }
}

export default new OrdersService();
