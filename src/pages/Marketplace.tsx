import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Star, 
  ShoppingCart, 
  Filter, 
  Grid3X3, 
  List,
  SlidersHorizontal,
  ChevronDown
} from "lucide-react";

const categories = [
  { id: "all", name: "All Products", count: 1250 },
  { id: "vegetables", name: "Vegetables", count: 420 },
  { id: "fruits", name: "Fruits", count: 380 },
  { id: "grains", name: "Grains", count: 215 },
  { id: "dairy", name: "Dairy", count: 89 },
  { id: "poultry", name: "Poultry", count: 146 },
];

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
    organic: true,
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
    organic: false,
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
    organic: true,
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
    organic: true,
  },
  {
    id: 5,
    name: "Fresh Mangoes",
    farmer: "Samuel Kimani",
    location: "Machakos, Kenya",
    price: 95,
    unit: "kg",
    rating: 4.9,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop",
    category: "Fruits",
    available: "1,200kg",
    organic: false,
  },
  {
    id: 6,
    name: "Premium Rice",
    farmer: "Elizabeth Njeri",
    location: "Mwea, Kenya",
    price: 180,
    unit: "kg",
    rating: 4.8,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    category: "Grains",
    available: "5,000kg",
    organic: false,
  },
  {
    id: 7,
    name: "Fresh Eggs",
    farmer: "David Omondi",
    location: "Kisumu, Kenya",
    price: 15,
    unit: "piece",
    rating: 4.7,
    reviews: 445,
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop",
    category: "Poultry",
    available: "10,000 pieces",
    organic: true,
  },
  {
    id: 8,
    name: "Fresh Milk",
    farmer: "Anne Chebet",
    location: "Eldoret, Kenya",
    price: 60,
    unit: "litre",
    rating: 4.9,
    reviews: 523,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop",
    category: "Dairy",
    available: "500 litres",
    organic: true,
  },
];

const Marketplace = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "all" || product.category.toLowerCase() === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.farmer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-hero py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-primary-foreground mb-4">
              Fresh Farm Products
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Browse thousands of products directly from verified farmers across Kenya
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 shrink-0">
              <div className="bg-card rounded-2xl p-6 shadow-card sticky top-24">
                <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </h3>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-sm text-muted-foreground">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeCategory === category.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        <span>{category.name}</span>
                        <span className={activeCategory === category.id ? "text-primary-foreground/70" : "text-muted-foreground"}>
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-sm text-muted-foreground">Price Range</h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm"
                    />
                    <span className="text-muted-foreground">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm"
                    />
                  </div>
                </div>

                {/* Organic Filter */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-border" />
                    <span className="text-sm">Organic Only</span>
                  </label>
                </div>
              </div>
            </aside>

            {/* Products */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <p className="text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
                </p>

                <div className="flex items-center gap-3">
                  {/* Search */}
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background text-sm"
                    />
                  </div>

                  {/* Sort */}
                  <Button variant="outline" size="sm" className="hidden sm:flex">
                    Sort by
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>

                  {/* View Mode */}
                  <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "grid" ? "bg-background shadow-sm" : ""
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "list" ? "bg-background shadow-sm" : ""
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className={`grid gap-6 ${viewMode === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                {filteredProducts.map((product) => (
                  <Card key={product.id} variant="elevated" className="group overflow-hidden">
                    <div className={`${viewMode === "list" ? "flex" : ""}`}>
                      <div className={`relative overflow-hidden ${viewMode === "list" ? "w-48 shrink-0" : "aspect-[4/3]"}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <Badge variant="success">{product.category}</Badge>
                          {product.organic && <Badge variant="earth">Organic</Badge>}
                        </div>
                      </div>
                      <CardContent className="p-4 flex-1">
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
                            Add
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {product.available} available
                        </p>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  {[1, 2, 3, 4, 5].map((page) => (
                    <Button
                      key={page}
                      variant={page === 1 ? "default" : "ghost"}
                      size="sm"
                      className="w-10"
                    >
                      {page}
                    </Button>
                  ))}
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Marketplace;
