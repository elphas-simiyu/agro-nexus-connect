import { api } from "./api";

export interface WeatherForecast {
  date: string;
  temperature: { min: number; max: number };
  condition: string;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  icon: string;
}

export interface CropRecommendation {
  id: string;
  name: string;
  season: string;
  plantingWindow: { start: string; end: string };
  harvestTime: string;
  profitPotential: "high" | "medium" | "low";
  waterRequirement: "high" | "medium" | "low";
  description: string;
  tips: string[];
  marketDemand: number; // 1-100
}

export interface MarketInsight {
  id: string;
  crop: string;
  currentPrice: number;
  priceChange: number;
  trend: "up" | "down" | "stable";
  demandLevel: "high" | "medium" | "low";
  bestSellingTime: string;
  region: string;
}

export interface FarmingTip {
  id: string;
  title: string;
  category: string;
  content: string;
  priority: "high" | "medium" | "low";
  seasonRelevance: string[];
}

export interface PestAlert {
  id: string;
  pestName: string;
  affectedCrops: string[];
  severity: "critical" | "warning" | "info";
  description: string;
  prevention: string[];
  treatment: string[];
  region: string;
}

export interface AIInsightResponse {
  message: string;
  recommendations?: CropRecommendation[];
  marketInsights?: MarketInsight[];
  tips?: FarmingTip[];
}

class InsightsService {
  /**
   * Get weather forecast for user's location
   */
  async getWeatherForecast(location: string, days: number = 7): Promise<WeatherForecast[]> {
    try {
      const response = await api.get("/insights/weather-forecast", {
        params: { location, days },
      });
      return response.data.forecast;
    } catch (error) {
      console.error("Weather forecast error:", error);
      throw error;
    }
  }

  /**
   * Get crop recommendations based on location, season, and user preferences
   */
  async getCropRecommendations(params: {
    location: string;
    farmingType?: string;
    interests?: string[];
    farmSize?: string;
  }): Promise<CropRecommendation[]> {
    try {
      const response = await api.get("/insights/crop-recommendations", { params });
      return response.data.recommendations;
    } catch (error) {
      console.error("Crop recommendations error:", error);
      throw error;
    }
  }

  /**
   * Get market insights and price trends
   */
  async getMarketInsights(params: {
    location: string;
    crops?: string[];
  }): Promise<MarketInsight[]> {
    try {
      const response = await api.get("/insights/market", { params });
      return response.data.insights;
    } catch (error) {
      console.error("Market insights error:", error);
      throw error;
    }
  }

  /**
   * Get pest and disease alerts for the region
   */
  async getPestAlerts(location: string): Promise<PestAlert[]> {
    try {
      const response = await api.get("/insights/pest-alerts", {
        params: { location },
      });
      return response.data.alerts;
    } catch (error) {
      console.error("Pest alerts error:", error);
      throw error;
    }
  }

  /**
   * Get personalized farming tips
   */
  async getFarmingTips(params: {
    farmingType?: string;
    interests?: string[];
    season?: string;
  }): Promise<FarmingTip[]> {
    try {
      const response = await api.get("/insights/farming-tips", { params });
      return response.data.tips;
    } catch (error) {
      console.error("Farming tips error:", error);
      throw error;
    }
  }

  /**
   * Chat with AI for farming insights (uses OpenAI)
   */
  async chatWithAI(params: {
    message: string;
    context: {
      location?: string;
      farmingType?: string;
      interests?: string[];
      weather?: any;
    };
    history?: { role: "user" | "assistant"; content: string }[];
  }): Promise<AIInsightResponse> {
    try {
      const response = await api.post("/insights/ai-chat", params);
      return response.data;
    } catch (error) {
      console.error("AI chat error:", error);
      throw error;
    }
  }

  /**
   * Get planting calendar for the region
   */
  async getPlantingCalendar(location: string): Promise<any> {
    try {
      const response = await api.get("/insights/planting-calendar", {
        params: { location },
      });
      return response.data.calendar;
    } catch (error) {
      console.error("Planting calendar error:", error);
      throw error;
    }
  }

  /**
   * Get soil recommendations
   */
  async getSoilRecommendations(params: {
    location: string;
    cropType?: string;
  }): Promise<any> {
    try {
      const response = await api.get("/insights/soil-recommendations", { params });
      return response.data;
    } catch (error) {
      console.error("Soil recommendations error:", error);
      throw error;
    }
  }
}

export default new InsightsService();
