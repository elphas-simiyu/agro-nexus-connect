import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  AlertCircle,
  CreditCard,
  Wallet,
  Truck,
  ArrowLeft,
  Loader,
  Check
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import ordersService, { ShippingAddress } from "@/services/orders";
import paymentsService from "@/services/payments";
import { toast } from "sonner";

const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"paystack" | "wallet" | "cod">("paystack");
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : "",
    phone: "",
    email: user?.email || "",
    address: "",
    city: "",
    county: user?.location || "",
    postalCode: "",
    notes: "",
  });

  const shippingCost = 500;
  const tax = subtotal * 0.16;
  const total = subtotal + shippingCost + tax;

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    setIsCheckout(true);
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }

    // Validate shipping address
    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city || !shippingAddress.county) {
      toast.error("Please fill in all required shipping details");
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const order = await ordersService.createOrder({
        items,
        shippingAddress,
        paymentMethod,
      });

      if (paymentMethod === "paystack") {
        // Initialize Paystack payment
        const paymentData = await paymentsService.initializePayment({
          orderId: order.id,
          amount: total * 100, // Convert to kobo/cents
          email: shippingAddress.email,
          metadata: {
            orderId: order.id,
            items: items.map((i) => ({ name: i.name, quantity: i.quantity })),
          },
        });

        // Redirect to Paystack checkout
        window.location.href = paymentData.authorization_url;
      } else if (paymentMethod === "wallet") {
        // Pay from wallet
        await paymentsService.payFromWallet(order.id, total);
        clearCart();
        toast.success("Order placed successfully!");
        navigate(`/orders/${order.id}`);
      } else {
        // Cash on delivery
        clearCart();
        toast.success("Order placed! Pay on delivery.");
        navigate(`/orders/${order.id}`);
      }
    } catch (error: any) {
      console.error("Order error:", error);
      toast.error(error.response?.data?.error || "Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            {isCheckout && (
              <Button variant="ghost" size="icon" onClick={() => setIsCheckout(false)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <h1 className="font-display font-bold text-3xl">
              {isCheckout ? "Checkout" : "Shopping Cart"}
            </h1>
          </div>

          {items.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h2 className="font-display font-bold text-xl mb-2">
                  Your cart is empty
                </h2>
                <p className="text-muted-foreground mb-6">
                  Start shopping to add items to your cart
                </p>
                <Button variant="hero" onClick={() => navigate("/marketplace")}>
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items / Shipping Form */}
              <div className="lg:col-span-2">
                {!isCheckout ? (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <Card key={item.id} variant="elevated">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={item.image || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop"}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-display font-bold text-lg">
                                {item.name}
                              </h3>
                              <p className="text-muted-foreground text-sm">
                                by {item.farmer}
                              </p>
                              <p className="text-primary font-bold mt-2">
                                KES {item.price}/{item.unit}
                              </p>
                            </div>
                            <div className="flex flex-col items-end justify-between">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                              <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="font-semibold w-8 text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= item.available}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              <p className="font-display font-bold text-lg">
                                KES {item.price * item.quantity}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Shipping Address */}
                    <Card variant="elevated">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Truck className="w-5 h-5" />
                          Shipping Address
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <Input
                            placeholder="Full Name *"
                            value={shippingAddress.fullName}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                          />
                          <Input
                            placeholder="Phone Number *"
                            value={shippingAddress.phone}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                          />
                        </div>
                        <Input
                          placeholder="Email Address *"
                          type="email"
                          value={shippingAddress.email}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                        />
                        <Input
                          placeholder="Street Address *"
                          value={shippingAddress.address}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                        />
                        <div className="grid sm:grid-cols-3 gap-4">
                          <Input
                            placeholder="City *"
                            value={shippingAddress.city}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                          />
                          <Input
                            placeholder="County *"
                            value={shippingAddress.county}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, county: e.target.value })}
                          />
                          <Input
                            placeholder="Postal Code"
                            value={shippingAddress.postalCode}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                          />
                        </div>
                        <Input
                          placeholder="Delivery Notes (optional)"
                          value={shippingAddress.notes}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, notes: e.target.value })}
                        />
                      </CardContent>
                    </Card>

                    {/* Payment Method */}
                    <Card variant="elevated">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5" />
                          Payment Method
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <button
                          onClick={() => setPaymentMethod("paystack")}
                          className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-colors ${
                            paymentMethod === "paystack" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === "paystack" ? "border-primary bg-primary" : "border-muted-foreground"
                          }`}>
                            {paymentMethod === "paystack" && <Check className="w-3 h-3 text-primary-foreground" />}
                          </div>
                          <CreditCard className="w-6 h-6 text-primary" />
                          <div className="text-left flex-1">
                            <p className="font-semibold">Pay with Paystack</p>
                            <p className="text-sm text-muted-foreground">Card, M-Pesa, Bank Transfer</p>
                          </div>
                          <Badge variant="success">Recommended</Badge>
                        </button>

                        <button
                          onClick={() => setPaymentMethod("wallet")}
                          className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-colors ${
                            paymentMethod === "wallet" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === "wallet" ? "border-primary bg-primary" : "border-muted-foreground"
                          }`}>
                            {paymentMethod === "wallet" && <Check className="w-3 h-3 text-primary-foreground" />}
                          </div>
                          <Wallet className="w-6 h-6 text-harvest" />
                          <div className="text-left flex-1">
                            <p className="font-semibold">Pay from Wallet</p>
                            <p className="text-sm text-muted-foreground">Use your AgroNexus wallet balance</p>
                          </div>
                        </button>

                        <button
                          onClick={() => setPaymentMethod("cod")}
                          className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-colors ${
                            paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === "cod" ? "border-primary bg-primary" : "border-muted-foreground"
                          }`}>
                            {paymentMethod === "cod" && <Check className="w-3 h-3 text-primary-foreground" />}
                          </div>
                          <Truck className="w-6 h-6 text-muted-foreground" />
                          <div className="text-left flex-1">
                            <p className="font-semibold">Cash on Delivery</p>
                            <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                          </div>
                        </button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div>
                <Card variant="elevated" className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Items Summary */}
                    <div className="space-y-2 pb-4 border-b border-border">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                          <span>KES {item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Summary Details */}
                    <div className="space-y-3 pb-4 border-b border-border">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-semibold">KES {subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-semibold">KES {shippingCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax (16%)</span>
                        <span className="font-semibold">KES {tax.toFixed(0)}</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-display font-bold text-lg">
                        Total
                      </span>
                      <span className="font-display font-bold text-2xl text-primary">
                        KES {total.toFixed(0)}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="bg-sky/10 border border-sky/20 rounded-lg p-3 flex gap-3 mb-6">
                      <AlertCircle className="w-5 h-5 text-sky flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground">
                        {isCheckout 
                          ? "Your payment information is encrypted and secure."
                          : "Secure checkout. Free delivery on orders over KES 5,000."}
                      </p>
                    </div>

                    {/* CTA */}
                    {!isCheckout ? (
                      <>
                        <Button variant="hero" size="lg" className="w-full" onClick={handleProceedToCheckout}>
                          Proceed to Checkout
                        </Button>
                        <Button variant="outline" size="lg" className="w-full" onClick={() => navigate("/marketplace")}>
                          Continue Shopping
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="hero" 
                        size="lg" 
                        className="w-full" 
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            {paymentMethod === "paystack" ? "Pay with Paystack" : 
                             paymentMethod === "wallet" ? "Pay from Wallet" : 
                             "Place Order (COD)"}
                          </>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Trust Badges */}
                <div className="mt-6 space-y-3">
                  <div className="text-center text-sm text-muted-foreground">
                    ✓ 100% Secure Payment
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    ✓ Direct from Farmers
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    ✓ Quality Guaranteed
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
};

export default Cart;
