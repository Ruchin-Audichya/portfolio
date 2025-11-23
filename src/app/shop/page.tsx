"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { products, shopInfo } from "@/data/shop";
import {
    ShoppingCart,
    Check,
    Clock,
    Shield,
    Zap,
    Mail,
    Sparkles,
    TrendingUp
} from "lucide-react";

export default function ShopPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

    const categories = [
        { id: "all", label: "All Products" },
        { id: "windows", label: "Windows" },
        { id: "office", label: "Office" },
        { id: "combo", label: "Bundles" },
        { id: "server", label: "Server" },
    ];

    const filteredProducts = selectedCategory === "all"
        ? products
        : products.filter(p => p.category === selectedCategory);

    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 px-6 bg-gradient-surface overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent-teal/10" />

                <div className="container mx-auto max-w-6xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-6"
                    >
                        <div className="inline-block px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-4">
                            <span className="text-accent font-mono text-sm uppercase tracking-widest">
                                Trusted Since {shopInfo.established}
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-display font-bold">
                            Genuine Software<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-teal">
                                Licenses
                            </span>
                        </h1>

                        <p className="text-xl text-muted max-w-2xl mx-auto">
                            Lifetime activation keys for Windows, Office, and Server products.
                            Fast delivery, genuine licenses, 30-day warranty.
                        </p>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap justify-center gap-6 pt-8">
                            <div className="flex items-center gap-2 text-sm">
                                <Zap className="w-5 h-5 text-accent" />
                                <span>1-5 Min Delivery</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Shield className="w-5 h-5 text-accent-teal" />
                                <span>30-Day Warranty</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Check className="w-5 h-5 text-accent" />
                                <span>100% Genuine</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <TrendingUp className="w-5 h-5 text-accent-teal" />
                                <span>5+ Years in Business</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Categories */}
            <section className="sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b border-white/5">
                <div className="container mx-auto px-6 py-4">
                    <div className="relative group">
                        {/* Fade gradients for scroll indication */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none md:hidden" />
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none md:hidden" />

                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-6 py-2 rounded-full font-mono text-sm uppercase tracking-widest transition-all whitespace-nowrap snap-center flex-shrink-0 ${selectedCategory === cat.id
                                        ? "bg-accent text-background scale-105"
                                        : "bg-surface/50 border border-white/10 hover:border-accent/50 active:scale-95"
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-surface/50 border border-white/5 hover:border-accent/50 transition-all duration-500 backdrop-blur-sm overflow-hidden"
                            >
                                {/* Badges */}
                                <div className="absolute top-4 right-4 flex gap-2 z-10">
                                    {product.popular && (
                                        <span className="px-3 py-1 bg-accent text-background text-xs font-bold uppercase tracking-wider rounded-full">
                                            Popular
                                        </span>
                                    )}
                                    {product.new && (
                                        <span className="px-3 py-1 bg-accent-teal text-background text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" />
                                            New
                                        </span>
                                    )}
                                </div>

                                {/* Product Icon */}
                                <div className="p-8 text-center border-b border-white/5">
                                    <div className="text-7xl mb-4 group-hover:scale-110 transition-transform">
                                        {product.icon}
                                    </div>
                                    <h3 className="text-2xl font-display font-bold mb-2 group-hover:text-accent transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-muted">{product.description}</p>
                                </div>

                                {/* Features */}
                                <div className="p-6 space-y-3">
                                    {product.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-2 text-sm">
                                            <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Pricing & CTA */}
                                <div className="p-6 border-t border-white/5 bg-background/50">
                                    <div className="flex items-baseline gap-3 mb-4">
                                        <span className="text-3xl font-display font-bold">
                                            ₹{product.price}
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-lg text-muted line-through">
                                                ₹{product.originalPrice}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex gap-2 text-xs text-muted mb-4">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {product.deliveryTime}
                                        </div>
                                        <span>•</span>
                                        <div className="flex items-center gap-1">
                                            <Shield className="w-3 h-3" />
                                            {product.warranty}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedProduct(product.id)}
                                        className="w-full px-6 py-3 bg-accent text-background font-bold uppercase tracking-widest hover:bg-accent/90 transition-all flex items-center justify-center gap-2 group/btn"
                                    >
                                        <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                        Purchase Now
                                    </button>
                                </div>

                                {/* Hover Accent */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Guarantees Section */}
            <section className="py-20 px-6 bg-gradient-surface">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
                        Why Choose Us?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {shopInfo.guarantees.map((guarantee, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 bg-surface/30 border border-white/5 rounded">
                                <Check className="w-5 h-5 text-accent flex-shrink-0" />
                                <span className="text-sm font-medium">{guarantee}</span>
                            </div>
                        ))}
                    </div>

                    {/* Contact Info */}
                    <div className="mt-12 p-8 bg-surface/50 border border-white/10 rounded text-center">
                        <Mail className="w-12 h-12 text-accent mx-auto mb-4" />
                        <h3 className="text-xl font-display font-bold mb-2">
                            Questions or Bulk Orders?
                        </h3>
                        <p className="text-muted mb-4">
                            Contact us for custom quotes and volume discounts
                        </p>
                        <a
                            href={`mailto:${shopInfo.email}`}
                            className="text-accent hover:text-accent/80 font-mono transition-colors"
                        >
                            {shopInfo.email}
                        </a>
                        <div className="mt-6 flex justify-center gap-4 text-sm text-muted">
                            <span>Payment Methods:</span>
                            {shopInfo.paymentMethods.map((method, i) => (
                                <span key={i} className="font-mono">{method}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Purchase Modal */}
            {selectedProduct && (
                <PurchaseModal
                    product={products.find(p => p.id === selectedProduct)!}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </main>
    );
}

// Purchase Modal Component
function PurchaseModal({ product, onClose }: { product: any; onClose: () => void }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        paymentMethod: "UPI",
        quantity: 1
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("loading");

        try {
            const res = await fetch("/api/purchase", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    product: product.name,
                    productId: product.id,
                    price: product.price,
                    ...formData,
                    totalAmount: product.price * formData.quantity
                })
            });

            if (res.ok) {
                setStatus("success");
                setTimeout(onClose, 3000);
            } else {
                setStatus("error");
            }
        } catch (error) {
            setStatus("error");
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-background border border-white/10 p-6 md:p-8 max-w-md w-full my-auto rounded-2xl shadow-2xl relative"
            >
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-2xl font-display font-bold mb-2">
                            {product.icon} {product.name}
                        </h3>
                        <p className="text-3xl font-bold text-accent">
                            ₹{product.price * formData.quantity}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-muted hover:text-primary transition-colors text-2xl"
                    >
                        ×
                    </button>
                </div>

                {status === "success" ? (
                    <div className="text-center py-12">
                        <Check className="w-16 h-16 text-accent mx-auto mb-4" />
                        <h4 className="text-xl font-bold mb-2">Order Received!</h4>
                        <p className="text-muted">
                            We'll contact you shortly to complete the purchase.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-mono uppercase tracking-widest text-muted block mb-2">
                                Your Name
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-surface/50 border border-white/10 px-4 py-3 focus:border-accent focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-mono uppercase tracking-widest text-muted block mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-surface/50 border border-white/10 px-4 py-3 focus:border-accent focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-mono uppercase tracking-widest text-muted block mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-surface/50 border border-white/10 px-4 py-3 focus:border-accent focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-mono uppercase tracking-widest text-muted block mb-2">
                                Quantity
                            </label>
                            <input
                                type="number"
                                min="1"
                                required
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                className="w-full bg-surface/50 border border-white/10 px-4 py-3 focus:border-accent focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-mono uppercase tracking-widest text-muted block mb-2">
                                Payment Method
                            </label>
                            <select
                                value={formData.paymentMethod}
                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                className="w-full bg-surface/50 border border-white/10 px-4 py-3 focus:border-accent focus:outline-none transition-colors"
                            >
                                <option>UPI</option>
                                <option>PhonePe</option>
                                <option>Paytm</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full px-6 py-4 bg-accent text-background font-bold uppercase tracking-widest hover:bg-accent/90 transition-all disabled:opacity-50"
                        >
                            {status === "loading" ? "Sending Order..." : "Submit Order Request"}
                        </button>

                        {status === "error" && (
                            <p className="text-red-500 text-sm text-center">
                                Something went wrong. Please try again or contact us directly.
                            </p>
                        )}

                        <p className="text-xs text-muted text-center">
                            You'll receive payment instructions via email within 5 minutes.
                            Keys are delivered after payment confirmation.
                        </p>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
