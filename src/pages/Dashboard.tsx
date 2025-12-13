import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  BarChart3,
  Cloud,
  Sun,
  Droplets,
  Wind,
  Plus,
  Bell,
  Settings,
  Calendar,
  ArrowUpRight,
  Leaf,
  Lock
} from "lucide-react";
import dashboardService from "@/services/dashboard";
import weatherService from "@/services/weather";
import tasksService from "@/services/tasks";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [weather, setWeather] = useState<any>(null);
  const [newTask, setNewTask] = useState({ title: "", description: "", due_date: "", priority: "medium" });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const queryClient = useQueryClient();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      // Show auth modal instead of redirecting
    }
  }, [authLoading, isAuthenticated]);

  // Fetch dashboard data only when authenticated
  const { data: statsData = [] } = useQuery({ 
    queryKey: ["dashboard", "stats"], 
    queryFn: dashboardService.getDashboardStats,
    enabled: isAuthenticated
  });

  const { data: recent = [] } = useQuery({ 
    queryKey: ["dashboard", "recentOrders"], 
    queryFn: dashboardService.getRecentOrders,
    enabled: isAuthenticated
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => tasksService.getTasks(),
    enabled: isAuthenticated,
  });

  const createTaskMutation = useMutation({
    mutationFn: (payload: any) => tasksService.createTask(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, payload }: any) => tasksService.updateTask(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: number) => tasksService.deleteTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        if (isAuthenticated && user) {
          try {
            const coords = await weatherService.getCurrentLocation();
            const w = await weatherService.getWeatherByCoords(coords.latitude, coords.longitude);
            setWeather(w);
          } catch (err) {
            const userLocation = user?.location || 'Kenya';
            const city = userLocation.includes(',') ? userLocation.split(',')[0].trim() : userLocation;
            try {
              const w = await weatherService.getWeatherByCity(city);
              setWeather(w);
            } catch (err2) {
              const w = await weatherService.getWeatherByCity('Kenya');
              setWeather(w);
            }
          }
        }
      } catch (error) {
        console.error('Weather fetch error:', error);
      }
    };

    fetchWeather();
  }, [isAuthenticated, user]);

  // Show login required state
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-20">
            <Card variant="elevated" className="max-w-md mx-auto text-center p-8">
              <Lock className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
              <h1 className="font-display font-bold text-2xl mb-4">Dashboard Access Required</h1>
              <p className="text-muted-foreground mb-6">
                Please sign in to access your personalized dashboard, manage your farm, and view insights.
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
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div>
              <h1 className="font-display font-bold text-3xl mb-2">
                Welcome back, {user?.first_name ?? user?.username}! 👋
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening with your farm today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={() => navigate("/insights")}>
                <Leaf className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="hero">
                <Plus className="w-5 h-5 mr-2" />
                Add Product
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((s: any, idx: number) => (
              <Card key={idx} variant="gradient">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center`}>
                      <s.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${
                      s.trend === "up" ? "text-leaf" : "text-destructive"
                    }`}>
                      {s.trend === "up" ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {s.change}
                    </div>
                  </div>
                  <h3 className="text-muted-foreground text-sm mb-1">{s.title}</h3>
                  <p className="font-display font-bold text-2xl">{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Revenue Chart Placeholder */}
              <Card variant="elevated">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Revenue Overview
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    This Month
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/50 rounded-xl">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">Revenue chart visualization</p>
                      <p className="text-sm text-muted-foreground">Connect your sales data to view charts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card variant="elevated">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                    Recent Orders
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {recent.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No orders yet. Start selling to see orders here.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Order ID</th>
                            <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Buyer</th>
                            <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Product</th>
                            <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Quantity</th>
                            <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Amount</th>
                            <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recent.map((o: any) => (
                            <tr key={o.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                              <td className="py-3 px-2 font-mono text-sm">{o.id}</td>
                              <td className="py-3 px-2 text-sm">{o.buyer}</td>
                              <td className="py-3 px-2 text-sm">{o.product}</td>
                              <td className="py-3 px-2 text-sm">{o.quantity}</td>
                              <td className="py-3 px-2 text-sm font-semibold">{o.amount}</td>
                              <td className="py-3 px-2">
                                <Badge
                                  variant={
                                    o.status === "delivered"
                                      ? "success"
                                      : o.status === "shipped"
                                      ? "info"
                                      : "warning"
                                  }
                                >
                                  {o.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Weather Widget */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Cloud className="w-5 h-5 text-sky" />
                    Weather Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="font-display font-bold text-4xl">{weather ? `${weather.temperature}°C` : '—'}</p>
                      <p className="text-muted-foreground">{weather ? weather.condition : 'Loading...'}</p>
                    </div>
                    <Sun className="w-16 h-16 text-harvest" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <Droplets className="w-5 h-5 mx-auto mb-1 text-sky" />
                      <p className="text-sm text-muted-foreground">Humidity</p>
                      <p className="font-semibold">{weather ? `${weather.humidity}%` : '—'}</p>
                    </div>
                    <div className="text-center">
                      <Wind className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Wind</p>
                      <p className="font-semibold">{weather ? `${weather.windSpeed} m/s` : '—'}</p>
                    </div>
                    <div className="text-center">
                      <Droplets className="w-5 h-5 mx-auto mb-1 text-leaf" />
                      <p className="text-sm text-muted-foreground">Rain</p>
                      <p className="font-semibold">{weather ? `${0}%` : '—'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Leaf className="w-5 h-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/insights")}>
                    <Leaf className="w-4 h-4 mr-2" />
                    View Farming Insights
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/marketplace")}>
                    <Package className="w-4 h-4 mr-2" />
                    Browse Marketplace
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Tasks */}
              <Card variant="elevated">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                    Upcoming Tasks
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowTaskForm(!showTaskForm)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {showTaskForm && (
                      <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-2 mb-4">
                        <input
                          type="text"
                          placeholder="Task title"
                          value={newTask.title}
                          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                          type="text"
                          placeholder="Description (optional)"
                          value={newTask.description}
                          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                          type="date"
                          value={newTask.due_date}
                          onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <select
                          value={newTask.priority}
                          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                        </select>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="hero"
                            onClick={() => {
                              createTaskMutation.mutate(newTask);
                              setNewTask({ title: "", description: "", due_date: "", priority: "medium" });
                              setShowTaskForm(false);
                            }}
                            disabled={!newTask.title || createTaskMutation.isPending}
                          >
                            {createTaskMutation.isPending ? "Creating..." : "Create Task"}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setShowTaskForm(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {tasksLoading && (
                      <div className="text-sm text-muted-foreground">Loading tasks...</div>
                    )}

                    {!tasksLoading && tasks.length === 0 && (
                      <div className="text-sm text-muted-foreground">No upcoming tasks. Add one to get started.</div>
                    )}

                    {!tasksLoading && tasks.map((task: any) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          task.priority === "high"
                            ? "bg-destructive"
                            : task.priority === "medium"
                            ? "bg-harvest"
                            : "bg-leaf"
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{task.title}</p>
                          <p className="text-xs text-muted-foreground">{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteTaskMutation.mutate(task.id)}
                        >
                          ✓
                        </Button>
                      </div>
                    ))}
                  </div>
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

export default Dashboard;
