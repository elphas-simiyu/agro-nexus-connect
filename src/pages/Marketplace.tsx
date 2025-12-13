import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Grid3X3, 
  List,
  SlidersHorizontal,
  ChevronDown,
  Plus,
  Minus,
  Check
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import productsService, { Product } from "@/services/products";

const categories = [
  { id: "all", name: "All Products" },
  { id: "vegetables", name: "Vegetables" },
  { id: "fruits", name: "Fruits" },
  { id: "grains", name: "Grains" },
  { id: "dairy", name: "Dairy" },
  { id: "poultry", name: "Poultry" },
];

const Marketplace = () => {
  const navigate = useNavigate();
  const { addItem, isInCart, getItemQuantity } = useCart();
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [organicOnly, setOrganicOnly] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", activeCategory, searchQuery],
    queryFn: () => productsService.getProducts({ 
      category: activeCategory === "all" ? undefined : activeCategory, 
      q: searchQuery || undefined 
    }),
  });

  const filteredProducts = Array.isArray(products) ? products.filter((product: Product) => {
    const matchesCategory = activeCategory === "all" || (product.category || "").toLowerCase() === activeCategory;
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.farmer || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = 
      (!priceRange.min || product.price >= Number(priceRange.min)) &&
      (!priceRange.max || product.price <= Number(priceRange.max));
    const matchesOrganic = !organicOnly || product.organic;
    return matchesCategory && matchesSearch && matchesPrice && matchesOrganic;
  }) : [];

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image || "",
      farmer: product.farmer,
      farmerId: product.farmerId || "",
      unit: product.unit,
      available: product.available,
    });
    toast.success(`${product.name} added to cart`);
  };

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
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-sm text-muted-foreground">Price Range (KES)</h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm"
                    />
                    <span className="text-muted-foreground">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm"
                    />
                  </div>
                </div>

                {/* Organic Filter */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={organicOnly}
                      onChange={(e) => setOrganicOnly(e.target.checked)}
                      className="w-4 h-4 rounded border-border" 
                    />
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

              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading products...</p>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
                  <h3 className="font-display font-bold text-xl mb-2">No products found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search query</p>
                </div>
              )}

              {/* Products Grid */}
              <div className={`grid gap-6 ${viewMode === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                {filteredProducts.map((product: Product) => (
                  <Card key={product.id} variant="elevated" className="group overflow-hidden">
                    <div className={`${viewMode === "list" ? "flex" : ""}`}>
                      <div className={`relative overflow-hidden ${viewMode === "list" ? "w-48 shrink-0" : "aspect-[4/3]"}`}>
                        <img
                          src={product.image || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop"}
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
                          <span className="font-semibold">{product.rating || 0}</span>
                          <span className="text-muted-foreground text-sm">
                            ({product.reviews || 0} reviews)
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-display font-bold text-xl text-primary">
                              KES {product.price}
                            </span>
                            <span className="text-muted-foreground">/{product.unit}</span>
                          </div>
                          {isInCart(product.id) ? (
                            <Button size="sm" variant="outline" onClick={() => navigate("/cart")}>
                              <Check className="w-4 h-4 mr-1" />
                              In Cart ({getItemQuantity(product.id)})
                            </Button>
                          ) : (
                            <Button size="sm" variant="hero" onClick={() => handleAddToCart(product)}>
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {product.available} available
                        </p>
                      </CardContent>
                    </div>
                  </Card>
                ))}
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
