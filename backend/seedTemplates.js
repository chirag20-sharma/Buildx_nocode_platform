import mongoose from 'mongoose';
import Template from './models/Template.js';
import dotenv from 'dotenv';

dotenv.config();

const templates = [
  {
    name: "Modern Landing Page",
    description: "A clean and modern landing page template with hero section, features, and CTA",
    category: "landing-page",
    thumbnail: "https://via.placeholder.com/400x300",
    components: [
      {
        id: "navbar-1",
        type: "navbar",
        properties: {
          title: "Your Brand",
          links: ["Home", "Features", "Pricing", "Contact"]
        },
        styles: {
          backgroundColor: "#ffffff",
          color: "#333333",
          padding: "20px"
        },
        position: { x: 0, y: 0 }
      },
      {
        id: "hero-1",
        type: "text",
        properties: {
          content: "Build Amazing Websites",
          fontSize: "48px",
          fontWeight: "bold"
        },
        styles: {
          textAlign: "center",
          color: "#667eea",
          marginTop: "100px"
        },
        position: { x: 0, y: 100 }
      },
      {
        id: "cta-1",
        type: "button",
        properties: {
          text: "Get Started Free",
          action: "redirect",
          url: "/signup"
        },
        styles: {
          backgroundColor: "#667eea",
          color: "white",
          padding: "15px 40px",
          borderRadius: "8px",
          fontSize: "18px"
        },
        position: { x: 50, y: 250 }
      }
    ],
    settings: {
      theme: "light",
      layout: "responsive"
    }
  },
  {
    name: "Portfolio Template",
    description: "Showcase your work with this elegant portfolio template",
    category: "portfolio",
    thumbnail: "https://via.placeholder.com/400x300",
    components: [
      {
        id: "header-1",
        type: "text",
        properties: {
          content: "John Doe",
          fontSize: "42px",
          fontWeight: "bold"
        },
        styles: {
          textAlign: "center",
          color: "#2c3e50"
        },
        position: { x: 0, y: 50 }
      },
      {
        id: "subtitle-1",
        type: "text",
        properties: {
          content: "Full Stack Developer",
          fontSize: "24px"
        },
        styles: {
          textAlign: "center",
          color: "#7f8c8d"
        },
        position: { x: 0, y: 120 }
      },
      {
        id: "image-1",
        type: "image",
        properties: {
          src: "https://via.placeholder.com/300",
          alt: "Profile"
        },
        styles: {
          borderRadius: "50%",
          width: "200px",
          height: "200px"
        },
        position: { x: 50, y: 200 }
      }
    ],
    settings: {
      theme: "light",
      layout: "responsive"
    }
  },
  {
    name: "E-commerce Product Page",
    description: "Perfect template for showcasing products with images and details",
    category: "ecommerce",
    thumbnail: "https://via.placeholder.com/400x300",
    components: [
      {
        id: "product-title-1",
        type: "text",
        properties: {
          content: "Premium Product",
          fontSize: "36px",
          fontWeight: "bold"
        },
        styles: {
          color: "#2c3e50"
        },
        position: { x: 0, y: 50 }
      },
      {
        id: "price-1",
        type: "text",
        properties: {
          content: "$99.99",
          fontSize: "32px",
          fontWeight: "bold"
        },
        styles: {
          color: "#27ae60"
        },
        position: { x: 0, y: 120 }
      },
      {
        id: "buy-button-1",
        type: "button",
        properties: {
          text: "Add to Cart",
          action: "submit"
        },
        styles: {
          backgroundColor: "#27ae60",
          color: "white",
          padding: "12px 30px",
          borderRadius: "6px"
        },
        position: { x: 0, y: 200 }
      }
    ],
    settings: {
      theme: "light",
      layout: "responsive"
    }
  },
  {
    name: "Blog Template",
    description: "Clean blog layout with article sections and sidebar",
    category: "blog",
    thumbnail: "https://via.placeholder.com/400x300",
    components: [
      {
        id: "blog-title-1",
        type: "text",
        properties: {
          content: "My Awesome Blog",
          fontSize: "40px",
          fontWeight: "bold"
        },
        styles: {
          textAlign: "center",
          color: "#34495e"
        },
        position: { x: 0, y: 50 }
      },
      {
        id: "article-1",
        type: "container",
        properties: {
          title: "Latest Article",
          content: "This is a sample blog post content..."
        },
        styles: {
          backgroundColor: "#ecf0f1",
          padding: "30px",
          borderRadius: "8px"
        },
        position: { x: 0, y: 150 }
      }
    ],
    settings: {
      theme: "light",
      layout: "responsive"
    }
  }
];

const seedTemplates = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/buildx');
    console.log('Connected to MongoDB');
    
    await Template.deleteMany({});
    console.log('Cleared existing templates');
    
    await Template.insertMany(templates);
    console.log('✅ Successfully seeded templates!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding templates:', error);
    process.exit(1);
  }
};

seedTemplates();