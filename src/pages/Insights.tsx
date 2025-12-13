import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import insightsService, { 
  CropRecommendation, 
  MarketInsight, 
  PestAlert,
  FarmingTip 
} from "@/services/insights";
import { 
  Leaf, 
  Cloud, 
  TrendingUp, 
  AlertTriangle,
  Lightbulb,
  MessageCircle,
  Send,
  Loader,
  Calendar,
  Droplets,
  Sun,
  ThermometerSun,
  Wind,
  MapPin,
  BarChart3,
  Bug,
  Sprout,
  Lock,
  ArrowRight
} from "lucide-react";
import { AuthModal } from "@/components/AuthModal";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const Insights = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Hello! I'm your AI farming assistant. Ask me anything about crops, weather patterns, pest control, market trends, or farming best practices. I'm here to help you make informed decisions!",
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Fetch insights data
  const { data: weatherForecast = [], isLoading: weatherLoading } = useQuery({
    queryKey: ["insights", "weather", user?.location],
    queryFn: () => insightsService.getWeatherForecast(user?.location || "Kenya", 7),
    enabled: isAuthenticated && !!user?.location,
  });

  const { data: cropRecommendations = [], isLoading: cropsLoading } = useQuery({
    queryKey: ["insights", "crops", user?.location, user?.farming_type],
    queryFn: () => insightsService.getCropRecommendations({
      location: user?.location || "Kenya",
      farmingType: user?.farming_type,
      interests: user?.interests,
      farmSize: user?.farm_size,
    }),
    enabled: isAuthenticated,
  });

  const { data: marketInsights = [], isLoading: marketLoading } = useQuery({
    queryKey: ["insights", "market", user?.location],
    queryFn: () => insightsService.getMarketInsights({
      location: user?.location || "Kenya",
    }),
    enabled: isAuthenticated,
  });

  const { data: pestAlerts = [], isLoading: pestsLoading } = useQuery({
    queryKey: ["insights", "pests", user?.location],
    queryFn: () => insightsService.getPestAlerts(user?.location || "Kenya"),
    enabled: isAuthenticated,
  });

  const { data: farmingTips = [], isLoading: tipsLoading } = useQuery({
    queryKey: ["insights", "tips", user?.farming_type],
    queryFn: () => insightsService.getFarmingTips({
      farmingType: user?.farming_type,
      interests: user?.interests,
    }),
    enabled: isAuthenticated,
  });

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: chatInput,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await insightsService.chatWithAI({
        message: chatInput,
        context: {
          location: user?.location,
          farmingType: user?.farming_type,
          interests: user?.interests,
        },
        history: chatMessages.map((m) => ({ role: m.role, content: m.content })),
      });

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again or contact support if the issue persists.",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Show login required state
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-20">
            <Card variant="elevated" className="max-w-md mx-auto text-center p-8">
              <Lock className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
              <h1 className="font-display font-bold text-2xl mb-4">Insights Access Required</h1>
              <p className="text-muted-foreground mb-6">
                Sign in to access personalized farming insights, AI recommendations, weather forecasts, and market trends tailored to your location and interests.
              </p>
              <Button variant="hero" size="lg" onClick={() => setAuthOpen(true)}>
                Sign In to Continue
              </Button>
            </Card>
          </div>
        </main>
        <Footer />
        <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        {/* Hero */}
        <section className="bg-gradient-hero py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-primary-foreground/80" />
              <span className="text-primary-foreground/80">{user?.location || "Set your location in profile"}</span>
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-primary-foreground mb-2">
              Farming Insights & AI Assistant
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              Personalized recommendations based on your location, interests, and current conditions
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Weather Forecast */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-sky" />
                    7-Day Weather Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {weatherLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : weatherForecast.length > 0 ? (
                    <div className="grid grid-cols-7 gap-2">
                      {weatherForecast.map((day: any, idx: number) => (
                        <div key={idx} className="text-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                          <p className="text-xs text-muted-foreground mb-2">{day.date}</p>
                          <Sun className="w-6 h-6 mx-auto text-harvest mb-2" />
                          <p className="font-semibold text-sm">{day.temperature?.max}°</p>
                          <p className="text-xs text-muted-foreground">{day.temperature?.min}°</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Cloud className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Weather data will appear once your location is set</p>
                      <p className="text-sm">Update your profile to see forecasts</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Crop Recommendations */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-leaf" />
                    Recommended Crops for Your Area
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {cropsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : cropRecommendations.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {cropRecommendations.map((crop: CropRecommendation) => (
                        <div key={crop.id} className="p-4 rounded-xl bg-muted/50 border border-border">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-display font-bold">{crop.name}</h4>
                            <Badge variant={crop.profitPotential === "high" ? "success" : crop.profitPotential === "medium" ? "warning" : "secondary"}>
                              {crop.profitPotential} profit
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{crop.description}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{crop.season}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Droplets className="w-3 h-3" />
                              <span>{crop.waterRequirement} water</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Sprout className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No crop recommendations available yet</p>
                      <p className="text-sm">Complete your profile to get personalized suggestions</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Market Insights */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Market Trends & Price Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {marketLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : marketInsights.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Crop</th>
                            <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Price (KES)</th>
                            <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Trend</th>
                            <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Demand</th>
                          </tr>
                        </thead>
                        <tbody>
                          {marketInsights.map((insight: MarketInsight) => (
                            <tr key={insight.id} className="border-b border-border/50">
                              <td className="py-3 px-2 font-medium">{insight.crop}</td>
                              <td className="py-3 px-2">{insight.currentPrice}</td>
                              <td className="py-3 px-2">
                                <span className={`flex items-center gap-1 ${insight.trend === "up" ? "text-leaf" : insight.trend === "down" ? "text-destructive" : "text-muted-foreground"}`}>
                                  <TrendingUp className={`w-4 h-4 ${insight.trend === "down" ? "rotate-180" : ""}`} />
                                  {insight.priceChange}%
                                </span>
                              </td>
                              <td className="py-3 px-2">
                                <Badge variant={insight.demandLevel === "high" ? "success" : insight.demandLevel === "medium" ? "warning" : "secondary"}>
                                  {insight.demandLevel}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Market insights will be available soon</p>
                      <p className="text-sm">Check back for price trends and demand analysis</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pest Alerts */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bug className="w-5 h-5 text-destructive" />
                    Pest & Disease Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pestsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : pestAlerts.length > 0 ? (
                    <div className="space-y-4">
                      {pestAlerts.map((alert: PestAlert) => (
                        <div 
                          key={alert.id} 
                          className={`p-4 rounded-xl border ${
                            alert.severity === "critical" ? "bg-destructive/10 border-destructive/30" :
                            alert.severity === "warning" ? "bg-harvest/10 border-harvest/30" :
                            "bg-muted/50 border-border"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
                              alert.severity === "critical" ? "text-destructive" :
                              alert.severity === "warning" ? "text-harvest" :
                              "text-muted-foreground"
                            }`} />
                            <div>
                              <h4 className="font-semibold">{alert.pestName}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {alert.affectedCrops.map((crop, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">{crop}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bug className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No active pest alerts for your area</p>
                      <p className="text-sm">We'll notify you of any threats</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - AI Chat & Tips */}
            <div className="space-y-6">
              {/* AI Chat Assistant */}
              <Card variant="elevated" className="h-[500px] flex flex-col">
                <CardHeader className="bg-gradient-hero text-primary-foreground rounded-t-lg flex-shrink-0">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageCircle className="w-5 h-5" />
                    AI Farming Assistant
                  </CardTitle>
                  <p className="text-primary-foreground/70 text-sm">Powered by OpenAI</p>
                </CardHeader>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] px-4 py-2 rounded-lg text-sm ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground rounded-br-none"
                              : "bg-muted text-foreground rounded-bl-none"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted px-4 py-2 rounded-lg rounded-bl-none">
                          <Loader className="w-4 h-4 animate-spin" />
                        </div>
                      </div>
                    )}
                    <div ref={chatScrollRef} />
                  </div>
                </ScrollArea>
                <CardContent className="p-4 border-t border-border flex-shrink-0">
                  <div className="flex gap-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !isChatLoading) {
                          handleSendMessage();
                        }
                      }}
                      placeholder="Ask about farming..."
                      disabled={isChatLoading}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || isChatLoading}
                      size="icon"
                      variant="hero"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Suggestions */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="w-5 h-5 text-harvest" />
                    Ask Me About
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    "Best crops for this season?",
                    "How to prevent tomato blight?",
                    "When should I water my maize?",
                    "Current market prices for vegetables",
                  ].map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setChatInput(suggestion)}
                      className="w-full text-left text-sm p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground flex items-center justify-between"
                    >
                      <span>{suggestion}</span>
                      <ArrowRight className="w-4 h-4 opacity-50" />
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Farming Tips */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="w-5 h-5 text-harvest" />
                    Today's Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tipsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : farmingTips.length > 0 ? (
                    <div className="space-y-3">
                      {farmingTips.slice(0, 3).map((tip: FarmingTip) => (
                        <div key={tip.id} className="p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">{tip.category}</Badge>
                          </div>
                          <p className="text-sm">{tip.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm">🌱 Water your crops early morning to reduce evaporation losses</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm">🍃 Rotate crops to maintain soil health and prevent disease buildup</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm">📊 Track your planting and harvest dates for better planning</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Insights;
