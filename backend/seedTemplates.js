import mongoose from 'mongoose';
import Template from './models/Template.js';
import dotenv from 'dotenv';
dotenv.config();

// ─────────────────────────────────────────────
// 1. SAAS LANDING PAGE
// ─────────────────────────────────────────────
const saasTemplate = {
  name: "SaaS Landing Page",
  description: "Conversion-focused SaaS product page with hero, feature showcase, pricing tiers, and FAQ. Built for software products that need to explain, convince, and convert.",
  category: "saas",
  builderType: "SaaS Landing Page",
  theme: {
    primaryColor: "#6366f1",
    secondaryColor: "#818cf8",
    bgColor: "#0f0f1a",
    accentColor: "#a78bfa",
    fontStyle: "modern-sans",
    previewGradient: "135deg, #1e1b4b 0%, #0f0f1a 60%, #1a0533 100%"
  },
  features: ["Announcement bar", "Product UI preview", "Trusted-by logos", "Feature grid", "Interactive demo section", "3-tier pricing", "FAQ accordion", "Final CTA"],
  tags: ["saas", "startup", "software", "conversion", "pricing", "landing"],
  sections: ["announcement-bar", "navbar", "hero", "trusted-companies", "problem-solution", "features", "product-demo", "how-it-works", "pricing", "faq", "cta", "footer"],
  components: [
    { id: "saas-announce-1", type: "navbar", properties: { text: "🎉 New: AI-powered analytics now live — See what's new →", isAnnouncement: true }, styles: { backgroundColor: "#4f46e5", color: "#e0e7ff", padding: "10px", textAlign: "center", fontSize: "13px" }, position: { x: 0, y: 0 } },
    { id: "saas-nav-1", type: "navbar", properties: { text: "Flowlytics", links: ["Product", "Features", "Pricing", "Docs", "Blog"], cta: "Start free trial" }, styles: { backgroundColor: "#0f0f1a", color: "#f1f5f9", padding: "16px 40px", borderBottom: "1px solid #1e1e2e" }, position: { x: 0, y: 40 } },
    { id: "saas-hero-1", type: "hero", properties: { text: "Turn raw data into revenue decisions", subtext: "Flowlytics gives your team real-time analytics, AI-powered insights, and automated reports — without the complexity of enterprise BI tools.", cta1: "Start free — no credit card", cta2: "Watch 2-min demo" }, styles: { backgroundColor: "#0f0f1a", color: "#f1f5f9", padding: "100px 40px 60px", textAlign: "center" }, position: { x: 0, y: 100 } },
    { id: "saas-trusted-1", type: "container", properties: { text: "Trusted by 4,200+ teams at companies like Stripe, Notion, Linear, Vercel, and Loom" }, styles: { backgroundColor: "#13131a", padding: "28px 40px", textAlign: "center", color: "#475569", fontSize: "13px", borderTop: "1px solid #1e1e2e", borderBottom: "1px solid #1e1e2e" }, position: { x: 0, y: 380 } },
    { id: "saas-problem-1", type: "header", properties: { text: "Your data is everywhere. Your team is guessing.", subtext: "Spreadsheets, dashboards, and weekly reports that are outdated before they're read. Sound familiar?" }, styles: { backgroundColor: "#0f0f1a", color: "#f1f5f9", padding: "80px 40px 40px", textAlign: "center" }, position: { x: 0, y: 440 } },
    { id: "saas-feat-1", type: "card", properties: { text: "Real-time dashboards", icon: "⚡", description: "Live data from 50+ sources. No refresh needed. Your team always sees the same truth." }, styles: { backgroundColor: "#13131a", border: "1px solid #1e1e2e", borderRadius: "12px", padding: "28px" }, position: { x: 40, y: 600 } },
    { id: "saas-feat-2", type: "card", properties: { text: "AI anomaly detection", icon: "🤖", description: "Flowlytics flags unusual patterns before they become problems. Get Slack alerts in seconds." }, styles: { backgroundColor: "#13131a", border: "1px solid #1e1e2e", borderRadius: "12px", padding: "28px" }, position: { x: 340, y: 600 } },
    { id: "saas-feat-3", type: "card", properties: { text: "One-click reports", icon: "📊", description: "Auto-generate investor, board, and team reports. Export to PDF, Notion, or Google Slides." }, styles: { backgroundColor: "#13131a", border: "1px solid #1e1e2e", borderRadius: "12px", padding: "28px" }, position: { x: 640, y: 600 } },
    { id: "saas-feat-4", type: "card", properties: { text: "Role-based access", icon: "🔐", description: "Granular permissions. Executives see summaries. Analysts see raw data. Everyone sees what they need." }, styles: { backgroundColor: "#13131a", border: "1px solid #1e1e2e", borderRadius: "12px", padding: "28px" }, position: { x: 40, y: 780 } },
    { id: "saas-feat-5", type: "card", properties: { text: "50+ integrations", icon: "🔗", description: "Postgres, Snowflake, BigQuery, Salesforce, HubSpot, Stripe, Shopify, and more. Connect in minutes." }, styles: { backgroundColor: "#13131a", border: "1px solid #1e1e2e", borderRadius: "12px", padding: "28px" }, position: { x: 340, y: 780 } },
    { id: "saas-feat-6", type: "card", properties: { text: "Mobile-ready", icon: "📱", description: "Full-featured iOS and Android apps. Check your KPIs from anywhere, anytime." }, styles: { backgroundColor: "#13131a", border: "1px solid #1e1e2e", borderRadius: "12px", padding: "28px" }, position: { x: 640, y: 780 } },
    { id: "saas-pricing-header", type: "header", properties: { text: "Simple, transparent pricing", subtext: "No hidden fees. No per-seat surprises. Cancel anytime." }, styles: { backgroundColor: "#0f0f1a", color: "#f1f5f9", padding: "80px 40px 40px", textAlign: "center" }, position: { x: 0, y: 1000 } },
    { id: "saas-price-1", type: "card", properties: { text: "Starter", price: "$0/mo", description: "For solo founders and small teams getting started.", features: ["Up to 3 dashboards", "5 data sources", "7-day data history", "Email support"] }, styles: { backgroundColor: "#13131a", border: "1px solid #1e1e2e", borderRadius: "12px", padding: "32px" }, position: { x: 40, y: 1160 } },
    { id: "saas-price-2", type: "card", properties: { text: "Growth", price: "$49/mo", badge: "Most Popular", description: "For growing teams that need more power and collaboration.", features: ["Unlimited dashboards", "25 data sources", "1-year data history", "AI anomaly alerts", "Priority support", "Custom reports"] }, styles: { backgroundColor: "#1e1b4b", border: "2px solid #6366f1", borderRadius: "12px", padding: "32px" }, position: { x: 340, y: 1140 } },
    { id: "saas-price-3", type: "card", properties: { text: "Enterprise", price: "Custom", description: "For large organizations with advanced security and compliance needs.", features: ["Everything in Growth", "Unlimited data sources", "SSO & SAML", "SLA guarantee", "Dedicated CSM", "On-premise option"] }, styles: { backgroundColor: "#13131a", border: "1px solid #1e1e2e", borderRadius: "12px", padding: "32px" }, position: { x: 640, y: 1160 } },
    { id: "saas-faq-header", type: "header", properties: { text: "Frequently asked questions" }, styles: { backgroundColor: "#0f0f1a", color: "#f1f5f9", padding: "80px 40px 32px", textAlign: "center" }, position: { x: 0, y: 1420 } },
    { id: "saas-faq-1", type: "container", properties: { text: "Q: How long does setup take?\nA: Most teams are fully set up in under 30 minutes. Connect your first data source, invite your team, and your first dashboard is ready." }, styles: { backgroundColor: "#13131a", border: "1px solid #1e1e2e", borderRadius: "10px", padding: "20px 28px", margin: "0 40px 12px" }, position: { x: 40, y: 1540 } },
    { id: "saas-faq-2", type: "container", properties: { text: "Q: Is my data secure?\nA: Yes. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We are SOC 2 Type II certified and GDPR compliant." }, styles: { backgroundColor: "#13131a", border: "1px solid #1e1e2e", borderRadius: "10px", padding: "20px 28px", margin: "0 40px 12px" }, position: { x: 40, y: 1640 } },
    { id: "saas-cta-1", type: "hero", properties: { text: "Ready to make faster decisions?", subtext: "Join 4,200+ teams already using Flowlytics. Start your free trial today.", cta: "Get started free" }, styles: { backgroundColor: "#1e1b4b", color: "#f1f5f9", padding: "80px 40px", textAlign: "center", borderTop: "1px solid #312e81" }, position: { x: 0, y: 1780 } },
    { id: "saas-footer-1", type: "footer", properties: { text: "© 2025 Flowlytics, Inc. · Privacy · Terms · Security · Status" }, styles: { backgroundColor: "#09090d", color: "#475569", padding: "32px 40px", textAlign: "center", fontSize: "13px" }, position: { x: 0, y: 1960 } }
  ],
  settings: { theme: "dark", layout: "responsive" }
};

// ─────────────────────────────────────────────
// 2. EDITORIAL BLOG
// ─────────────────────────────────────────────
const blogTemplate = {
  name: "Editorial Blog",
  description: "A genuine publishing platform with featured stories, category navigation, author profiles, article cards, and newsletter signup. Feels like a real media publication.",
  category: "blog",
  builderType: "Blog",
  theme: {
    primaryColor: "#0f172a",
    secondaryColor: "#1e293b",
    bgColor: "#ffffff",
    accentColor: "#ef4444",
    fontStyle: "editorial-serif",
    previewGradient: "135deg, #0f172a 0%, #1e293b 50%, #0c1a2e 100%"
  },
  features: ["Trending bar", "Category navigation", "Featured story hero", "Article card grid", "Author profiles", "Reading time", "Newsletter signup", "Tag system"],
  tags: ["blog", "editorial", "publishing", "articles", "content", "media", "news"],
  sections: ["trending-bar", "masthead", "category-nav", "featured-story", "latest-articles", "category-sections", "editors-picks", "author-spotlight", "newsletter", "footer"],
  components: [
    { id: "blog-trending-1", type: "navbar", properties: { text: "🔥 Trending: The AI tools reshaping product design in 2025 · How Figma lost its edge · Why remote work is back" }, styles: { backgroundColor: "#0f172a", color: "#94a3b8", padding: "8px 32px", fontSize: "12px", borderBottom: "1px solid #1e293b" }, position: { x: 0, y: 0 } },
    { id: "blog-masthead-1", type: "header", properties: { text: "The Craft", tagline: "Design · Technology · Culture" }, styles: { backgroundColor: "#ffffff", color: "#0f172a", padding: "32px 40px 20px", textAlign: "center", borderBottom: "3px solid #0f172a" }, position: { x: 0, y: 36 } },
    { id: "blog-catnav-1", type: "navbar", properties: { text: "Design  ·  Engineering  ·  Product  ·  Startups  ·  AI  ·  Culture  ·  Interviews", links: ["Design", "Engineering", "Product", "Startups", "AI", "Culture", "Interviews"] }, styles: { backgroundColor: "#f8fafc", color: "#334155", padding: "12px 40px", fontSize: "13px", fontWeight: "600", borderBottom: "1px solid #e2e8f0" }, position: { x: 0, y: 120 } },
    { id: "blog-featured-1", type: "hero", properties: { category: "DESIGN", text: "The quiet death of the hamburger menu — and what replaced it", author: "Maya Chen", date: "June 12, 2025", readTime: "8 min read", excerpt: "After a decade of dominance, the hamburger menu is disappearing from modern interfaces. We spoke to 12 design leads at top companies to understand what's driving the shift and what navigation patterns are winning." }, styles: { backgroundColor: "#0f172a", color: "#f1f5f9", padding: "60px 40px", borderBottom: "4px solid #ef4444" }, position: { x: 0, y: 160 } },
    { id: "blog-latest-header", type: "header", properties: { text: "Latest Stories" }, styles: { backgroundColor: "#ffffff", color: "#0f172a", padding: "48px 40px 20px", fontSize: "22px", fontWeight: "800", borderBottom: "2px solid #0f172a" }, position: { x: 0, y: 480 } },
    { id: "blog-article-1", type: "card", properties: { category: "ENGINEERING", text: "How Linear builds software at the speed of thought", author: "James Park", date: "June 11, 2025", readTime: "6 min read", excerpt: "Inside the engineering culture that made Linear the fastest issue tracker in the world." }, styles: { backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "0", padding: "24px", borderBottom: "1px solid #e2e8f0" }, position: { x: 0, y: 560 } },
    { id: "blog-article-2", type: "card", properties: { category: "AI", text: "Claude vs GPT-4o: A designer's honest comparison", author: "Priya Nair", date: "June 10, 2025", readTime: "11 min read", excerpt: "We ran 200 real design tasks through both models. The results were surprising." }, styles: { backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "0", padding: "24px", borderBottom: "1px solid #e2e8f0" }, position: { x: 0, y: 720 } },
    { id: "blog-article-3", type: "card", properties: { category: "PRODUCT", text: "Why Notion's new AI features are a masterclass in restraint", author: "Tom Okafor", date: "June 9, 2025", readTime: "7 min read", excerpt: "Adding AI to a productivity tool without ruining it is harder than it looks. Notion got it right." }, styles: { backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "0", padding: "24px", borderBottom: "1px solid #e2e8f0" }, position: { x: 0, y: 880 } },
    { id: "blog-article-4", type: "card", properties: { category: "STARTUPS", text: "The $0 marketing playbook that got us to 10k users", author: "Sara Lindqvist", date: "June 8, 2025", readTime: "9 min read", excerpt: "No ads. No influencers. No PR agency. Here's exactly what we did." }, styles: { backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "0", padding: "24px", borderBottom: "1px solid #e2e8f0" }, position: { x: 0, y: 1040 } },
    { id: "blog-editors-header", type: "header", properties: { text: "Editor's Picks" }, styles: { backgroundColor: "#f8fafc", color: "#0f172a", padding: "40px 40px 20px", fontWeight: "800", borderTop: "3px solid #0f172a" }, position: { x: 0, y: 1200 } },
    { id: "blog-pick-1", type: "card", properties: { text: "The 10 design principles Airbnb never published", badge: "CLASSIC", readTime: "14 min read" }, styles: { backgroundColor: "#f8fafc", padding: "20px 40px", borderBottom: "1px solid #e2e8f0" }, position: { x: 0, y: 1280 } },
    { id: "blog-pick-2", type: "card", properties: { text: "How Stripe designs for developers", badge: "INTERVIEW", readTime: "18 min read" }, styles: { backgroundColor: "#f8fafc", padding: "20px 40px", borderBottom: "1px solid #e2e8f0" }, position: { x: 0, y: 1360 } },
    { id: "blog-author-1", type: "card", properties: { text: "Maya Chen", role: "Senior Design Editor", bio: "Former design lead at Figma and Airbnb. Writes about the intersection of design systems and human behavior.", articles: "142 articles" }, styles: { backgroundColor: "#0f172a", color: "#f1f5f9", padding: "32px 40px", borderRadius: "0" }, position: { x: 0, y: 1460 } },
    { id: "blog-newsletter-1", type: "container", properties: { text: "Get The Craft in your inbox", subtext: "Join 38,000 designers, engineers, and founders who read us every Thursday morning.", placeholder: "your@email.com", cta: "Subscribe free" }, styles: { backgroundColor: "#ef4444", color: "#ffffff", padding: "60px 40px", textAlign: "center" }, position: { x: 0, y: 1600 } },
    { id: "blog-footer-1", type: "footer", properties: { text: "The Craft · Design · Engineering · Product · Startups · AI · Culture\n© 2025 The Craft Media. All rights reserved." }, styles: { backgroundColor: "#0f172a", color: "#475569", padding: "40px", fontSize: "13px" }, position: { x: 0, y: 1760 } }
  ],
  settings: { theme: "light", layout: "responsive" }
};

// ─────────────────────────────────────────────
// 3. GUITAR STORE (E-COMMERCE)
// ─────────────────────────────────────────────
const guitarStoreTemplate = {
  name: "Guitar Store",
  description: "A fully-featured musical instrument e-commerce store with product categories, product grid with filters, product detail layout, cart, and checkout flow. Realistic guitar inventory included.",
  category: "ecommerce",
  builderType: "E-commerce",
  theme: {
    primaryColor: "#b45309",
    secondaryColor: "#d97706",
    bgColor: "#0c0a09",
    accentColor: "#fbbf24",
    fontStyle: "bold-display",
    previewGradient: "135deg, #1c1008 0%, #2d1a06 50%, #0c0a09 100%"
  },
  features: ["Announcement bar", "Store header with cart/search", "Category navigation", "Product grid with filters", "Product cards with ratings", "Product detail view", "Add to cart", "Wishlist", "Related products"],
  tags: ["ecommerce", "guitar", "music", "store", "shop", "instruments", "products"],
  sections: ["announcement-bar", "store-header", "category-nav", "hero-banner", "featured-categories", "product-grid", "filters", "product-detail", "cart", "footer"],
  components: [
    { id: "gs-announce-1", type: "navbar", properties: { text: "🎸 Free shipping on orders over $99 · Use code ROCKOUT for 10% off your first order" }, styles: { backgroundColor: "#b45309", color: "#fef3c7", padding: "9px 32px", fontSize: "13px", textAlign: "center", fontWeight: "600" }, position: { x: 0, y: 0 } },
    { id: "gs-header-1", type: "navbar", properties: { text: "StringCraft", links: ["Electric", "Acoustic", "Bass", "Classical", "Amps", "Pedals", "Strings", "Accessories"], cta: "🛒 Cart (0)" }, styles: { backgroundColor: "#0c0a09", color: "#fef3c7", padding: "16px 32px", borderBottom: "1px solid #1c1a17" }, position: { x: 0, y: 36 } },
    { id: "gs-hero-1", type: "hero", properties: { text: "Play the music inside you", subtext: "Professional-grade guitars from Fender, Gibson, PRS, Ibanez, and Yamaha. In stock. Ships today.", cta: "Shop Electric Guitars", cta2: "Browse All Guitars" }, styles: { backgroundColor: "#1c1008", color: "#fef3c7", padding: "80px 40px", backgroundImage: "linear-gradient(135deg, #1c1008 0%, #2d1a06 100%)" }, position: { x: 0, y: 88 } },
    { id: "gs-cats-header", type: "header", properties: { text: "Shop by Category" }, styles: { backgroundColor: "#0c0a09", color: "#fef3c7", padding: "48px 40px 24px", fontWeight: "800" }, position: { x: 0, y: 360 } },
    { id: "gs-cat-1", type: "card", properties: { text: "Electric Guitars", count: "248 models", icon: "⚡" }, styles: { backgroundColor: "#1c1a17", border: "1px solid #2d2a24", borderRadius: "10px", padding: "24px", color: "#fef3c7" }, position: { x: 40, y: 440 } },
    { id: "gs-cat-2", type: "card", properties: { text: "Acoustic Guitars", count: "186 models", icon: "🎵" }, styles: { backgroundColor: "#1c1a17", border: "1px solid #2d2a24", borderRadius: "10px", padding: "24px", color: "#fef3c7" }, position: { x: 240, y: 440 } },
    { id: "gs-cat-3", type: "card", properties: { text: "Bass Guitars", count: "94 models", icon: "🎸" }, styles: { backgroundColor: "#1c1a17", border: "1px solid #2d2a24", borderRadius: "10px", padding: "24px", color: "#fef3c7" }, position: { x: 440, y: 440 } },
    { id: "gs-cat-4", type: "card", properties: { text: "Amplifiers", count: "112 models", icon: "🔊" }, styles: { backgroundColor: "#1c1a17", border: "1px solid #2d2a24", borderRadius: "10px", padding: "24px", color: "#fef3c7" }, position: { x: 640, y: 440 } },
    { id: "gs-products-header", type: "header", properties: { text: "Featured Guitars", subtext: "Handpicked by our gear experts" }, styles: { backgroundColor: "#0c0a09", color: "#fef3c7", padding: "48px 40px 24px", fontWeight: "800" }, position: { x: 0, y: 600 } },
    { id: "gs-prod-1", type: "card", properties: { brand: "Fender", text: "Player II Stratocaster", price: "$849.99", originalPrice: "$999.99", discount: "15% OFF", rating: "4.8", reviews: "312", color: "3-Color Sunburst", availability: "In Stock", badge: "BESTSELLER" }, styles: { backgroundColor: "#1c1a17", border: "1px solid #2d2a24", borderRadius: "10px", overflow: "hidden", color: "#fef3c7" }, position: { x: 40, y: 700 } },
    { id: "gs-prod-2", type: "card", properties: { brand: "Gibson", text: "Les Paul Standard '60s", price: "$2,499.00", originalPrice: "$2,799.00", discount: "11% OFF", rating: "4.9", reviews: "187", color: "Iced Tea", availability: "In Stock", badge: "PREMIUM" }, styles: { backgroundColor: "#1c1a17", border: "1px solid #2d2a24", borderRadius: "10px", overflow: "hidden", color: "#fef3c7" }, position: { x: 280, y: 700 } },
    { id: "gs-prod-3", type: "card", properties: { brand: "PRS", text: "SE Custom 24", price: "$849.00", originalPrice: null, discount: null, rating: "4.7", reviews: "224", color: "Charcoal Burst", availability: "In Stock", badge: "NEW" }, styles: { backgroundColor: "#1c1a17", border: "1px solid #2d2a24", borderRadius: "10px", overflow: "hidden", color: "#fef3c7" }, position: { x: 520, y: 700 } },
    { id: "gs-prod-4", type: "card", properties: { brand: "Ibanez", text: "RG550 Genesis Collection", price: "$999.99", originalPrice: "$1,199.99", discount: "17% OFF", rating: "4.8", reviews: "156", color: "Road Flare Red", availability: "Low Stock — 3 left", badge: "HOT" }, styles: { backgroundColor: "#1c1a17", border: "1px solid #2d2a24", borderRadius: "10px", overflow: "hidden", color: "#fef3c7" }, position: { x: 760, y: 700 } },
    { id: "gs-prod-5", type: "card", properties: { brand: "Yamaha", text: "FG800 Acoustic", price: "$299.99", originalPrice: "$349.99", discount: "14% OFF", rating: "4.6", reviews: "891", color: "Natural", availability: "In Stock", badge: "BEST VALUE" }, styles: { backgroundColor: "#1c1a17", border: "1px solid #2d2a24", borderRadius: "10px", overflow: "hidden", color: "#fef3c7" }, position: { x: 40, y: 940 } },
    { id: "gs-prod-6", type: "card", properties: { brand: "Fender", text: "American Professional II Telecaster", price: "$1,599.99", originalPrice: null, discount: null, rating: "4.9", reviews: "203", color: "Miami Blue", availability: "In Stock", badge: "STAFF PICK" }, styles: { backgroundColor: "#1c1a17", border: "1px solid #2d2a24", borderRadius: "10px", overflow: "hidden", color: "#fef3c7" }, position: { x: 280, y: 940 } },
    { id: "gs-detail-header", type: "header", properties: { text: "Product Spotlight: Gibson Les Paul Standard '60s" }, styles: { backgroundColor: "#1c1008", color: "#fef3c7", padding: "48px 40px 24px", fontWeight: "800", borderTop: "2px solid #b45309" }, position: { x: 0, y: 1180 } },
    { id: "gs-specs-1", type: "container", properties: { text: "Body: Mahogany with AA Figured Maple top\nNeck: Mahogany, Rounded C profile\nFingerboard: Rosewood, 22 frets\nPickups: Burstbucker 61R / 61T humbuckers\nScale Length: 24.75\"\nFinish: Iced Tea\nCountry of Origin: USA\nWarranty: Limited Lifetime" }, styles: { backgroundColor: "#1c1a17", border: "1px solid #2d2a24", borderRadius: "10px", padding: "28px 32px", color: "#d6c9a8", fontFamily: "monospace", fontSize: "13px", lineHeight: "2" }, position: { x: 40, y: 1280 } },
    { id: "gs-addcart-1", type: "button", properties: { text: "Add to Cart — $2,499.00" }, styles: { backgroundColor: "#b45309", color: "#fef3c7", padding: "16px 40px", borderRadius: "8px", fontSize: "16px", fontWeight: "700", border: "none" }, position: { x: 40, y: 1520 } },
    { id: "gs-wishlist-1", type: "button", properties: { text: "♡ Save to Wishlist" }, styles: { backgroundColor: "transparent", color: "#d97706", padding: "14px 32px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", border: "2px solid #d97706" }, position: { x: 280, y: 1520 } },
    { id: "gs-footer-1", type: "footer", properties: { text: "StringCraft Music · Free shipping over $99 · 30-day returns · Price match guarantee\n© 2025 StringCraft Music, Inc. All rights reserved." }, styles: { backgroundColor: "#09080a", color: "#57534e", padding: "40px", fontSize: "13px", textAlign: "center", borderTop: "1px solid #1c1a17" }, position: { x: 0, y: 1640 } }
  ],
  settings: { theme: "dark", layout: "responsive" }
};

// ─────────────────────────────────────────────
// 4. PORTFOLIO
// ─────────────────────────────────────────────
const portfolioTemplate = {
  name: "Designer Portfolio",
  description: "A minimal, personal portfolio for designers and developers. Showcases selected work, case studies, skills, experience timeline, and a direct contact section. Personal and project-focused.",
  category: "portfolio",
  builderType: "Portfolio",
  theme: {
    primaryColor: "#f1f5f9",
    secondaryColor: "#94a3b8",
    bgColor: "#09090b",
    accentColor: "#22d3ee",
    fontStyle: "minimal-geometric",
    previewGradient: "135deg, #09090b 0%, #0f1117 50%, #0a0e1a 100%"
  },
  features: ["Minimal navigation", "Personal hero with role", "Selected work grid", "Case study cards", "Skills matrix", "Experience timeline", "Testimonials", "Resume download", "Contact form"],
  tags: ["portfolio", "designer", "developer", "personal", "work", "case-study", "creative"],
  sections: ["minimal-nav", "hero", "selected-work", "case-studies", "about", "skills", "experience", "testimonials", "contact", "footer"],
  components: [
    { id: "pf-nav-1", type: "navbar", properties: { text: "Alex Rivera", links: ["Work", "About", "Writing", "Contact"], cta: "Available for hire" }, styles: { backgroundColor: "#09090b", color: "#f1f5f9", padding: "20px 48px", borderBottom: "1px solid #18181b" }, position: { x: 0, y: 0 } },
    { id: "pf-hero-1", type: "hero", properties: { text: "Product Designer & Creative Technologist", subtext: "I design digital products that are fast, accessible, and genuinely useful. Previously at Figma, Stripe, and Linear. Now open to new opportunities.", cta: "View my work", cta2: "Download CV" }, styles: { backgroundColor: "#09090b", color: "#f1f5f9", padding: "120px 48px 80px" }, position: { x: 0, y: 60 } },
    { id: "pf-work-header", type: "header", properties: { text: "Selected Work", subtext: "A few projects I'm proud of" }, styles: { backgroundColor: "#09090b", color: "#f1f5f9", padding: "60px 48px 32px", fontWeight: "700" }, position: { x: 0, y: 380 } },
    { id: "pf-proj-1", type: "card", properties: { text: "Figma Plugin System Redesign", category: "Product Design · Design Systems", year: "2024", description: "Redesigned the plugin marketplace and developer experience for 4M+ Figma users. Reduced plugin discovery time by 60%.", tags: ["Figma", "Design Systems", "UX Research"], outcome: "4M users · 60% faster discovery" }, styles: { backgroundColor: "#0f0f13", border: "1px solid #18181b", borderRadius: "12px", padding: "32px", color: "#f1f5f9" }, position: { x: 48, y: 480 } },
    { id: "pf-proj-2", type: "card", properties: { text: "Stripe Dashboard Mobile", category: "Mobile Design · FinTech", year: "2024", description: "Led the mobile redesign of Stripe's merchant dashboard. Shipped to 500k+ merchants across iOS and Android.", tags: ["Mobile", "FinTech", "iOS", "Android"], outcome: "500k merchants · 4.8★ App Store" }, styles: { backgroundColor: "#0f0f13", border: "1px solid #18181b", borderRadius: "12px", padding: "32px", color: "#f1f5f9" }, position: { x: 48, y: 680 } },
    { id: "pf-proj-3", type: "card", properties: { text: "Linear Roadmap View", category: "Product Design · B2B SaaS", year: "2023", description: "Designed the new roadmap and timeline view for Linear. Now used by 80k+ engineering teams worldwide.", tags: ["B2B", "SaaS", "Data Visualization"], outcome: "80k teams · #1 requested feature" }, styles: { backgroundColor: "#0f0f13", border: "1px solid #18181b", borderRadius: "12px", padding: "32px", color: "#f1f5f9" }, position: { x: 48, y: 880 } },
    { id: "pf-about-1", type: "container", properties: { text: "About Me", bio: "I'm Alex, a product designer based in San Francisco. I've spent the last 7 years designing tools that developers and designers use every day. I care deeply about performance, accessibility, and the small details that make software feel alive.\n\nWhen I'm not designing, I'm writing about design systems, contributing to open-source projects, and teaching at the SF Design School." }, styles: { backgroundColor: "#0f0f13", border: "1px solid #18181b", borderRadius: "12px", padding: "48px", color: "#f1f5f9" }, position: { x: 48, y: 1100 } },
    { id: "pf-skills-header", type: "header", properties: { text: "Skills & Tools" }, styles: { backgroundColor: "#09090b", color: "#f1f5f9", padding: "48px 48px 24px", fontWeight: "700" }, position: { x: 0, y: 1340 } },
    { id: "pf-skills-1", type: "card", properties: { text: "Design", skills: ["Figma", "Framer", "Principle", "Protopie", "Adobe CC", "Spline 3D"] }, styles: { backgroundColor: "#0f0f13", border: "1px solid #18181b", borderRadius: "10px", padding: "24px", color: "#f1f5f9" }, position: { x: 48, y: 1420 } },
    { id: "pf-skills-2", type: "card", properties: { text: "Development", skills: ["React", "TypeScript", "CSS/Tailwind", "Next.js", "Storybook", "Git"] }, styles: { backgroundColor: "#0f0f13", border: "1px solid #18181b", borderRadius: "10px", padding: "24px", color: "#f1f5f9" }, position: { x: 320, y: 1420 } },
    { id: "pf-skills-3", type: "card", properties: { text: "Research", skills: ["User interviews", "Usability testing", "A/B testing", "Analytics", "Card sorting", "Journey mapping"] }, styles: { backgroundColor: "#0f0f13", border: "1px solid #18181b", borderRadius: "10px", padding: "24px", color: "#f1f5f9" }, position: { x: 592, y: 1420 } },
    { id: "pf-testimonial-1", type: "card", properties: { text: "\"Alex is the best designer I've worked with in 15 years. They have a rare ability to understand complex technical constraints and still ship beautiful, simple interfaces.\"", author: "Dylan Field", role: "CEO, Figma" }, styles: { backgroundColor: "#0a0e1a", border: "1px solid #1e293b", borderRadius: "12px", padding: "36px 40px", color: "#f1f5f9", borderLeft: "4px solid #22d3ee" }, position: { x: 48, y: 1620 } },
    { id: "pf-contact-1", type: "container", properties: { text: "Let's work together", subtext: "I'm currently available for full-time roles and select freelance projects. If you're building something interesting, I'd love to hear about it.", email: "alex@alexrivera.design", cta: "Send me a message" }, styles: { backgroundColor: "#09090b", color: "#f1f5f9", padding: "80px 48px", textAlign: "center", borderTop: "1px solid #18181b" }, position: { x: 0, y: 1820 } },
    { id: "pf-footer-1", type: "footer", properties: { text: "Alex Rivera · San Francisco, CA · alex@alexrivera.design\nDesigned and built by me · © 2025" }, styles: { backgroundColor: "#09090b", color: "#3f3f46", padding: "32px 48px", fontSize: "13px", borderTop: "1px solid #18181b" }, position: { x: 0, y: 2020 } }
  ],
  settings: { theme: "dark", layout: "responsive" }
};

// ─────────────────────────────────────────────
// 5. RESTAURANT
// ─────────────────────────────────────────────
const restaurantTemplate = {
  name: "Restaurant & Dining",
  description: "An atmospheric restaurant website with hero photography, full menu by category, chef specials, gallery, reservation system, opening hours, and location. Feels like a real dining destination.",
  category: "restaurant",
  builderType: "Restaurant",
  theme: {
    primaryColor: "#92400e",
    secondaryColor: "#d97706",
    bgColor: "#0c0a08",
    accentColor: "#fbbf24",
    fontStyle: "elegant-serif",
    previewGradient: "135deg, #0c0a08 0%, #1a1208 50%, #0f0c06 100%"
  },
  features: ["Atmospheric hero", "Menu by category", "Chef specials", "Photo gallery", "Reservation form", "Opening hours", "Location & map", "Reviews", "Private dining CTA"],
  tags: ["restaurant", "dining", "food", "menu", "reservation", "chef", "hospitality"],
  sections: ["hero", "about-intro", "menu-categories", "menu-items", "chef-specials", "gallery", "reservation", "opening-hours", "location", "reviews", "footer"],
  components: [
    { id: "rs-nav-1", type: "navbar", properties: { text: "Osteria Nobile", links: ["Menu", "Reservations", "Private Dining", "About", "Contact"] }, styles: { backgroundColor: "transparent", color: "#fef3c7", padding: "24px 48px", position: "absolute", top: 0, zIndex: 10, borderBottom: "none" }, position: { x: 0, y: 0 } },
    { id: "rs-hero-1", type: "hero", properties: { text: "Where every meal is a memory", subtext: "Modern Italian cuisine in the heart of San Francisco. Seasonal ingredients, handmade pasta, and a wine list curated by our sommelier.", cta: "Reserve a Table", cta2: "View Menu" }, styles: { backgroundColor: "#1a1208", color: "#fef3c7", padding: "160px 48px 100px", backgroundImage: "linear-gradient(to bottom, rgba(12,10,8,0.4) 0%, rgba(12,10,8,0.85) 100%)" }, position: { x: 0, y: 0 } },
    { id: "rs-intro-1", type: "container", properties: { text: "A table at Osteria Nobile is more than a meal — it's an evening. Chef Marco Bellini trained under Massimo Bottura in Modena before bringing his vision of modern Italian cooking to San Francisco. Every dish begins with what's best at the market that morning." }, styles: { backgroundColor: "#0c0a08", color: "#d6c9a8", padding: "60px 120px", textAlign: "center", fontSize: "18px", lineHeight: "1.9", fontStyle: "italic" }, position: { x: 0, y: 480 } },
    { id: "rs-menu-header", type: "header", properties: { text: "Our Menu", subtext: "Seasonal · Handmade · Italian" }, styles: { backgroundColor: "#0c0a08", color: "#fef3c7", padding: "48px 48px 24px", textAlign: "center", fontWeight: "800" }, position: { x: 0, y: 620 } },
    { id: "rs-menu-cats", type: "navbar", properties: { text: "Antipasti  ·  Primi  ·  Secondi  ·  Contorni  ·  Dolci  ·  Vini", links: ["Antipasti", "Primi", "Secondi", "Contorni", "Dolci", "Vini"] }, styles: { backgroundColor: "#0c0a08", color: "#d97706", padding: "12px 48px", fontSize: "14px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", borderBottom: "1px solid #1c1a17" }, position: { x: 0, y: 720 } },
    { id: "rs-dish-1", type: "card", properties: { text: "Burrata con Pomodori", category: "Antipasti", price: "€18", description: "Creamy burrata from Puglia, heirloom tomatoes, Sicilian basil oil, aged balsamic, grilled sourdough.", dietary: "🌿 Vegetarian" }, styles: { backgroundColor: "#13110d", border: "1px solid #2d2a24", borderRadius: "0", padding: "24px 32px", color: "#fef3c7", borderBottom: "1px solid #1c1a17" }, position: { x: 0, y: 800 } },
    { id: "rs-dish-2", type: "card", properties: { text: "Tagliatelle al Ragù Bolognese", category: "Primi", price: "€26", description: "Hand-rolled egg tagliatelle, 8-hour slow-cooked beef and pork ragù, Parmigiano Reggiano 36 months.", dietary: "" }, styles: { backgroundColor: "#13110d", border: "1px solid #2d2a24", borderRadius: "0", padding: "24px 32px", color: "#fef3c7", borderBottom: "1px solid #1c1a17" }, position: { x: 0, y: 940 } },
    { id: "rs-dish-3", type: "card", properties: { text: "Risotto ai Funghi Porcini", category: "Primi", price: "€28", description: "Carnaroli rice, fresh and dried porcini mushrooms, white truffle oil, aged Parmigiano, chives.", dietary: "🌿 Vegetarian" }, styles: { backgroundColor: "#13110d", border: "1px solid #2d2a24", borderRadius: "0", padding: "24px 32px", color: "#fef3c7", borderBottom: "1px solid #1c1a17" }, position: { x: 0, y: 1080 } },
    { id: "rs-dish-4", type: "card", properties: { text: "Branzino al Forno", category: "Secondi", price: "€38", description: "Whole roasted Mediterranean sea bass, capers, olives, cherry tomatoes, lemon, extra virgin olive oil.", dietary: "🐟 Fish" }, styles: { backgroundColor: "#13110d", border: "1px solid #2d2a24", borderRadius: "0", padding: "24px 32px", color: "#fef3c7", borderBottom: "1px solid #1c1a17" }, position: { x: 0, y: 1220 } },
    { id: "rs-dish-5", type: "card", properties: { text: "Tiramisù della Casa", category: "Dolci", price: "€14", description: "Our signature tiramisù. Savoiardi soaked in espresso and Marsala, mascarpone cream, Valrhona cocoa.", dietary: "🌿 Vegetarian" }, styles: { backgroundColor: "#13110d", border: "1px solid #2d2a24", borderRadius: "0", padding: "24px 32px", color: "#fef3c7", borderBottom: "1px solid #1c1a17" }, position: { x: 0, y: 1360 } },
    { id: "rs-chef-1", type: "container", properties: { text: "Chef's Special — This Week", dish: "Agnello alla Scottadito", description: "Grilled milk-fed lamb chops, rosemary and garlic marinade, roasted artichokes, salsa verde. Available Thursday–Sunday only.", price: "€46", badge: "SEASONAL" }, styles: { backgroundColor: "#1a1208", border: "2px solid #d97706", borderRadius: "12px", padding: "40px 48px", color: "#fef3c7", margin: "0 40px" }, position: { x: 40, y: 1500 } },
    { id: "rs-reservation-1", type: "container", properties: { text: "Reserve Your Table", subtext: "We recommend booking at least 48 hours in advance. For parties of 8 or more, please call us directly.", fields: ["Name", "Email", "Phone", "Date", "Time", "Party size", "Special requests"], cta: "Request Reservation" }, styles: { backgroundColor: "#0c0a08", color: "#fef3c7", padding: "80px 48px", textAlign: "center", borderTop: "2px solid #d97706" }, position: { x: 0, y: 1680 } },
    { id: "rs-hours-1", type: "card", properties: { text: "Opening Hours", hours: "Tuesday – Thursday: 6:00 PM – 10:30 PM\nFriday – Saturday: 5:30 PM – 11:30 PM\nSunday: 5:30 PM – 10:00 PM\nMonday: Closed", address: "742 Columbus Ave, San Francisco, CA 94133", phone: "+1 (415) 555-0182" }, styles: { backgroundColor: "#13110d", border: "1px solid #2d2a24", borderRadius: "12px", padding: "36px", color: "#d6c9a8" }, position: { x: 48, y: 1900 } },
    { id: "rs-review-1", type: "card", properties: { text: "\"The best Italian meal I've had outside of Italy. The tagliatelle bolognese alone is worth the trip. Chef Bellini is doing something truly special here.\"", author: "Eater SF", rating: "★★★★★" }, styles: { backgroundColor: "#13110d", border: "1px solid #2d2a24", borderRadius: "12px", padding: "32px", color: "#fef3c7", borderLeft: "4px solid #d97706" }, position: { x: 48, y: 2100 } },
    { id: "rs-footer-1", type: "footer", properties: { text: "Osteria Nobile · 742 Columbus Ave, San Francisco · +1 (415) 555-0182 · info@osterianobile.com\n© 2025 Osteria Nobile. All rights reserved." }, styles: { backgroundColor: "#09080a", color: "#57534e", padding: "40px 48px", fontSize: "13px", textAlign: "center", borderTop: "1px solid #1c1a17" }, position: { x: 0, y: 2260 } }
  ],
  settings: { theme: "dark", layout: "responsive" }
};

// ─────────────────────────────────────────────
// SEED RUNNER
// ─────────────────────────────────────────────
const templates = [saasTemplate, blogTemplate, guitarStoreTemplate, portfolioTemplate, restaurantTemplate];

const seedTemplates = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/buildx');
    console.log('Connected to MongoDB');

    await Template.deleteMany({});
    console.log('Cleared existing templates');

    await Template.insertMany(templates);
    console.log(`✅ Seeded ${templates.length} industry-specific templates:`);
    templates.forEach(t => console.log(`   • ${t.name} (${t.category})`));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding templates:', error);
    process.exit(1);
  }
};

seedTemplates();
