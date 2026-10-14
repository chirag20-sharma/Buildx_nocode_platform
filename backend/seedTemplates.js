import mongoose from 'mongoose';
import Template from './models/Template.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

// ─────────────────────────────────────────────
// 1. SAAS LANDING PAGE
// ─────────────────────────────────────────────
const saasTemplate = {
  name: "SaaS Landing Page",
  description: "Conversion-focused SaaS product page with interactive hero, real-time metrics, feature grid, 3-tier pricing cards, customer proof, and bottom-pinned footer.",
  category: "saas",
  builderType: "SaaS Landing Page",
  theme: {
    primaryColor: "#6366f1",
    secondaryColor: "#818cf8",
    bgColor: "#f8f8fb",
    accentColor: "#4f46e5",
    fontStyle: "modern-sans",
    previewGradient: "135deg, #eef2ff 0%, #e0e7ff 50%, #f5f3ff 100%"
  },
  features: [
    "Fixed navigation bar",
    "Conversion hero headline",
    "Live telemetry stat cards",
    "6-card responsive feature grid",
    "3-tier pricing cards with feature checks",
    "Customer quote testimonials",
    "High-impact conversion CTA",
    "Pinned responsive footer"
  ],
  tags: ["saas", "startup", "software", "analytics", "pricing", "b2b", "landing"],
  sections: ["navbar", "hero", "metrics", "features", "pricing", "testimonials", "cta", "footer"],
  components: [
    // 0. Navbar
    {
      id: "saas-nav",
      type: "navbar",
      parentId: null,
      order: 0,
      properties: {
        brand: "Flowlytics",
        brandUrl: "#",
        links: "Features, Pricing, Reviews, FAQ",
        linkUrls: "#features, #pricing, #testimonials, #faq",
        bg: "#0b0f19",
        color: "#f8fafc"
      },
      styles: { width: 1200, height: 60 },
      position: { x: 0, y: 0 }
    },

    // 1. Hero
    {
      id: "saas-hero",
      type: "hero",
      parentId: null,
      order: 1,
      properties: {
        heading: "Turn raw data into revenue decisions",
        subtext: "Flowlytics delivers real-time analytics, automated anomaly alerts, and executive board decks without complex BI setup.",
        cta: "Start 14-Day Free Trial",
        ctaHref: "#pricing",
        bg: "#0b0f19",
        color: "#f8fafc"
      },
      styles: { width: 1200, height: 320 },
      position: { x: 0, y: 60 }
    },

    // 2. Metrics / Stat Section
    {
      id: "saas-stats-sec",
      type: "section",
      parentId: null,
      order: 2,
      properties: {
        bg: "#111827",
        padding: 40,
        layout: "stack",
        align: "center",
        justify: "center"
      },
      styles: { width: 1200, height: 180 },
      position: { x: 0, y: 380 }
    },
    {
      id: "saas-stats-grid",
      type: "container",
      parentId: "saas-stats-sec",
      order: 0,
      properties: {
        layout: "grid",
        cols: 3,
        gap: 20,
        bg: "transparent",
        maxWidth: "1200px"
      },
      styles: { width: 1120, height: 120 },
      position: { x: 0, y: 0 }
    },
    {
      id: "saas-stat-1",
      type: "statcard",
      parentId: "saas-stats-grid",
      order: 0,
      properties: {
        value: "99.99%",
        label: "Uptime SLA",
        trend: "+0.2% vs last month"
      },
      styles: { width: 340, height: 100 },
      position: { x: 0, y: 0 }
    },
    {
      id: "saas-stat-2",
      type: "statcard",
      parentId: "saas-stats-grid",
      order: 1,
      properties: {
        value: "4.2M+",
        label: "Daily Events Processed",
        trend: "+38% YoY"
      },
      styles: { width: 340, height: 100 },
      position: { x: 0, y: 0 }
    },
    {
      id: "saas-stat-3",
      type: "statcard",
      parentId: "saas-stats-grid",
      order: 2,
      properties: {
        value: "1,200+",
        label: "Fast-Growing SaaS Teams",
        trend: "+120 this week"
      },
      styles: { width: 340, height: 100 },
      position: { x: 0, y: 0 }
    },

    // 3. Features Section
    {
      id: "saas-feat-sec",
      type: "section",
      parentId: null,
      order: 3,
      properties: {
        bg: "#0b0f19",
        padding: 60,
        layout: "stack",
        align: "center",
        gap: 24
      },
      styles: { width: 1200, height: 560 },
      position: { x: 0, y: 560 }
    },
    {
      id: "saas-feat-heading",
      type: "heading",
      parentId: "saas-feat-sec",
      order: 0,
      properties: {
        text: "Engineered for high-growth software teams",
        fontSize: 32,
        fontWeight: "700",
        color: "#f8fafc"
      },
      styles: { width: 800, height: 50 },
      position: { x: 0, y: 0 }
    },
    {
      id: "saas-feat-sub",
      type: "text",
      parentId: "saas-feat-sec",
      order: 1,
      properties: {
        text: "Replace fragmented spreadsheets and complex data pipelines with automated intelligence.",
        fontSize: 16,
        color: "#94a3b8"
      },
      styles: { width: 800, height: 30 },
      position: { x: 0, y: 0 }
    },
    {
      id: "saas-feat-grid",
      type: "container",
      parentId: "saas-feat-sec",
      order: 2,
      properties: {
        layout: "grid",
        cols: 3,
        gap: 20,
        bg: "transparent",
        maxWidth: "1200px"
      },
      styles: { width: 1120, height: 400 },
      position: { x: 0, y: 0 }
    },
    {
      id: "saas-f1",
      type: "card",
      parentId: "saas-feat-grid",
      order: 0,
      properties: {
        title: "⚡ Real-time Stream Analytics",
        body: "Sub-second ingestion from Postgres, Snowflake, Stripe, and Segment with zero ETL overhead.",
        bg: "#161f30",
        radius: 12
      },
      styles: { width: 340, height: 180 },
      position: { x: 0, y: 0 }
    },
    {
      id: "saas-f2",
      type: "card",
      parentId: "saas-feat-grid",
      order: 1,
      properties: {
        title: "🤖 AI Anomaly Detection",
        body: "Smart ML models constantly detect churn signals and abnormal conversion drops before you notice.",
        bg: "#161f30",
        radius: 12
      },
      styles: { width: 340, height: 180 },
      position: { x: 0, y: 0 }
    },
    {
      id: "saas-f3",
      type: "card",
      parentId: "saas-feat-grid",
      order: 2,
      properties: {
        title: "📊 1-Click Executive Reports",
        body: "Instantly generate monthly board packs, investor updates, and weekly KPI summaries in PDF or Slides.",
        bg: "#161f30",
        radius: 12
      },
      styles: { width: 340, height: 180 },
      position: { x: 0, y: 0 }
    },
    {
      id: "saas-f4",
      type: "card",
      parentId: "saas-feat-grid",
      order: 3,
      properties: {
        title: "🔐 Role-Based Access Control",
        body: "Granular tenant isolation, SOC2 Type II compliance, SSO, SAML, and audit logs ready out of the box.",
        bg: "#161f30",
        radius: 12
      },
      styles: { width: 340, height: 180 },
      position: { x: 0, y: 0 }
    },
    {
      id: "saas-f5",
      type: "card",
      parentId: "saas-feat-grid",
      order: 4,
      properties: {
        title: "🔗 50+ Native Integrations",
        body: "Connect your billing, product tracking, and CRM stacks in less than two minutes with no code.",
        bg: "#161f30",
        radius: 12
      },
      styles: { width: 340, height: 180 },
      position: { x: 0, y: 0 }
    },
    {
      id: "saas-f6",
      type: "card",
      parentId: "saas-feat-grid",
      order: 5,
      properties: {
        title: "📱 iOS & Android Mobile Apps",
        body: "Monitor MRR, ARR, and active users on the go with push alerts for mission-critical milestones.",
        bg: "#161f30",
        radius: 12
      },
      styles: { width: 340, height: 180 },
      position: { x: 0, y: 0 }
    },

    // 4. Pricing Section
    {
      id: "saas-pricing-sec",
      type: "section",
      parentId: null,
      order: 4,
      properties: {
        bg: "#111827",
        padding: 60,
        layout: "stack",
        align: "center",
        gap: 24
      },
      styles: { width: 1200, height: 560 },
      position: { x: 0, y: 1120 }
    },
    {
      id: "saas-price-heading",
      type: "heading",
      parentId: "saas-pricing-sec",
      order: 0,
      properties: {
        text: "Transparent, predictable pricing",
        fontSize: 32,
        fontWeight: "700",
        color: "#f8fafc"
      },
      styles: { width: 800, height: 50 },
      position: { x: 0, y: 0 }
    },
    {
      id: "saas-price-sub",
      type: "text",
      parentId: "saas-pricing-sec",
      order: 1,
      properties: {
        text: "No hidden seat costs. Scale as your telemetry data grows. Upgrade or cancel anytime.",
        fontSize: 16,
        color: "#94a3b8"
      },
      styles: { width: 800, height: 30 },
      position: { x: 0, y: 0 }
    },
    {
      id: "saas-price-grid",
      type: "container",
      parentId: "saas-pricing-sec",
      order: 2,
      properties: {
        layout: "grid",
        cols: 3,
        gap: 20,
        bg: "transparent",
        maxWidth: "1200px"
      },
      styles: { width: 1120, height: 420 },
      position: { x: 0, y: 0 }
    },
    {
      id: "saas-p1",
      type: "pricingcard",
      parentId: "saas-price-grid",
      order: 0,
      properties: {
        plan: "Starter",
        price: "$29/mo",
        features: "Up to 5 Dashboards, 50k monthly events, 3 team members, 14-day history, Community support"
      },
      styles: { width: 340, height: 380 },
      position: { x: 0, y: 0 }
    },
    {
      id: "saas-p2",
      type: "pricingcard",
      parentId: "saas-price-grid",
      order: 1,
      properties: {
        plan: "Pro Growth",
        price: "$79/mo",
        features: "Unlimited Dashboards, 1M monthly events, 15 team members, AI anomaly alerts, Priority support"
      },
      styles: { width: 340, height: 380 },
      position: { x: 0, y: 0 }
    },
    {
      id: "saas-p3",
      type: "pricingcard",
      parentId: "saas-price-grid",
      order: 2,
      properties: {
        plan: "Enterprise",
        price: "$249/mo",
        features: "Unlimited events, Unlimited seats, Dedicated CSM, Custom ETL connectors, 99.99% SLA, SOC2 & HIPAA"
      },
      styles: { width: 340, height: 380 },
      position: { x: 0, y: 0 }
    },

    // 5. Testimonial Section
    {
      id: "saas-test-sec",
      type: "section",
      parentId: null,
      order: 5,
      properties: {
        bg: "#0b0f19",
        padding: 50,
        layout: "stack",
        align: "center",
        gap: 24
      },
      styles: { width: 1200, height: 320 },
      position: { x: 0, y: 1680 }
    },
    {
      id: "saas-test-heading",
      type: "heading",
      parentId: "saas-test-sec",
      order: 0,
      properties: {
        text: "Loved by engineering and product teams",
        fontSize: 28,
        fontWeight: "700",
        color: "#f8fafc"
      },
      styles: { width: 800, height: 40 },
      position: { x: 0, y: 0 }
    },
    {
      id: "saas-test-grid",
      type: "container",
      parentId: "saas-test-sec",
      order: 1,
      properties: {
        layout: "grid",
        cols: 2,
        gap: 20,
        bg: "transparent",
        maxWidth: "1200px"
      },
      styles: { width: 1120, height: 180 },
      position: { x: 0, y: 0 }
    },
    {
      id: "saas-t1",
      type: "testimonial",
      parentId: "saas-test-grid",
      order: 0,
      properties: {
        quote: "Flowlytics replaced three separate BI subscriptions and paid for itself in our first week.",
        author: "Elena Rostova",
        role: "Head of Product at CloudScale"
      },
      styles: { width: 540, height: 160 },
      position: { x: 0, y: 0 }
    },
    {
      id: "saas-t2",
      type: "testimonial",
      parentId: "saas-test-grid",
      order: 1,
      properties: {
        quote: "The anomaly detection caught a payment gateway bug that would have cost us $40k in lost sales.",
        author: "Marcus Vance",
        role: "CTO at NexusFin"
      },
      styles: { width: 540, height: 160 },
      position: { x: 0, y: 0 }
    },

    // 6. Conversion CTA Section
    {
      id: "saas-cta-sec",
      type: "section",
      parentId: null,
      order: 6,
      properties: {
        bg: "#1e1b4b",
        padding: 50,
        layout: "stack",
        align: "center",
        justify: "center",
        gap: 16
      },
      styles: { width: 1200, height: 240 },
      position: { x: 0, y: 2000 }
    },
    {
      id: "saas-cta-heading",
      type: "heading",
      parentId: "saas-cta-sec",
      order: 0,
      properties: {
        text: "Ready to accelerate your product decisions?",
        fontSize: 30,
        fontWeight: "800",
        color: "#ffffff"
      },
      styles: { width: 800, height: 40 },
      position: { x: 0, y: 0 }
    },
    {
      id: "saas-cta-sub",
      type: "text",
      parentId: "saas-cta-sec",
      order: 1,
      properties: {
        text: "Join over 1,200 forward-thinking teams using Flowlytics today. No credit card required.",
        fontSize: 16,
        color: "#c7d2fe"
      },
      styles: { width: 800, height: 30 },
      position: { x: 0, y: 0 }
    },
    {
      id: "saas-cta-btn",
      type: "button",
      parentId: "saas-cta-sec",
      order: 2,
      properties: {
        text: "Get Started Free →",
        bg: "#6366f1",
        color: "#ffffff",
        radius: 8
      },
      styles: { width: 200, height: 46 },
      position: { x: 0, y: 0 }
    },

    // 7. Footer (Pinned to bottom)
    {
      id: "saas-footer",
      type: "footer",
      parentId: null,
      order: 7,
      properties: {
        text: "© 2026 Flowlytics, Inc. · Built with BuildX · Privacy Policy · Terms of Service",
        bg: "#070a12",
        color: "#64748b",
        pinBottom: true,
        position: "push-bottom"
      },
      styles: { width: 1200, height: 80 },
      position: { x: 0, y: 2240 }
    }
  ],
  settings: { theme: "dark", layout: "responsive" }
};

// ─────────────────────────────────────────────
// 2. EDITORIAL BLOG
// ─────────────────────────────────────────────
const blogTemplate = {
  name: "Editorial Blog",
  description: "A genuine publishing platform with featured lead story, 3-column article dispatches, editor picks, author highlights, and newsletter subscriber form.",
  category: "blog",
  builderType: "Blog",
  theme: {
    primaryColor: "#6366f1",
    secondaryColor: "#7c3aed",
    bgColor: "#ffffff",
    accentColor: "#4f46e5",
    fontStyle: "editorial-serif",
    previewGradient: "135deg, #f5f3ff 0%, #ede9fe 50%, #eef2ff 100%"
  },
  features: [
    "Editorial publication masthead",
    "Category navigation bar",
    "Hero feature story showcase",
    "3-column article grid",
    "Editor deep dives section",
    "Newsletter subscription card",
    "Pinned responsive footer"
  ],
  tags: ["blog", "editorial", "publishing", "articles", "content", "journalism", "news"],
  sections: ["navbar", "hero", "latest-articles", "editors-picks", "newsletter", "footer"],
  components: [
    // 0. Masthead Navbar
    {
      id: "blog-nav",
      type: "navbar",
      parentId: null,
      order: 0,
      properties: {
        brand: "The Craft",
        brandUrl: "#",
        links: "Design, Engineering, AI Research, Culture, Newsletter",
        linkUrls: "#articles, #picks, #about, #newsletter",
        bg: "#0f172a",
        color: "#f8fafc"
      },
      styles: { width: 1200, height: 60 },
      position: { x: 0, y: 0 }
    },

    // 1. Featured Story Hero
    {
      id: "blog-hero",
      type: "hero",
      parentId: null,
      order: 1,
      properties: {
        heading: "The Quiet Death of the Hamburger Menu",
        subtext: "After a decade of mobile dominance, the hamburger menu is fading from modern software. We sat down with 12 product leads to analyze what is winning.",
        cta: "Read Feature Story",
        ctaHref: "#latest-articles",
        bg: "#ffffff",
        color: "#0f172a"
      },
      styles: { width: 1200, height: 320 },
      position: { x: 0, y: 60 }
    },

    // 2. Latest Articles Grid Section
    {
      id: "blog-latest-sec",
      type: "section",
      parentId: null,
      order: 2,
      properties: {
        bg: "#f8fafc",
        padding: 50,
        layout: "stack",
        align: "start",
        gap: 24
      },
      styles: { width: 1200, height: 460 },
      position: { x: 0, y: 380 }
    },
    {
      id: "blog-latest-heading",
      type: "heading",
      parentId: "blog-latest-sec",
      order: 0,
      properties: {
        text: "Latest Dispatches",
        fontSize: 28,
        fontWeight: "800",
        color: "#0f172a"
      },
      styles: { width: 800, height: 40 },
      position: { x: 0, y: 0 }
    },
    {
      id: "blog-latest-grid",
      type: "container",
      parentId: "blog-latest-sec",
      order: 1,
      properties: {
        layout: "grid",
        cols: 3,
        gap: 24,
        bg: "transparent",
        maxWidth: "1200px"
      },
      styles: { width: 1120, height: 320 },
      position: { x: 0, y: 0 }
    },
    {
      id: "blog-a1",
      type: "blogcard",
      parentId: "blog-latest-grid",
      order: 0,
      properties: {
        title: "How Linear Builds Software at the Speed of Thought",
        author: "Maya Chen",
        category: "Engineering",
        readTime: "7 min read"
      },
      styles: { width: 340, height: 260 },
      position: { x: 0, y: 0 }
    },
    {
      id: "blog-a2",
      type: "blogcard",
      parentId: "blog-latest-grid",
      order: 1,
      properties: {
        title: "Claude 3.7 vs GPT-4.5: An Honest Creative Evaluation",
        author: "Julian Vance",
        category: "AI Research",
        readTime: "11 min read"
      },
      styles: { width: 340, height: 260 },
      position: { x: 0, y: 0 }
    },
    {
      id: "blog-a3",
      type: "blogcard",
      parentId: "blog-latest-grid",
      order: 2,
      properties: {
        title: "Why Restraint is the Most Underrated Skill in UI Design",
        author: "Sophie Lin",
        category: "Design",
        readTime: "5 min read"
      },
      styles: { width: 340, height: 260 },
      position: { x: 0, y: 0 }
    },

    // 3. Editor's Picks Section
    {
      id: "blog-picks-sec",
      type: "section",
      parentId: null,
      order: 3,
      properties: {
        bg: "#ffffff",
        padding: 50,
        layout: "stack",
        align: "start",
        gap: 24
      },
      styles: { width: 1200, height: 440 },
      position: { x: 0, y: 840 }
    },
    {
      id: "blog-picks-heading",
      type: "heading",
      parentId: "blog-picks-sec",
      order: 0,
      properties: {
        text: "Editor's Deep Dives",
        fontSize: 26,
        fontWeight: "800",
        color: "#0f172a"
      },
      styles: { width: 800, height: 40 },
      position: { x: 0, y: 0 }
    },
    {
      id: "blog-picks-grid",
      type: "container",
      parentId: "blog-picks-sec",
      order: 1,
      properties: {
        layout: "grid",
        cols: 2,
        gap: 24,
        bg: "transparent",
        maxWidth: "1200px"
      },
      styles: { width: 1120, height: 300 },
      position: { x: 0, y: 0 }
    },
    {
      id: "blog-p1",
      type: "blogcard",
      parentId: "blog-picks-grid",
      order: 0,
      properties: {
        title: "The 10 Ergonomic Design Principles Airbnb Never Documented",
        author: "David Kross",
        category: "Design Systems",
        readTime: "14 min read"
      },
      styles: { width: 540, height: 260 },
      position: { x: 0, y: 0 }
    },
    {
      id: "blog-p2",
      type: "blogcard",
      parentId: "blog-picks-grid",
      order: 1,
      properties: {
        title: "From 0 to 50k Paid Subscribers Without Spending a Dollar on Ads",
        author: "Elena Rostova",
        category: "Growth",
        readTime: "9 min read"
      },
      styles: { width: 540, height: 260 },
      position: { x: 0, y: 0 }
    },

    // 4. Newsletter Section
    {
      id: "blog-sub-sec",
      type: "section",
      parentId: null,
      order: 4,
      properties: {
        bg: "#0f172a",
        padding: 50,
        layout: "stack",
        align: "center",
        justify: "center",
        gap: 16
      },
      styles: { width: 1200, height: 460 },
      position: { x: 0, y: 1280 }
    },
    {
      id: "blog-sub-heading",
      type: "heading",
      parentId: "blog-sub-sec",
      order: 0,
      properties: {
        text: "Get The Craft in your inbox every Thursday",
        fontSize: 26,
        fontWeight: "700",
        color: "#ffffff"
      },
      styles: { width: 800, height: 40 },
      position: { x: 0, y: 0 }
    },
    {
      id: "blog-sub-sub",
      type: "text",
      parentId: "blog-sub-sec",
      order: 1,
      properties: {
        text: "Join 45,000 product engineers, founders, and designers receiving our unfiltered weekly essays.",
        fontSize: 15,
        color: "#94a3b8"
      },
      styles: { width: 800, height: 30 },
      position: { x: 0, y: 0 }
    },
    {
      id: "blog-form",
      type: "formblock",
      parentId: "blog-sub-sec",
      order: 2,
      properties: {
        title: "Subscribe to The Weekly Dispatch",
        cta: "Subscribe Now"
      },
      styles: { width: 440, height: 280 },
      position: { x: 0, y: 0 }
    },

    // 5. Pinned Footer
    {
      id: "blog-footer",
      type: "footer",
      parentId: null,
      order: 5,
      properties: {
        text: "© 2026 The Craft Media Inc. · Independent Tech & Design Journalism · All rights reserved.",
        bg: "#080c14",
        color: "#64748b",
        pinBottom: true,
        position: "push-bottom"
      },
      styles: { width: 1200, height: 80 },
      position: { x: 0, y: 1740 }
    }
  ],
  settings: { theme: "light", layout: "responsive" }
};

// ─────────────────────────────────────────────
// 3. GUITAR STORE (E-COMMERCE)
// ─────────────────────────────────────────────
const guitarStoreTemplate = {
  name: "Guitar Store",
  description: "A comprehensive musical instrument e-commerce store with instrument categories, featured product cards with ratings, musician reviews, and sticky/pinned bottom footer.",
  category: "ecommerce",
  builderType: "E-commerce",
  theme: {
    primaryColor: "#6366f1",
    secondaryColor: "#d97706",
    bgColor: "#f8f8fb",
    accentColor: "#4f46e5",
    fontStyle: "bold-display",
    previewGradient: "135deg, #f0fdf4 0%, #e0e7ff 50%, #eef2ff 100%"
  },
  features: [
    "E-commerce navigation with departments",
    "Hero promotion with immediate CTA",
    "Category cards with iconography",
    "6 product showcase cards with prices & ratings",
    "Verified musician customer reviews",
    "Pinned responsive footer"
  ],
  tags: ["ecommerce", "guitar", "music", "store", "shop", "instruments", "products"],
  sections: ["navbar", "hero", "categories", "featured-products", "reviews", "footer"],
  components: [
    // 0. Navbar
    {
      id: "gs-nav",
      type: "navbar",
      parentId: null,
      order: 0,
      properties: {
        brand: "StringCraft Guitars",
        brandUrl: "#",
        links: "Electric, Acoustic, Bass, Amps, Pedals, Contact",
        linkUrls: "#electric, #acoustic, #spotlight, #reviews, #contact",
        bg: "#0c0a09",
        color: "#fef3c7"
      },
      styles: { width: 1200, height: 60 },
      position: { x: 0, y: 0 }
    },

    // 1. Hero
    {
      id: "gs-hero",
      type: "hero",
      parentId: null,
      order: 1,
      properties: {
        heading: "Play the Music Inside You",
        subtext: "Handcrafted electrics, golden-era acoustics, and boutique tube amps from Fender, Gibson, PRS, and Martin. Tested and setup by master luthiers before shipping.",
        cta: "Explore Electric Guitars",
        ctaHref: "#featured-products",
        bg: "#1c1008",
        color: "#fef3c7"
      },
      styles: { width: 1200, height: 320 },
      position: { x: 0, y: 60 }
    },

    // 2. Categories Section
    {
      id: "gs-cat-sec",
      type: "section",
      parentId: null,
      order: 2,
      properties: {
        bg: "#14100c",
        padding: 50,
        layout: "stack",
        align: "start",
        gap: 20
      },
      styles: { width: 1200, height: 320 },
      position: { x: 0, y: 380 }
    },
    {
      id: "gs-cat-heading",
      type: "heading",
      parentId: "gs-cat-sec",
      order: 0,
      properties: {
        text: "Shop by Instrument Category",
        fontSize: 28,
        fontWeight: "800",
        color: "#fef3c7"
      },
      styles: { width: 800, height: 40 },
      position: { x: 0, y: 0 }
    },
    {
      id: "gs-cat-grid",
      type: "container",
      parentId: "gs-cat-sec",
      order: 1,
      properties: {
        layout: "grid",
        cols: 4,
        gap: 16,
        bg: "transparent",
        maxWidth: "1200px"
      },
      styles: { width: 1120, height: 180 },
      position: { x: 0, y: 0 }
    },
    {
      id: "gs-c1",
      type: "card",
      parentId: "gs-cat-grid",
      order: 0,
      properties: {
        title: "⚡ Electric Guitars",
        body: "Stratocasters, Les Pauls, and extended-range shred machines for every genre.",
        bg: "#211a14",
        radius: 10
      },
      styles: { width: 260, height: 160 },
      position: { x: 0, y: 0 }
    },
    {
      id: "gs-c2",
      type: "card",
      parentId: "gs-cat-grid",
      order: 1,
      properties: {
        title: "🎵 Acoustic Guitars",
        body: "Dreadnoughts, parlor models, and cutaways with solid spruce and mahogany tops.",
        bg: "#211a14",
        radius: 10
      },
      styles: { width: 260, height: 160 },
      position: { x: 0, y: 0 }
    },
    {
      id: "gs-c3",
      type: "card",
      parentId: "gs-cat-grid",
      order: 2,
      properties: {
        title: "🎸 Bass Guitars",
        body: "4 and 5-string precision basses with thunderous low-end punch and clarity.",
        bg: "#211a14",
        radius: 10
      },
      styles: { width: 260, height: 160 },
      position: { x: 0, y: 0 }
    },
    {
      id: "gs-c4",
      type: "card",
      parentId: "gs-cat-grid",
      order: 3,
      properties: {
        title: "🔊 Tube Amps & Cabs",
        body: "All-tube heads, boutique combos, and digital modeling processors.",
        bg: "#211a14",
        radius: 10
      },
      styles: { width: 260, height: 160 },
      position: { x: 0, y: 0 }
    },

    // 3. Featured Products Grid Section
    {
      id: "gs-prod-sec",
      type: "section",
      parentId: null,
      order: 3,
      properties: {
        bg: "#0c0a09",
        padding: 60,
        layout: "stack",
        align: "start",
        gap: 24
      },
      styles: { width: 1200, height: 760 },
      position: { x: 0, y: 700 }
    },
    {
      id: "gs-prod-heading",
      type: "heading",
      parentId: "gs-prod-sec",
      order: 0,
      properties: {
        text: "Featured Guitars In Stock",
        fontSize: 30,
        fontWeight: "800",
        color: "#fef3c7"
      },
      styles: { width: 800, height: 40 },
      position: { x: 0, y: 0 }
    },
    {
      id: "gs-prod-sub",
      type: "text",
      parentId: "gs-prod-sec",
      order: 1,
      properties: {
        text: "Each instrument includes a certified 55-point inspection, fresh strings, and pro setup.",
        fontSize: 15,
        color: "#d6c9a8"
      },
      styles: { width: 800, height: 30 },
      position: { x: 0, y: 0 }
    },
    {
      id: "gs-prod-grid",
      type: "container",
      parentId: "gs-prod-sec",
      order: 2,
      properties: {
        layout: "grid",
        cols: 3,
        gap: 20,
        bg: "transparent",
        maxWidth: "1200px"
      },
      styles: { width: 1120, height: 620 },
      position: { x: 0, y: 0 }
    },
    {
      id: "gs-p1",
      type: "productcard",
      parentId: "gs-prod-grid",
      order: 0,
      properties: {
        name: "Player II Stratocaster",
        brand: "Fender",
        price: "$849.99",
        rating: 4.9
      },
      styles: { width: 340, height: 290 },
      position: { x: 0, y: 0 }
    },
    {
      id: "gs-p2",
      type: "productcard",
      parentId: "gs-prod-grid",
      order: 1,
      properties: {
        name: "Les Paul Standard '60s",
        brand: "Gibson",
        price: "$2,499.00",
        rating: 5.0
      },
      styles: { width: 340, height: 290 },
      position: { x: 0, y: 0 }
    },
    {
      id: "gs-p3",
      type: "productcard",
      parentId: "gs-prod-grid",
      order: 2,
      properties: {
        name: "SE Custom 24 Charcoal",
        brand: "PRS Guitars",
        price: "$879.00",
        rating: 4.8
      },
      styles: { width: 340, height: 290 },
      position: { x: 0, y: 0 }
    },
    {
      id: "gs-p4",
      type: "productcard",
      parentId: "gs-prod-grid",
      order: 3,
      properties: {
        name: "RG550 Genesis Collection",
        brand: "Ibanez",
        price: "$999.99",
        rating: 4.7
      },
      styles: { width: 340, height: 290 },
      position: { x: 0, y: 0 }
    },
    {
      id: "gs-p5",
      type: "productcard",
      parentId: "gs-prod-grid",
      order: 4,
      properties: {
        name: "FG800 Solid Top Acoustic",
        brand: "Yamaha",
        price: "$329.99",
        rating: 4.8
      },
      styles: { width: 340, height: 290 },
      position: { x: 0, y: 0 }
    },
    {
      id: "gs-p6",
      type: "productcard",
      parentId: "gs-prod-grid",
      order: 5,
      properties: {
        name: "American Pro II Telecaster",
        brand: "Fender",
        price: "$1,699.99",
        rating: 4.9
      },
      styles: { width: 340, height: 290 },
      position: { x: 0, y: 0 }
    },

    // 4. Customer Reviews Section
    {
      id: "gs-review-sec",
      type: "section",
      parentId: null,
      order: 4,
      properties: {
        bg: "#14100c",
        padding: 50,
        layout: "stack",
        align: "start",
        gap: 20
      },
      styles: { width: 1200, height: 300 },
      position: { x: 0, y: 1460 }
    },
    {
      id: "gs-rev-heading",
      type: "heading",
      parentId: "gs-review-sec",
      order: 0,
      properties: {
        text: "What Musicians Say About StringCraft",
        fontSize: 26,
        fontWeight: "800",
        color: "#fef3c7"
      },
      styles: { width: 800, height: 40 },
      position: { x: 0, y: 0 }
    },
    {
      id: "gs-rev-grid",
      type: "container",
      parentId: "gs-review-sec",
      order: 1,
      properties: {
        layout: "grid",
        cols: 2,
        gap: 20,
        bg: "transparent",
        maxWidth: "1200px"
      },
      styles: { width: 1120, height: 180 },
      position: { x: 0, y: 0 }
    },
    {
      id: "gs-t1",
      type: "testimonial",
      parentId: "gs-rev-grid",
      order: 0,
      properties: {
        quote: "The Les Paul arrived perfectly tuned right out of the box. StringCraft's luthier setup is genuine master craft.",
        author: "Dan Hawkins",
        role: "Session Guitarist, Nashville"
      },
      styles: { width: 540, height: 160 },
      position: { x: 0, y: 0 }
    },
    {
      id: "gs-t2",
      type: "testimonial",
      parentId: "gs-rev-grid",
      order: 1,
      properties: {
        quote: "Fastest insured shipping in North America. Their instrument packing is indestructible.",
        author: "Sarah Koenig",
        role: "Touring Musician"
      },
      styles: { width: 540, height: 160 },
      position: { x: 0, y: 0 }
    },

    // 5. Pinned Footer
    {
      id: "gs-footer",
      type: "footer",
      parentId: null,
      order: 5,
      properties: {
        text: "© 2026 StringCraft Guitars · Free Shipping on orders over $99 · 30-Day Money-Back Guarantee",
        bg: "#060504",
        color: "#78716c",
        pinBottom: true,
        position: "push-bottom"
      },
      styles: { width: 1200, height: 80 },
      position: { x: 0, y: 1760 }
    }
  ],
  settings: { theme: "dark", layout: "responsive" }
};

// ─────────────────────────────────────────────
// 4. PORTFOLIO
// ─────────────────────────────────────────────
const portfolioTemplate = {
  name: "Designer Portfolio",
  description: "A minimal, high-impact personal portfolio for product designers and creative technologists with selected case studies, skill matrix, testimonials, and contact form.",
  category: "portfolio",
  builderType: "Portfolio",
  theme: {
    primaryColor: "#6366f1",
    secondaryColor: "#0891b2",
    bgColor: "#f8f8fb",
    accentColor: "#4f46e5",
    fontStyle: "minimal-geometric",
    previewGradient: "135deg, #f8fafc 0%, #e0e7ff 50%, #ede9fe 100%"
  },
  features: [
    "Clean personal masthead",
    "Statement hero banner",
    "Selected case study cards",
    "Core competencies matrix",
    "Peer executive endorsements",
    "Project inquiry contact block",
    "Pinned responsive footer"
  ],
  tags: ["portfolio", "designer", "developer", "personal", "work", "case-study", "creative"],
  sections: ["navbar", "hero", "case-studies", "skills", "endorsements", "contact", "footer"],
  components: [
    // 0. Navbar
    {
      id: "pf-nav",
      type: "navbar",
      parentId: null,
      order: 0,
      properties: {
        brand: "Alex Rivera",
        brandUrl: "#",
        links: "Selected Work, Experience, Skills, Endorsements, Contact",
        linkUrls: "#work, #experience, #skills, #testimonials, #contact",
        bg: "#09090b",
        color: "#f1f5f9"
      },
      styles: { width: 1200, height: 60 },
      position: { x: 0, y: 0 }
    },

    // 1. Hero
    {
      id: "pf-hero",
      type: "hero",
      parentId: null,
      order: 1,
      properties: {
        heading: "Product Designer & Creative Technologist",
        subtext: "Designing high-velocity digital tools that feel natural, accessible, and fast. Previously at Figma, Stripe, and Linear. Currently based in San Francisco and available for selected contracts.",
        cta: "Explore Case Studies",
        ctaHref: "#case-studies",
        bg: "#09090b",
        color: "#f1f5f9"
      },
      styles: { width: 1200, height: 320 },
      position: { x: 0, y: 60 }
    },

    // 2. Selected Work Section
    {
      id: "pf-work-sec",
      type: "section",
      parentId: null,
      order: 2,
      properties: {
        bg: "#0e0e12",
        padding: 60,
        layout: "stack",
        align: "start",
        gap: 24
      },
      styles: { width: 1200, height: 460 },
      position: { x: 0, y: 380 }
    },
    {
      id: "pf-work-heading",
      type: "heading",
      parentId: "pf-work-sec",
      order: 0,
      properties: {
        text: "Selected Case Studies",
        fontSize: 30,
        fontWeight: "800",
        color: "#f1f5f9"
      },
      styles: { width: 800, height: 40 },
      position: { x: 0, y: 0 }
    },
    {
      id: "pf-work-sub",
      type: "text",
      parentId: "pf-work-sec",
      order: 1,
      properties: {
        text: "Deep-dives into systems thinking, product architecture, and end-user outcomes.",
        fontSize: 15,
        color: "#94a3b8"
      },
      styles: { width: 800, height: 30 },
      position: { x: 0, y: 0 }
    },
    {
      id: "pf-work-grid",
      type: "container",
      parentId: "pf-work-sec",
      order: 2,
      properties: {
        layout: "grid",
        cols: 3,
        gap: 20,
        bg: "transparent",
        maxWidth: "1200px"
      },
      styles: { width: 1120, height: 260 },
      position: { x: 0, y: 0 }
    },
    {
      id: "pf-w1",
      type: "card",
      parentId: "pf-work-grid",
      order: 0,
      properties: {
        title: "Figma Community Ecosystem",
        body: "Redesigned developer marketplace and plugin discovery for 4M+ active creators. Reduced time-to-first-install by 45%.",
        bg: "#15151c",
        radius: 12
      },
      styles: { width: 340, height: 220 },
      position: { x: 0, y: 0 }
    },
    {
      id: "pf-w2",
      type: "card",
      parentId: "pf-work-grid",
      order: 1,
      properties: {
        title: "Stripe Mobile Dashboard",
        body: "Engineered responsive data visualization for 500k+ global merchants across iOS and Android with 4.9 App Store rating.",
        bg: "#15151c",
        radius: 12
      },
      styles: { width: 340, height: 220 },
      position: { x: 0, y: 0 }
    },
    {
      id: "pf-w3",
      type: "card",
      parentId: "pf-work-grid",
      order: 2,
      properties: {
        title: "Linear Roadmap Timeline",
        body: "Architected real-time dependency graphs and project milestone views used daily by over 80k engineering teams.",
        bg: "#15151c",
        radius: 12
      },
      styles: { width: 340, height: 220 },
      position: { x: 0, y: 0 }
    },

    // 3. Core Competencies Section
    {
      id: "pf-skills-sec",
      type: "section",
      parentId: null,
      order: 3,
      properties: {
        bg: "#09090b",
        padding: 50,
        layout: "stack",
        align: "start",
        gap: 20
      },
      styles: { width: 1200, height: 380 },
      position: { x: 0, y: 840 }
    },
    {
      id: "pf-skills-heading",
      type: "heading",
      parentId: "pf-skills-sec",
      order: 0,
      properties: {
        text: "Core Competencies",
        fontSize: 26,
        fontWeight: "700",
        color: "#f1f5f9"
      },
      styles: { width: 800, height: 40 },
      position: { x: 0, y: 0 }
    },
    {
      id: "pf-skills-grid",
      type: "container",
      parentId: "pf-skills-sec",
      order: 1,
      properties: {
        layout: "grid",
        cols: 3,
        gap: 20,
        bg: "transparent",
        maxWidth: "1200px"
      },
      styles: { width: 1120, height: 240 },
      position: { x: 0, y: 0 }
    },
    {
      id: "pf-s1",
      type: "card",
      parentId: "pf-skills-grid",
      order: 0,
      properties: {
        title: "🎨 Product & Design Systems",
        body: "Design tokens, component governance, Figma auto-layout, atomic UI frameworks, and WCAG AAA accessibility.",
        bg: "#15151c",
        radius: 12
      },
      styles: { width: 340, height: 200 },
      position: { x: 0, y: 0 }
    },
    {
      id: "pf-s2",
      type: "card",
      parentId: "pf-skills-grid",
      order: 1,
      properties: {
        title: "💻 Frontend Engineering",
        body: "React, TypeScript, Next.js, Tailwind CSS, WebGL/Three.js, performance profiling, and accessible DOM structures.",
        bg: "#15151c",
        radius: 12
      },
      styles: { width: 340, height: 200 },
      position: { x: 0, y: 0 }
    },
    {
      id: "pf-s3",
      type: "card",
      parentId: "pf-skills-grid",
      order: 2,
      properties: {
        title: "🔬 Quantitative UX Research",
        body: "User journey mapping, high-fidelity clickable prototyping, tree testing, and metrics-driven usability benchmarking.",
        bg: "#15151c",
        radius: 12
      },
      styles: { width: 340, height: 200 },
      position: { x: 0, y: 0 }
    },

    // 4. Testimonials Section
    {
      id: "pf-test-sec",
      type: "section",
      parentId: null,
      order: 4,
      properties: {
        bg: "#0e0e12",
        padding: 50,
        layout: "stack",
        align: "start",
        gap: 20
      },
      styles: { width: 1200, height: 320 },
      position: { x: 0, y: 1220 }
    },
    {
      id: "pf-test-heading",
      type: "heading",
      parentId: "pf-test-sec",
      order: 0,
      properties: {
        text: "Peer Endorsements",
        fontSize: 26,
        fontWeight: "700",
        color: "#f1f5f9"
      },
      styles: { width: 800, height: 40 },
      position: { x: 0, y: 0 }
    },
    {
      id: "pf-test-grid",
      type: "container",
      parentId: "pf-test-sec",
      order: 1,
      properties: {
        layout: "grid",
        cols: 2,
        gap: 20,
        bg: "transparent",
        maxWidth: "1200px"
      },
      styles: { width: 1120, height: 180 },
      position: { x: 0, y: 0 }
    },
    {
      id: "pf-t1",
      type: "testimonial",
      parentId: "pf-test-grid",
      order: 0,
      properties: {
        quote: "Alex is one of the rare designers who builds production-ready code. They understand systems at scale.",
        author: "Dylan Field",
        role: "CEO & Co-founder, Figma"
      },
      styles: { width: 540, height: 160 },
      position: { x: 0, y: 0 }
    },
    {
      id: "pf-t2",
      type: "testimonial",
      parentId: "pf-test-grid",
      order: 1,
      properties: {
        quote: "An extraordinary eye for polish and micro-interactions. Any product team is lucky to work with Alex.",
        author: "Karri Saarinen",
        role: "Co-founder & CEO, Linear"
      },
      styles: { width: 540, height: 160 },
      position: { x: 0, y: 0 }
    },

    // 5. Contact Section
    {
      id: "pf-contact-sec",
      type: "section",
      parentId: null,
      order: 5,
      properties: {
        bg: "#09090b",
        padding: 50,
        layout: "stack",
        align: "center",
        justify: "center",
        gap: 16
      },
      styles: { width: 1200, height: 460 },
      position: { x: 0, y: 1540 }
    },
    {
      id: "pf-contact-heading",
      type: "heading",
      parentId: "pf-contact-sec",
      order: 0,
      properties: {
        text: "Let's Build Something Exceptional",
        fontSize: 28,
        fontWeight: "700",
        color: "#f1f5f9"
      },
      styles: { width: 800, height: 40 },
      position: { x: 0, y: 0 }
    },
    {
      id: "pf-contact-sub",
      type: "text",
      parentId: "pf-contact-sec",
      order: 1,
      properties: {
        text: "Available for selected contract design, advisory, and founding design roles.",
        fontSize: 15,
        color: "#94a3b8"
      },
      styles: { width: 800, height: 30 },
      position: { x: 0, y: 0 }
    },
    {
      id: "pf-form",
      type: "formblock",
      parentId: "pf-contact-sec",
      order: 2,
      properties: {
        title: "Initiate a Project Conversation",
        cta: "Send Inquiry"
      },
      styles: { width: 440, height: 280 },
      position: { x: 0, y: 0 }
    },

    // 6. Pinned Footer
    {
      id: "pf-footer",
      type: "footer",
      parentId: null,
      order: 6,
      properties: {
        text: "© 2026 Alex Rivera · Designed & Published with BuildX · San Francisco, CA",
        bg: "#050507",
        color: "#52525b",
        pinBottom: true,
        position: "push-bottom"
      },
      styles: { width: 1200, height: 80 },
      position: { x: 0, y: 2000 }
    }
  ],
  settings: { theme: "dark", layout: "responsive" }
};

// ─────────────────────────────────────────────
// 5. RESTAURANT
// ─────────────────────────────────────────────
const restaurantTemplate = {
  name: "Restaurant & Dining",
  description: "An atmospheric dining destination website with culinary heritage story, signature handcrafted dishes, critical acclaim quotes, table reservations, and pinned footer.",
  category: "restaurant",
  builderType: "Restaurant",
  theme: {
    primaryColor: "#6366f1",
    secondaryColor: "#b45309",
    bgColor: "#f8f8fb",
    accentColor: "#4f46e5",
    fontStyle: "elegant-serif",
    previewGradient: "135deg, #fffbeb 0%, #ede9fe 50%, #eef2ff 100%"
  },
  features: [
    "Fine-dining navigation header",
    "Atmospheric hero invitation",
    "Chef culinary heritage section",
    "6 signature handcrafted dishes",
    "Michelin & Eater critical acclaim reviews",
    "Table reservation inquiry form",
    "Pinned responsive footer"
  ],
  tags: ["restaurant", "dining", "food", "menu", "reservation", "hospitality", "chef"],
  sections: ["navbar", "hero", "heritage", "signature-menu", "reviews", "reservations", "footer"],
  components: [
    // 0. Navbar
    {
      id: "rs-nav",
      type: "navbar",
      parentId: null,
      order: 0,
      properties: {
        brand: "Osteria Nobile",
        brandUrl: "#",
        links: "Antipasti, Primi & Secondi, Chef Specials, Reviews, Reservations",
        linkUrls: "#menu, #specials, #reviews, #reservation",
        bg: "#0c0a08",
        color: "#fef3c7"
      },
      styles: { width: 1200, height: 60 },
      position: { x: 0, y: 0 }
    },

    // 1. Hero
    {
      id: "rs-hero",
      type: "hero",
      parentId: null,
      order: 1,
      properties: {
        heading: "Where Every Meal Becomes a Memory",
        subtext: "Handmade pasta, seasonal ingredients from North Beach farmers markets, and sommelier-curated Italian vintages in the heart of San Francisco.",
        cta: "Reserve Your Table",
        ctaHref: "#reservations",
        bg: "#191209",
        color: "#fef3c7"
      },
      styles: { width: 1200, height: 320 },
      position: { x: 0, y: 60 }
    },

    // 2. Culinary Heritage Story Section
    {
      id: "rs-story-sec",
      type: "section",
      parentId: null,
      order: 2,
      properties: {
        bg: "#120d08",
        padding: 50,
        layout: "stack",
        align: "center",
        justify: "center",
        gap: 16
      },
      styles: { width: 1200, height: 240 },
      position: { x: 0, y: 380 }
    },
    {
      id: "rs-story-heading",
      type: "heading",
      parentId: "rs-story-sec",
      order: 0,
      properties: {
        text: "Culinary Heritage from Modena to California",
        fontSize: 28,
        fontWeight: "700",
        color: "#fef3c7"
      },
      styles: { width: 800, height: 40 },
      position: { x: 0, y: 0 }
    },
    {
      id: "rs-story-text",
      type: "text",
      parentId: "rs-story-sec",
      order: 1,
      properties: {
        text: "Chef Marco Bellini spent seven years under three-star Michelin mentorship in Emilia-Romagna before creating Osteria Nobile. Every morning begins with fresh flours, farm eggs, and slow-simmered sauces.",
        fontSize: 16,
        color: "#d6c9a8"
      },
      styles: { width: 800, height: 50 },
      position: { x: 0, y: 0 }
    },

    // 3. Signature Handcrafted Menu Section
    {
      id: "rs-menu-sec",
      type: "section",
      parentId: null,
      order: 3,
      properties: {
        bg: "#0c0a08",
        padding: 60,
        layout: "stack",
        align: "start",
        gap: 24
      },
      styles: { width: 1200, height: 580 },
      position: { x: 0, y: 620 }
    },
    {
      id: "rs-menu-heading",
      type: "heading",
      parentId: "rs-menu-sec",
      order: 0,
      properties: {
        text: "Signature Handcrafted Dishes",
        fontSize: 30,
        fontWeight: "800",
        color: "#fef3c7"
      },
      styles: { width: 800, height: 40 },
      position: { x: 0, y: 0 }
    },
    {
      id: "rs-menu-sub",
      type: "text",
      parentId: "rs-menu-sec",
      order: 1,
      properties: {
        text: "Prepared fresh each evening in our open kitchen.",
        fontSize: 15,
        color: "#d6c9a8"
      },
      styles: { width: 800, height: 30 },
      position: { x: 0, y: 0 }
    },
    {
      id: "rs-menu-grid",
      type: "container",
      parentId: "rs-menu-sec",
      order: 2,
      properties: {
        layout: "grid",
        cols: 3,
        gap: 20,
        bg: "transparent",
        maxWidth: "1200px"
      },
      styles: { width: 1120, height: 440 },
      position: { x: 0, y: 0 }
    },
    {
      id: "rs-d1",
      type: "card",
      parentId: "rs-menu-grid",
      order: 0,
      properties: {
        title: "Burrata Pugliese con Fichi",
        body: "Creamy imported burrata, grilled Mission figs, aged 25-yr balsamic, wild arugula, toasted focaccia.",
        bg: "#1a120b",
        radius: 10
      },
      styles: { width: 340, height: 180 },
      position: { x: 0, y: 0 }
    },
    {
      id: "rs-d2",
      type: "card",
      parentId: "rs-menu-grid",
      order: 1,
      properties: {
        title: "Tagliatelle al Ragù Bianco",
        body: "Hand-rolled ribbons of egg pasta, slow-braised veal and porcini ragù, Parmigiano Reggiano 36 mesi.",
        bg: "#1a120b",
        radius: 10
      },
      styles: { width: 340, height: 180 },
      position: { x: 0, y: 0 }
    },
    {
      id: "rs-d3",
      type: "card",
      parentId: "rs-menu-grid",
      order: 2,
      properties: {
        title: "Risotto al Tartufo Nero",
        body: "Carnaroli superfino rice, cultured butter, Parmigiano fonduta, shaved Norcia black truffle.",
        bg: "#1a120b",
        radius: 10
      },
      styles: { width: 340, height: 180 },
      position: { x: 0, y: 0 }
    },
    {
      id: "rs-d4",
      type: "card",
      parentId: "rs-menu-grid",
      order: 3,
      properties: {
        title: "Branzino Mediterraneo al Forno",
        body: "Whole roasted Mediterranean sea bass, taggiasca olives, baby capers, heirloom cherry tomatoes.",
        bg: "#1a120b",
        radius: 10
      },
      styles: { width: 340, height: 180 },
      position: { x: 0, y: 0 }
    },
    {
      id: "rs-d5",
      type: "card",
      parentId: "rs-menu-grid",
      order: 4,
      properties: {
        title: "Costoletta d'Agnello Scottadito",
        body: "Milk-fed Colorado lamb chops, salsa verde, rosemary sea salt, charred Romanesco artichoke.",
        bg: "#1a120b",
        radius: 10
      },
      styles: { width: 340, height: 180 },
      position: { x: 0, y: 0 }
    },
    {
      id: "rs-d6",
      type: "card",
      parentId: "rs-menu-grid",
      order: 5,
      properties: {
        title: "Tiramisù Tradizionale Nobile",
        body: "House-baked savoiardi dipped in cold-brew Illy espresso, Marsala zabaione, Valrhona 70% cocoa.",
        bg: "#1a120b",
        radius: 10
      },
      styles: { width: 340, height: 180 },
      position: { x: 0, y: 0 }
    },

    // 4. Critical Acclaim Reviews Section
    {
      id: "rs-rev-sec",
      type: "section",
      parentId: null,
      order: 4,
      properties: {
        bg: "#120d08",
        padding: 50,
        layout: "stack",
        align: "start",
        gap: 20
      },
      styles: { width: 1200, height: 300 },
      position: { x: 0, y: 1200 }
    },
    {
      id: "rs-rev-heading",
      type: "heading",
      parentId: "rs-rev-sec",
      order: 0,
      properties: {
        text: "Critical Acclaim",
        fontSize: 26,
        fontWeight: "800",
        color: "#fef3c7"
      },
      styles: { width: 800, height: 40 },
      position: { x: 0, y: 0 }
    },
    {
      id: "rs-rev-grid",
      type: "container",
      parentId: "rs-rev-sec",
      order: 1,
      properties: {
        layout: "grid",
        cols: 2,
        gap: 20,
        bg: "transparent",
        maxWidth: "1200px"
      },
      styles: { width: 1120, height: 180 },
      position: { x: 0, y: 0 }
    },
    {
      id: "rs-t1",
      type: "testimonial",
      parentId: "rs-rev-grid",
      order: 0,
      properties: {
        quote: "Chef Bellini delivers the most transportive Italian dining experience on the West Coast.",
        author: "Michelin Guide San Francisco",
        role: "Selected Restaurant 2025"
      },
      styles: { width: 540, height: 160 },
      position: { x: 0, y: 0 }
    },
    {
      id: "rs-t2",
      type: "testimonial",
      parentId: "rs-rev-grid",
      order: 1,
      properties: {
        quote: "The ragù alone is worth booking weeks in advance. Flawless hospitality and impeccable wine pairings.",
        author: "Eater SF",
        role: "Essential 38 Dining Destination"
      },
      styles: { width: 540, height: 160 },
      position: { x: 0, y: 0 }
    },

    // 5. Reservation Section
    {
      id: "rs-res-sec",
      type: "section",
      parentId: null,
      order: 5,
      properties: {
        bg: "#0c0a08",
        padding: 50,
        layout: "stack",
        align: "center",
        justify: "center",
        gap: 16
      },
      styles: { width: 1200, height: 460 },
      position: { x: 0, y: 1500 }
    },
    {
      id: "rs-res-heading",
      type: "heading",
      parentId: "rs-res-sec",
      order: 0,
      properties: {
        text: "Reserve Your Experience",
        fontSize: 28,
        fontWeight: "700",
        color: "#fef3c7"
      },
      styles: { width: 800, height: 40 },
      position: { x: 0, y: 0 }
    },
    {
      id: "rs-res-sub",
      type: "text",
      parentId: "rs-res-sec",
      order: 1,
      properties: {
        text: "We accommodate parties up to 8 guests. For private buyout inquiries, please contact our events team.",
        fontSize: 15,
        color: "#d6c9a8"
      },
      styles: { width: 800, height: 30 },
      position: { x: 0, y: 0 }
    },
    {
      id: "rs-form",
      type: "formblock",
      parentId: "rs-res-sec",
      order: 2,
      properties: {
        title: "Table Reservation Request",
        cta: "Request Table"
      },
      styles: { width: 440, height: 280 },
      position: { x: 0, y: 0 }
    },

    // 6. Pinned Footer
    {
      id: "rs-footer",
      type: "footer",
      parentId: null,
      order: 6,
      properties: {
        text: "© 2026 Osteria Nobile · 742 Columbus Ave, San Francisco, CA · +1 (415) 555-0182 · Closed Mondays",
        bg: "#050403",
        color: "#78716c",
        pinBottom: true,
        position: "push-bottom"
      },
      styles: { width: 1200, height: 80 },
      position: { x: 0, y: 1960 }
    }
  ],
  settings: { theme: "dark", layout: "responsive" }
};

// ─────────────────────────────────────────────
// SEED RUNNER
// ─────────────────────────────────────────────
const templates = [saasTemplate, blogTemplate, guitarStoreTemplate, portfolioTemplate, restaurantTemplate];

const seedTemplates = async () => {
  try {
    const mongoUri = process.env.MONGODBURL || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/buildx';
    console.log(`Connecting to MongoDB at: ${mongoUri.replace(/:[^:@]+@/, ':****@')}`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const deleteResult = await Template.deleteMany({});
    console.log(`Cleared existing templates (deleted count: ${deleteResult.deletedCount})`);

    const inserted = await Template.insertMany(templates);
    console.log(`✅ Successfully seeded ${inserted.length} modernized templates into database:`);
    inserted.forEach(t => {
      const componentTypes = [...new Set(t.components.map(c => c.type))];
      console.log(`   • ${t.name} (${t.category}) — ${t.components.length} components [${componentTypes.join(', ')}]`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding templates:', error);
    process.exit(1);
  }
};

seedTemplates();
