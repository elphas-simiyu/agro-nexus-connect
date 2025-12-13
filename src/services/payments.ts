import { api } from "./api";

export interface PaystackInitializeResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface PaymentVerificationResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    status: string;
    reference: string;
    amount: number;
    paid_at: string;
    channel: string;
    currency: string;
    customer: {
      email: string;
      customer_code: string;
    };
    metadata: any;
  };
}

export interface OrderPayment {
  orderId: string;
  amount: number;
  email: string;
  currency?: string;
  metadata?: Record<string, any>;
  callbackUrl?: string;
}

class PaymentsService {
  /**
   * Initialize Paystack payment
   */
  async initializePayment(data: OrderPayment): Promise<PaystackInitializeResponse> {
    try {
      const response = await api.post("/payments/initialize", {
        ...data,
        currency: data.currency || "KES",
        callback_url: data.callbackUrl || `${window.location.origin}/payment/verify`,
      });
      return response.data;
    } catch (error) {
      console.error("Payment initialization error:", error);
      throw error;
    }
  }

  /**
   * Verify payment after callback
   */
  async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
    try {
      const response = await api.get(`/payments/verify/${reference}`);
      return response.data;
    } catch (error) {
      console.error("Payment verification error:", error);
      throw error;
    }
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(): Promise<any[]> {
    try {
      const response = await api.get("/payments/history");
      return response.data.payments;
    } catch (error) {
      console.error("Payment history error:", error);
      throw error;
    }
  }

  /**
   * Initialize wallet funding
   */
  async fundWallet(amount: number, email: string): Promise<PaystackInitializeResponse> {
    try {
      const response = await api.post("/payments/wallet/fund", {
        amount,
        email,
        callback_url: `${window.location.origin}/wallet/verify`,
      });
      return response.data;
    } catch (error) {
      console.error("Wallet funding error:", error);
      throw error;
    }
  }

  /**
   * Get wallet balance
   */
  async getWalletBalance(): Promise<{ balance: number; currency: string }> {
    try {
      const response = await api.get("/payments/wallet/balance");
      return response.data;
    } catch (error) {
      console.error("Wallet balance error:", error);
      throw error;
    }
  }

  /**
   * Pay from wallet
   */
  async payFromWallet(orderId: string, amount: number): Promise<any> {
    try {
      const response = await api.post("/payments/wallet/pay", { orderId, amount });
      return response.data;
    } catch (error) {
      console.error("Wallet payment error:", error);
      throw error;
    }
  }
}

export default new PaymentsService();
