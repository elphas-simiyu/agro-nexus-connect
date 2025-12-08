import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, ShoppingCart, Filter } from "lucide-react";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Fresh Organic Tomatoes",
    farmer: "John Mwangi",
    location: "Kiambu, Kenya",
    price: 120,
    unit: "kg",
    rating: 4.8,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop",
    category: "Vegetables",
    available: "500kg",
  },
  {
    id: 2,
    name: "Grade A Maize",
    farmer: "Mary Wanjiku",
    location: "Nakuru, Kenya",
    price: 45,
    unit: "kg",
    rating: 4.9,
    reviews: 243,
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop",
    category: "Grains",
    available: "2,000kg",
  },
  {
    id: 3,
    name: "Fresh Avocados",
    farmer: "Peter Ochieng",
    location: "Murang'a, Kenya",
    price: 80,
    unit: "kg",
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=300&fit=crop",
    category: "Fruits",
    available: "800kg",
  },
  {
    id: 4,
    name: "Organic Green Beans",
    farmer: "Grace Akinyi",
    location: "Meru, Kenya",
    price: 150,
    unit: "kg",
    rating: 4.6,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=400&h=300&fit=crop",
    category: "Vegetables",
    available: "300kg",
  },
];

export function MarketplacePreview() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div>
            <p className="text-primary font-semibold mb-2 font-display">Marketplace</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl">
              Fresh From the <span className="text-gradient-hero">Farm</span>
            </h2>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button variant="outline" size="icon" className="h-12 w-12">
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <Card key={product.id} variant="elevated" className="group overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <Badge variant="success" className="absolute top-3 left-3">
                  {product.category}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  {product.location}
                </div>
                <h3 className="font-display font-bold text-lg mb-1">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  by {product.farmer}
                </p>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-harvest text-harvest" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-muted-foreground text-sm">
                    ({product.reviews} reviews)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-display font-bold text-xl text-primary">
                      KES {product.price}
                    </span>
                    <span className="text-muted-foreground">/{product.unit}</span>
                  </div>
                  <Button size="sm" variant="hero">
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {product.available} available
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="hero" size="lg" asChild>
            <Link to="/marketplace">
              View All Products
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
