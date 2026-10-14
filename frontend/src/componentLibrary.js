export const COMPONENT_GROUPS = [
  {
    group: "Layout",
    items: [
      { type: "section",    label: "Section",     icon: "▬", defaultW: 800, defaultH: 200, props: { bg: "#f8fafc" } },
      { type: "container",  label: "Container",   icon: "▭", defaultW: 400, defaultH: 120, props: { bg: "#ffffff" } },
      { type: "columns",    label: "2 Columns",   icon: "⊟", defaultW: 600, defaultH: 120, props: { cols: 2 } },
    ]
  },
  {
    group: "Basic",
    items: [
      { type: "text",     label: "Text",    icon: "T",  defaultW: 300, defaultH: 40,  props: { text: "Your text here", fontSize: 16, color: "#1a1a1a" } },
      { type: "heading",  label: "Heading", icon: "H",  defaultW: 400, defaultH: 56,  props: { text: "Section Heading", fontSize: 32, fontWeight: "700", color: "#0f172a" } },
      { type: "button",   label: "Button",  icon: "▶",  defaultW: 160, defaultH: 44,  props: { text: "Click me", href: "", target: "_self", bg: "#6366f1", color: "#ffffff", radius: 8 } },
      { type: "divider",  label: "Divider", icon: "─",  defaultW: 400, defaultH: 2,   props: { color: "#e2e8f0" } },
      { type: "spacer",   label: "Spacer",  icon: "↕",  defaultW: 400, defaultH: 40,  props: {} },
    ]
  },
  {
    group: "Media",
    items: [
      { type: "image",     label: "Image",      icon: "🖼", defaultW: 320, defaultH: 220, props: { src: "", alt: "Image", fit: "cover", href: "", target: "_self" } },
      { type: "imagegrid", label: "Image Grid", icon: "▦", defaultW: 660, defaultH: 440, props: { cols: 3, gap: 8, aspectRatio: "1/1", fit: "cover", radius: 8, hoverEffect: "zoom", lightbox: false, desktopCols: 3, tabletCols: 2, mobileCols: 1, images: [{ src: "", alt: "Photo 1" }, { src: "", alt: "Photo 2" }, { src: "", alt: "Photo 3" }, { src: "", alt: "Photo 4" }, { src: "", alt: "Photo 5" }, { src: "", alt: "Photo 6" }] } },
      { type: "video",     label: "Video",      icon: "▶", defaultW: 480, defaultH: 270, props: { src: "", poster: "", controls: true } },
    ]
  },
  {
    group: "Navigation",
    items: [
      { type: "navbar", label: "Navbar", icon: "☰", defaultW: 800, defaultH: 60, props: { brand: "My Brand", brandUrl: "/", links: "Home, About, Contact", linkUrls: "#home, #about, #contact", target: "_self", bg: "#0f172a", color: "#f1f5f9" } },
      { type: "footer", label: "Footer", icon: "▬", defaultW: 800, defaultH: 80, props: { text: "© 2025 My Company. All rights reserved.", href: "", target: "_self", bg: "#0f172a", color: "#94a3b8", pinBottom: true, position: "push-bottom" } },
    ]
  },
  {
    group: "UI Components",
    items: [
      { type: "card",  label: "Card",  icon: "▣", defaultW: 280, defaultH: 180, props: { title: "Card Title", body: "Card description goes here.", bg: "#ffffff", radius: 12 } },
      { type: "badge", label: "Badge", icon: "◉", defaultW: 100, defaultH: 28,  props: { text: "New", bg: "#6366f1", color: "#ffffff" } },
      { type: "alert", label: "Alert", icon: "⚠", defaultW: 400, defaultH: 56,  props: { text: "This is an alert message.", type: "info" } },
      { type: "tabs",  label: "Tabs",  icon: "⊞", defaultW: 500, defaultH: 44,  props: { tabs: "Tab 1, Tab 2, Tab 3" } },
    ]
  },
  {
    group: "Forms",
    items: [
      { type: "input",     label: "Input",      icon: "▭", defaultW: 300, defaultH: 44,  props: { placeholder: "Enter text...", label: "Label" } },
      { type: "textarea",  label: "Textarea",   icon: "▭", defaultW: 300, defaultH: 100, props: { placeholder: "Enter message...", label: "Message" } },
      { type: "select",    label: "Select",     icon: "▾", defaultW: 200, defaultH: 44,  props: { label: "Choose option", options: "Option 1, Option 2, Option 3" } },
      { type: "checkbox",  label: "Checkbox",   icon: "☑", defaultW: 200, defaultH: 32,  props: { label: "I agree to terms" } },
      { type: "loginform", label: "Login Form", icon: "🔐", defaultW: 420, defaultH: 320, props: { title: "Welcome back", subtitle: "Sign in to continue", emailLabel: "Email", passwordLabel: "Password", buttonText: "Login" } },
      { type: "formblock", label: "Form",       icon: "📋", defaultW: 400, defaultH: 280, props: { title: "Contact Us", cta: "Send Message" } },
    ]
  },
  {
    group: "Business",
    items: [
      { type: "hero",        label: "Hero Section", icon: "★",  defaultW: 800, defaultH: 300, props: { heading: "Your Big Headline", subtext: "Supporting description text.", cta: "Get Started", ctaHref: "", target: "_self", bg: "#0f172a", color: "#f1f5f9" } },
      { type: "productcard", label: "Product Card", icon: "🛒", defaultW: 240, defaultH: 320, props: { name: "Product Name", price: "$99.99", brand: "Brand", rating: 4.5 } },
      { type: "pricingcard", label: "Pricing Card", icon: "💰", defaultW: 260, defaultH: 360, props: { plan: "Pro", price: "$49/mo", features: "Feature 1, Feature 2, Feature 3" } },
      { type: "testimonial", label: "Testimonial",  icon: "💬", defaultW: 360, defaultH: 160, props: { quote: "This product changed everything for us.", author: "Jane Doe", role: "CEO, Acme Inc." } },
      { type: "blogcard",    label: "Blog Card",    icon: "📰", defaultW: 300, defaultH: 240, props: { title: "Article Title", author: "Author Name", date: "June 2025", readTime: "5 min read", category: "Design" } },
      { type: "statcard",    label: "Stat Card",    icon: "📊", defaultW: 180, defaultH: 100, props: { value: "12,400", label: "Monthly Users", trend: "+24%" } },
    ]
  },
];

export const ALL_COMPONENTS = COMPONENT_GROUPS.flatMap(g => g.items);
export const SUPPORTED_COMPONENT_TYPES = ALL_COMPONENTS.map(c => c.type);
