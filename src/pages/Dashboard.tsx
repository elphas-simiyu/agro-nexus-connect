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
  Leaf
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "KES 245,000",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "bg-leaf",
  },
  {
    title: "Active Orders",
    value: "23",
    change: "+3",
    trend: "up",
    icon: ShoppingCart,
    color: "bg-secondary",
  },
  {
    title: "Products Listed",
    value: "18",
    change: "-2",
    trend: "down",
    icon: Package,
    color: "bg-primary",
  },
  {
    title: "Total Buyers",
    value: "156",
    change: "+28",
    trend: "up",
    icon: Users,
    color: "bg-harvest",
  },
];

const recentOrders = [
  {
    id: "ORD-001",
    buyer: "Nairobi Fresh Market",
    product: "Tomatoes",
    quantity: "200kg",
    amount: "KES 24,000",
    status: "pending",
  },
  {
    id: "ORD-002",
    buyer: "Green Grocers Ltd",
    product: "Avocados",
    quantity: "150kg",
    amount: "KES 12,000",
    status: "shipped",
  },
  {
    id: "ORD-003",
    buyer: "Safari Restaurant",
    product: "Green Beans",
    quantity: "50kg",
    amount: "KES 7,500",
    status: "delivered",
  },
  {
    id: "ORD-004",
    buyer: "City Supermarket",
    product: "Maize",
    quantity: "500kg",
    amount: "KES 22,500",
    status: "pending",
  },
];

const upcomingTasks = [
  { task: "Harvest tomatoes - Plot A", date: "Tomorrow", priority: "high" },
  { task: "Apply fertilizer - Maize field", date: "Dec 10", priority: "medium" },
  { task: "Irrigation system check", date: "Dec 12", priority: "low" },
  { task: "Meet with new buyer", date: "Dec 15", priority: "high" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div>
              <h1 className="font-display font-bold text-3xl mb-2">
                Welcome back, John! 👋
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening with your farm today.
              </p>
            </div>
            <div className="flex items-center gap-3">
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
            {stats.map((stat, i) => (
              <Card key={i} variant="gradient">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${
                      stat.trend === "up" ? "text-leaf" : "text-destructive"
                    }`}>
                      {stat.trend === "up" ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <h3 className="text-muted-foreground text-sm mb-1">{stat.title}</h3>
                  <p className="font-display font-bold text-2xl">{stat.value}</p>
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
                      <p className="text-sm text-muted-foreground">Coming soon with real data</p>
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
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-2 font-mono text-sm">{order.id}</td>
                            <td className="py-3 px-2 text-sm">{order.buyer}</td>
                            <td className="py-3 px-2 text-sm">{order.product}</td>
                            <td className="py-3 px-2 text-sm">{order.quantity}</td>
                            <td className="py-3 px-2 text-sm font-semibold">{order.amount}</td>
                            <td className="py-3 px-2">
                              <Badge
                                variant={
                                  order.status === "delivered"
                                    ? "success"
                                    : order.status === "shipped"
                                    ? "info"
                                    : "warning"
                                }
                              >
                                {order.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                      <p className="font-display font-bold text-4xl">24°C</p>
                      <p className="text-muted-foreground">Partly Cloudy</p>
                    </div>
                    <Sun className="w-16 h-16 text-harvest" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <Droplets className="w-5 h-5 mx-auto mb-1 text-sky" />
                      <p className="text-sm text-muted-foreground">Humidity</p>
                      <p className="font-semibold">65%</p>
                    </div>
                    <div className="text-center">
                      <Wind className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Wind</p>
                      <p className="font-semibold">12 km/h</p>
                    </div>
                    <div className="text-center">
                      <Droplets className="w-5 h-5 mx-auto mb-1 text-leaf" />
                      <p className="text-sm text-muted-foreground">Rain</p>
                      <p className="font-semibold">20%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Tasks */}
              <Card variant="elevated">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                    Upcoming Tasks
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingTasks.map((task, i) => (
                      <div
                        key={i}
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
                          <p className="text-sm font-medium">{task.task}</p>
                          <p className="text-xs text-muted-foreground">{task.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card className="bg-gradient-hero text-primary-foreground overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                      <Leaf className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold">AI Insight</h3>
                      <p className="text-primary-foreground/70 text-sm">Smart recommendation</p>
                    </div>
                  </div>
                  <p className="text-primary-foreground/90 text-sm leading-relaxed mb-4">
                    Based on current weather patterns and market trends, consider harvesting your tomatoes within the next 3 days for optimal pricing.
                  </p>
                  <Button variant="golden" size="sm">
                    Learn More
                  </Button>
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
