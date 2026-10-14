// Utility to escape HTML special characters
function escapeHTML(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Allow only http:, https:, or relative URLs; block javascript: and data:
function safeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (/^(https?:)?\/\//i.test(trimmed) || /^\/[^/]/i.test(trimmed) || /^[^:/?#]+$/i.test(trimmed)) {
    // Reject javascript: and data: schemes
    if (/^(javascript|data|vbscript):/i.test(trimmed)) return '';
    return trimmed;
  }
  if (/^https?:/i.test(trimmed)) return trimmed;
  return '';
}

// Validate CSS values: allow only alphanumeric, spaces, #, %, px, em, rem, (, ), ., -, /
function safeCSSValue(val) {
  if (!val && val !== 0) return '';
  return String(val).replace(/[^a-zA-Z0-9 #%.,()\-\/]/g, '');
}

// Validate integer/float CSS numbers
function safeCSSNumber(val, fallback = 0) {
  const n = parseFloat(val);
  return Number.isFinite(n) ? n : fallback;
}

function parseList(val, defaultList = []) {
  if (Array.isArray(val)) return val.map(x => String(x).trim()).filter(Boolean);
  if (typeof val === 'string') return val.split(',').map(x => x.trim()).filter(Boolean);
  return defaultList;
}

function toCSSJustify(val) {
  if (val === "between") return "space-between";
  if (val === "around") return "space-around";
  if (val === "evenly") return "space-evenly";
  if (val === "start") return "flex-start";
  if (val === "end") return "flex-end";
  if (val === "center") return "center";
  return val || "flex-start";
}

function toCSSAlign(val) {
  if (val === "start") return "flex-start";
  if (val === "end") return "flex-end";
  if (val === "center") return "center";
  if (val === "stretch") return "stretch";
  if (val === "baseline") return "baseline";
  return val || "stretch";
}

// Maps component type to HTML generation
const COMP_MAP = {
  navbar: (c) => {
    const brand = escapeHTML(c.properties?.brand || "My Brand");
    const brandUrl = safeUrl(c.properties?.brandUrl) || "#";
    const links = parseList(c.properties?.links, ["Home", "About", "Contact"]);
    const linkUrls = parseList(c.properties?.linkUrls, []);
    const target = c.properties?.target || "_self";
    const relAttr = target === "_blank" ? ' rel="noopener noreferrer"' : '';
    const bg = c.properties?.bg || "#0f172a";
    const color = c.properties?.color || "#f1f5f9";
    return `
  <nav class="bx-navbar" style="background-color: ${bg}; color: ${color};">
    <a href="${brandUrl}" target="${target}"${relAttr} class="bx-nav-brand" style="color: inherit; text-decoration: none; font-weight: 700;">${brand}</a>
    <div class="bx-nav-links">
      ${links.map((l, i) => {
        const rawUrl = linkUrls[i] || `#${l.toLowerCase().replace(/\s+/g, '-')}`;
        const url = safeUrl(rawUrl) || rawUrl;
        return `<a href="${url}" target="${target}"${relAttr} class="bx-nav-link" style="color: ${color}; text-decoration: none;">${escapeHTML(l)}</a>`;
      }).join("\n      ")}
    </div>
  </nav>`;
  },

  hero: (c) => {
    const heading = escapeHTML(c.properties?.heading || c.properties?.text || "Build Something Amazing");
    const subtext = escapeHTML(c.properties?.subtext || c.properties?.content || "The easiest way to design, build, and publish modern websites.");
    const cta = escapeHTML(c.properties?.cta || "Get Started");
    const ctaHref = safeUrl(c.properties?.ctaHref) || "#";
    const target = c.properties?.target || "_self";
    const relAttr = target === "_blank" ? ' rel="noopener noreferrer"' : '';
    const bg = c.properties?.bg || "#0f172a";
    const color = c.properties?.color || "#f1f5f9";
    return `
  <section class="bx-hero" style="background-color: ${bg}; color: ${color};">
    <div class="bx-hero-content">
      <h1>${heading}</h1>
      <p>${subtext}</p>
      ${cta ? `<a class="bx-button bx-hero-btn" href="${ctaHref}" target="${target}"${relAttr}>${cta}</a>` : ""}
    </div>
  </section>`;
  },

  header: (c) => {
    const title = escapeHTML(c.properties?.text || c.properties?.content || "Header Section");
    return `
  <header class="bx-header">
    <h2>${title}</h2>
  </header>`;
  },

  heading: (c) => {
    const text = escapeHTML(c.properties?.text || "Heading");
    const fontSize = c.properties?.fontSize ? `${c.properties.fontSize}px` : "32px";
    const fontWeight = c.properties?.fontWeight || "700";
    const color = c.properties?.color || "#0f172a";
    const href = safeUrl(c.properties?.href);
    const target = c.properties?.target || "_self";
    const relAttr = target === "_blank" ? ' rel="noopener noreferrer"' : '';
    const hEl = `<h2 class="bx-heading" style="font-size: ${fontSize}; font-weight: ${fontWeight}; color: ${color}; margin: 0;">${text}</h2>`;
    return href ? `  <a href="${href}" target="${target}"${relAttr} style="text-decoration: none; color: inherit;">${hEl}</a>` : `  ${hEl}`;
  },

  text: (c) => {
    const text = escapeHTML(c.properties?.text || c.properties?.content || "Text block");
    const fontSize = c.properties?.fontSize ? `${c.properties.fontSize}px` : "16px";
    const color = c.properties?.color || "#475569";
    const href = safeUrl(c.properties?.href);
    const target = c.properties?.target || "_self";
    const relAttr = target === "_blank" ? ' rel="noopener noreferrer"' : '';
    const pEl = `<p class="bx-text" style="font-size: ${fontSize}; color: ${color}; margin: 0;">${text}</p>`;
    return href ? `  <a href="${href}" target="${target}"${relAttr} style="text-decoration: none; color: inherit;">${pEl}</a>` : `  ${pEl}`;
  },

  button: (c) => {
    const text = escapeHTML(c.properties?.text || "Click me");
    const bg = c.properties?.bg || "#6366f1";
    const color = c.properties?.color || "#ffffff";
    const radius = safeCSSNumber(c.properties?.radius, 8);
    const href = safeUrl(c.properties?.href);
    const target = c.properties?.target || "_self";
    const relAttr = target === "_blank" ? ' rel="noopener noreferrer"' : '';
    if (href) {
      return `  <a href="${href}" target="${target}"${relAttr} class="bx-button" style="display: inline-flex; align-items: center; justify-content: center; text-decoration: none; background-color: ${safeCSSValue(bg)}; color: ${safeCSSValue(color)}; border-radius: ${radius}px; padding: 10px 20px;">${text}</a>`;
    }
    return `  <button class="bx-button" style="background-color: ${safeCSSValue(bg)}; color: ${safeCSSValue(color)}; border-radius: ${radius}px;">${text}</button>`;
  },

  image: (c) => {
    const src = safeUrl(c.properties?.src || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80");
    const alt = escapeHTML(c.properties?.alt || "Image");
    const fit = safeCSSValue(c.properties?.fit || "cover");
    const href = safeUrl(c.properties?.href);
    const target = c.properties?.target || "_self";
    const relAttr = target === "_blank" ? ' rel="noopener noreferrer"' : '';
    const imgEl = `<div class="bx-image-wrapper"><img class="bx-image" src="${escapeHTML(src)}" alt="${alt}" style="object-fit: ${fit};" /></div>`;
    return href ? `  <a href="${href}" target="${target}"${relAttr} style="display: block; text-decoration: none;">${imgEl}</a>` : `  ${imgEl}`;
  },

  imagegrid: (c) => {
    const cols = safeCSSNumber(c.properties?.cols || c.properties?.desktopCols, 3);
    const gap = safeCSSNumber(c.properties?.gap, 12);
    const radius = safeCSSNumber(c.properties?.radius, 8);
    const fit = safeCSSValue(c.properties?.fit || "cover");
    const rawImgs = Array.isArray(c.properties?.images) ? c.properties.images : [];
    const images = rawImgs.length > 0 ? rawImgs : [
      { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60", alt: "Photo 1" },
      { src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&auto=format&fit=crop&q=60", alt: "Photo 2" },
      { src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&auto=format&fit=crop&q=60", alt: "Photo 3" }
    ];
    return `
  <div class="bx-imagegrid" style="grid-template-columns: repeat(${cols}, 1fr); gap: ${gap}px;">
    ${images.map(img => `
      <div class="bx-imagegrid-item" style="border-radius: ${radius}px;">
        <img src="${escapeHTML(safeUrl(img.src || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60'))}" alt="${escapeHTML(img.alt || 'Grid Image')}" style="object-fit: ${fit}; border-radius: ${radius}px;" />
      </div>`).join("\n    ")}
  </div>`;
  },

  video: (c) => {
    const src = safeUrl(c.properties?.src || "");
    const poster = safeUrl(c.properties?.poster || "");
    const controls = c.properties?.controls !== false ? "controls" : "";
    if (!src) {
      return `
  <div class="bx-video-placeholder">
    <div class="bx-video-icon">▶</div>
    <p>Video Player (No source provided)</p>
  </div>`;
    }
    return `
  <div class="bx-video-wrapper">
    <video src="${escapeHTML(src)}" poster="${escapeHTML(poster)}" ${controls} class="bx-video"></video>
  </div>`;
  },

  divider: (c) => {
    const color = c.properties?.color || "#e2e8f0";
    return `  <hr class="bx-divider" style="border-color: ${color};" />`;
  },

  spacer: (c) => {
    const height = c.styles?.height || 40;
    return `  <div class="bx-spacer" style="height: ${height}px;"></div>`;
  },

  card: (c) => {
    const title = escapeHTML(c.properties?.title || "Card Title");
    const body = escapeHTML(c.properties?.body || "Card description goes here.");
    const bg = c.properties?.bg || "#ffffff";
    const radius = c.properties?.radius !== undefined ? `${c.properties.radius}px` : "12px";
    const href = safeUrl(c.properties?.href);
    const target = c.properties?.target || "_self";
    const relAttr = target === "_blank" ? ' rel="noopener noreferrer"' : '';
    const cardEl = `
  <div class="bx-card" style="background-color: ${bg}; border-radius: ${radius};">
    <h3>${title}</h3>
    <p>${body}</p>
  </div>`;
    return href ? `  <a href="${href}" target="${target}"${relAttr} style="text-decoration: none; color: inherit; display: block;">${cardEl}</a>` : cardEl;
  },

  badge: (c) => {
    const text = escapeHTML(c.properties?.text || "New");
    const bg = c.properties?.bg || "#6366f1";
    const color = c.properties?.color || "#ffffff";
    const href = safeUrl(c.properties?.href);
    const target = c.properties?.target || "_self";
    const relAttr = target === "_blank" ? ' rel="noopener noreferrer"' : '';
    const badgeEl = `<span class="bx-badge" style="background-color: ${bg}; color: ${color};">${text}</span>`;
    return href ? `  <a href="${href}" target="${target}"${relAttr} style="text-decoration: none; display: inline-block;">${badgeEl}</a>` : `  ${badgeEl}`;
  },

  alert: (c) => {
    const text = escapeHTML(c.properties?.text || "This is an alert message.");
    const type = c.properties?.type || "info";
    return `  <div class="bx-alert bx-alert-${type}">${text}</div>`;
  },

  tabs: (c) => {
    const tabs = parseList(c.properties?.tabs, ["Overview", "Features", "Pricing"]);
    const tabId = `tabs-${Math.random().toString(36).substr(2, 6)}`;
    return `
  <div class="bx-tabs" id="${tabId}">
    <div class="bx-tab-headers">
      ${tabs.map((t, idx) => `<button class="bx-tab-btn${idx === 0 ? ' active' : ''}" onclick="switchTab(this, '${tabId}', ${idx})">${escapeHTML(t)}</button>`).join("\n      ")}
    </div>
    <div class="bx-tab-contents">
      ${tabs.map((t, idx) => `<div class="bx-tab-pane${idx === 0 ? ' active' : ''}">${escapeHTML(t)} content panel.</div>`).join("\n      ")}
    </div>
  </div>`;
  },

  input: (c) => {
    const label = escapeHTML(c.properties?.label || "Label");
    const placeholder = escapeHTML(c.properties?.placeholder || "Enter text...");
    return `
  <div class="bx-form-group">
    <label class="bx-label">${label}</label>
    <input type="text" class="bx-input" placeholder="${placeholder}" />
  </div>`;
  },

  textarea: (c) => {
    const label = escapeHTML(c.properties?.label || "Message");
    const placeholder = escapeHTML(c.properties?.placeholder || "Enter message...");
    return `
  <div class="bx-form-group">
    <label class="bx-label">${label}</label>
    <textarea class="bx-textarea" placeholder="${placeholder}" rows="4"></textarea>
  </div>`;
  },

  select: (c) => {
    const label = escapeHTML(c.properties?.label || "Choose option");
    const options = parseList(c.properties?.options, ["Option 1", "Option 2", "Option 3"]);
    return `
  <div class="bx-form-group">
    <label class="bx-label">${label}</label>
    <select class="bx-select">
      ${options.map(o => `<option value="${escapeHTML(o)}">${escapeHTML(o)}</option>`).join("\n      ")}
    </select>
  </div>`;
  },

  checkbox: (c) => {
    const label = escapeHTML(c.properties?.label || "I agree to the terms");
    return `
  <label class="bx-checkbox-label">
    <input type="checkbox" class="bx-checkbox" />
    <span>${label}</span>
  </label>`;
  },

  formblock: (c) => {
    const title = escapeHTML(c.properties?.title || "Contact Us");
    const cta = escapeHTML(c.properties?.cta || "Send Message");
    return `
  <div class="bx-formblock">
    <h3>${title}</h3>
    <form class="bx-contact-form" onsubmit="window.handleFormSubmit ? window.handleFormSubmit(event, this) : event.preventDefault()">
      <div class="bx-form-group">
        <label class="bx-label">Name</label>
        <input type="text" name="name" class="bx-input" placeholder="Your full name" required />
      </div>
      <div class="bx-form-group">
        <label class="bx-label">Email</label>
        <input type="email" name="email" class="bx-input" placeholder="you@example.com" required />
      </div>
      <div class="bx-form-group">
        <label class="bx-label">Product / Message</label>
        <textarea name="message" class="bx-textarea" placeholder="Tell us which product or enquiry you have..." rows="3" required></textarea>
      </div>
      <button type="submit" class="bx-button bx-form-submit">${cta}</button>
      <div class="bx-form-msg" style="display:none; margin-top:12px; padding:10px 14px; border-radius:8px; font-size:13px; font-weight:600;"></div>
    </form>
  </div>`;
  },

  loginform: (c) => {
    const title = escapeHTML(c.properties?.title || "Welcome back");
    const subtitle = escapeHTML(c.properties?.subtitle || "Sign in to continue");
    const emailLabel = escapeHTML(c.properties?.emailLabel || "Email");
    const passwordLabel = escapeHTML(c.properties?.passwordLabel || "Password");
    const buttonText = escapeHTML(c.properties?.buttonText || "Login");

    return `
  <div class="bx-login-form-wrap">
    <div class="bx-login-card">
      <div class="bx-login-header">
        <h3>${title}</h3>
        <p>${subtitle}</p>
      </div>
      <form class="bx-login-form" onsubmit="event.preventDefault(); alert('Login submitted');">
        <div class="bx-form-group">
          <label class="bx-label">${emailLabel}</label>
          <input type="email" class="bx-input" placeholder="you@example.com" />
        </div>
        <div class="bx-form-group">
          <label class="bx-label">${passwordLabel}</label>
          <input type="password" class="bx-input" placeholder="••••••••" />
        </div>
        <button type="submit" class="bx-button bx-login-submit">${buttonText}</button>
      </form>
    </div>
  </div>`;
  },

  productcard: (c) => {
    const name = escapeHTML(c.properties?.name || "Premium Headphones");
    const brand = escapeHTML(c.properties?.brand || "AudioTech");
    const price = escapeHTML(c.properties?.price || "$199.99");
    const rating = c.properties?.rating || 4.8;
    const href = safeUrl(c.properties?.href);
    const target = c.properties?.target || "_self";
    const relAttr = target === "_blank" ? ' rel="noopener noreferrer"' : '';
    const pcardEl = `
  <div class="bx-product-card">
    <div class="bx-product-img">
      <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60" alt="${name}" />
    </div>
    <div class="bx-product-info">
      <span class="bx-product-brand">${brand}</span>
      <h4>${name}</h4>
      <div class="bx-product-rating">★ ${rating}</div>
      <div class="bx-product-price">${price}</div>
      <button class="bx-button bx-cart-btn">Add to Cart</button>
    </div>
  </div>`;
    return href ? `  <a href="${href}" target="${target}"${relAttr} style="text-decoration: none; color: inherit; display: block;">${pcardEl}</a>` : pcardEl;
  },

  pricingcard: (c) => {
    const plan = escapeHTML(c.properties?.plan || "Pro Plan");
    const price = escapeHTML(c.properties?.price || "$49/mo");
    const features = parseList(c.properties?.features, ["Unlimited Projects", "Custom Domains", "Analytics", "24/7 Support"]);
    return `
  <div class="bx-pricing-card">
    <div class="bx-pricing-header">
      <h3>${plan}</h3>
      <div class="bx-pricing-price">${price}</div>
    </div>
    <ul class="bx-pricing-features">
      ${features.map(f => `<li>✓ ${escapeHTML(f)}</li>`).join("\n      ")}
    </ul>
    <button class="bx-button bx-pricing-btn">Choose Plan</button>
  </div>`;
  },

  testimonial: (c) => {
    const quote = escapeHTML(c.properties?.quote || "This platform revolutionized how we build and launch web applications.");
    const author = escapeHTML(c.properties?.author || "Sarah Jenkins");
    const role = escapeHTML(c.properties?.role || "VP of Product, Apex Digital");
    return `
  <div class="bx-testimonial">
    <div class="bx-testimonial-quote">“${quote}”</div>
    <div class="bx-testimonial-author">
      <strong>${author}</strong>
      <span>${role}</span>
    </div>
  </div>`;
  },

  blogcard: (c) => {
    const title = escapeHTML(c.properties?.title || "Modern Web Architecture in 2026");
    const author = escapeHTML(c.properties?.author || "Alex Rivera");
    const category = escapeHTML(c.properties?.category || "Engineering");
    const readTime = escapeHTML(c.properties?.readTime || "5 min read");
    const href = safeUrl(c.properties?.href);
    const target = c.properties?.target || "_self";
    const relAttr = target === "_blank" ? ' rel="noopener noreferrer"' : '';
    const bcardEl = `
  <div class="bx-blog-card">
    <div class="bx-blog-meta">
      <span class="bx-blog-category">${category}</span>
      <span class="bx-blog-time">${readTime}</span>
    </div>
    <h3>${title}</h3>
    <div class="bx-blog-author">By ${author}</div>
  </div>`;
    return href ? `  <a href="${href}" target="${target}"${relAttr} style="text-decoration: none; color: inherit; display: block;">${bcardEl}</a>` : bcardEl;
  },

  statcard: (c) => {
    const value = escapeHTML(c.properties?.value || "99.9%");
    const label = escapeHTML(c.properties?.label || "Uptime Guaranteed");
    const trend = escapeHTML(c.properties?.trend || "+4.5%");
    return `
  <div class="bx-stat-card">
    <div class="bx-stat-value">${value}</div>
    <div class="bx-stat-label">${label}</div>
    ${trend ? `<div class="bx-stat-trend">${trend}</div>` : ""}
  </div>`;
  },

  section: (c) => {
    const bg = c.properties?.bg || "#f8fafc";
    return `  <section class="bx-section" style="background-color: ${bg};"></section>`;
  },

  container: (c) => {
    const bg = c.properties?.bg || "#ffffff";
    const text = escapeHTML(c.properties?.text || "");
    return `  <div class="bx-container" style="background-color: ${bg};">${text}</div>`;
  },

  columns: (c) => {
    const cols = c.properties?.cols || 2;
    return `
  <div class="bx-columns" style="grid-template-columns: repeat(${cols}, 1fr);">
    ${Array.from({ length: cols }).map((_, i) => `<div class="bx-column">Column ${i + 1}</div>`).join("\n    ")}
  </div>`;
  },

  footer: (c) => {
    const text = escapeHTML(c.properties?.text || `© ${new Date().getFullYear()} All rights reserved.`);
    const bg = c.properties?.bg || "#0f172a";
    const color = c.properties?.color || "#94a3b8";
    const href = safeUrl(c.properties?.href);
    const target = c.properties?.target || "_self";
    const relAttr = target === "_blank" ? ' rel="noopener noreferrer"' : '';
    const pos = c.properties?.position || (c.properties?.pinBottom ? "push-bottom" : "normal");
    let posStyles = "";
    if (pos === "push-bottom" || c.properties?.pinBottom) {
      posStyles = "margin-top: auto;";
    } else if (pos === "sticky-bottom") {
      posStyles = "position: sticky; bottom: 0; z-index: 40;";
    } else if (pos === "fixed-bottom") {
      posStyles = "position: fixed; bottom: 0; left: 0; width: 100%; z-index: 40;";
    }
    const content = href ? `<a href="${href}" target="${target}"${relAttr} style="color: inherit; text-decoration: none;">${text}</a>` : text;
    return `
  <footer class="bx-footer" style="background-color: ${bg}; color: ${color}; ${posStyles}">
    <p>${content}</p>
  </footer>`;
  },

  productgrid: (c) => {
    const grid = c.properties?.grid || { items: [] };
    const cards = (grid.items || []).map(item => `
    <div class="bx-product-card">
      <div class="bx-product-img">${item.src ? `<img src="${escapeHTML(safeUrl(item.src))}" alt="${escapeHTML(item.name || 'Product')}" />` : '<div class="bx-img-placeholder">🖼 Product Image</div>'}</div>
      <div class="bx-product-info">
        <h4>${escapeHTML(item.name || 'Product Name')}</h4>
        <div class="bx-product-price">${escapeHTML(item.price || '$0.00')}</div>
        <button class="bx-button bx-cart-btn">${escapeHTML(item.btn || 'Add to Cart')}</button>
      </div>
    </div>`).join("\n");
    return `  <section class="bx-product-grid-section">\n  <div class="bx-product-grid" style="grid-template-columns: repeat(auto-fit, minmax(${grid.imgW || 240}px, 1fr)); gap: ${grid.gap || 20}px;">\n${cards}\n  </div>\n  </section>`;
  }
};

// Aliases
COMP_MAP["productGrid"] = COMP_MAP.productgrid;
COMP_MAP["imageGrid"] = COMP_MAP.imagegrid;

function renderComponent(c, allComponents = []) {
  try {
    if (!c) return "";
    if ((!c.properties || Object.keys(c.properties).length === 0) && c.props && Object.keys(c.props).length > 0) {
      c.properties = c.props;
    }
    const children = Array.isArray(allComponents)
      ? allComponents.filter(child => child && child.parentId === c.id)
      : [];

    const typeKey = (c.type || "").toLowerCase().replace(/[-_\s]/g, "");
    const fn = COMP_MAP[typeKey] || COMP_MAP[c.type];
    if (fn) {
      const base = fn(c);
      if (children.length === 0) return base;
      if (c.type === "section" || c.type === "container") {
        const layout = c.properties?.layout || "stack";
        const gap = Number(c.properties?.gap ?? (c.type === "section" ? 16 : 12));
        const padding = Number(c.properties?.padding ?? (c.type === "section" ? 32 : 16));
        const cols = Math.max(1, Number(c.properties?.cols || 3));
        const maxWidth = c.type === "container" ? (c.properties?.maxWidth || "1200px") : "100%";
        const margin = c.type === "container" ? "0 auto" : "0";
        const bg = c.properties?.bg || (c.type === "section" ? "#f8fafc" : "#ffffff");
        const radius = c.properties?.radius ? `${c.properties.radius}px` : "0";
        const border = c.properties?.borderColor && c.properties.borderColor !== "transparent" ? `1px solid ${c.properties.borderColor}` : "none";

        const alignCSS = toCSSAlign(c.properties?.align);
        const justifyCSS = toCSSJustify(c.properties?.justify);
        let layoutCSS = `display: flex; flex-direction: column; gap: ${gap}px; align-items: ${alignCSS}; justify-content: ${justifyCSS};`;
        if (layout === "row") {
          layoutCSS = `display: flex; flex-direction: row; flex-wrap: wrap; gap: ${gap}px; align-items: ${alignCSS}; justify-content: ${justifyCSS};`;
        } else if (layout === "grid") {
          layoutCSS = `display: grid; grid-template-columns: repeat(${cols}, minmax(0, 1fr)); gap: ${gap}px; align-items: ${alignCSS};`;
        }

        const sortedChildren = children.sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
        const childMarkup = sortedChildren.map(child => `  <div class="bx-nested-child">${renderComponent(child, allComponents)}</div>`).join("\n");
        const sectionIdAttr = c.properties?.sectionId || c.properties?.id ? `id="${escapeHTML(c.properties.sectionId || c.properties.id)}" ` : "";
        return `
  <div ${sectionIdAttr}class="bx-${c.type}-wrapper" style="background-color: ${bg}; padding: ${padding}px; border-radius: ${radius}; border: ${border}; max-width: ${maxWidth}; margin: ${margin}; width: 100%; box-sizing: border-box; ${layoutCSS}">
    ${childMarkup}
  </div>`;
      }
      if (c.type === "columns") {
        const cols = Math.max(1, Number(c.properties?.cols || children.length || 2));
        const gap = Number(c.properties?.gap ?? 12);
        const padding = Number(c.properties?.padding ?? 8);
        const sortedChildren = children.sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
        const columnMarkup = sortedChildren.map(child => `  <div class="bx-column-child" style="min-width: 0;">${renderComponent(child, allComponents)}</div>`).join("\n");
        return `
  <div class="bx-columns-wrapper" style="display: grid; grid-template-columns: repeat(${cols}, minmax(0, 1fr)); gap: ${gap}px; padding: ${padding}px; width: 100%; box-sizing: border-box;">
    ${columnMarkup}
  </div>`;
      }
      return base;
    }
    const content = escapeHTML(c.properties?.text || c.properties?.title || c.properties?.content || c.type || "");
    return `  <div class="bx-custom">${content}</div>`;
  } catch (err) {
    console.error("Error rendering component:", c.type, err);
    return `  <div class="bx-custom">${escapeHTML(c.type || "Component")}</div>`;
  }
}

/**
 * Compiles a project into standalone HTML.
 */
export function generateHTML(project) {
  const pageEntries = Array.isArray(project.settings?.pages) && project.settings.pages.length
    ? project.settings.pages
    : [{ id: "page-1", name: "Home", components: Array.isArray(project.components) ? project.components : [] }];

  const renderPageBlock = (page, pageIndex) => {
    let components = Array.isArray(page.components) && page.components.length > 0
      ? page.components
      : (Array.isArray(project.components) ? project.components : []);

    if (pageIndex === 0 && Array.isArray(project.components) && project.components.length > 0) {
      const pageHasProps = components.some(c => (c.properties && Object.keys(c.properties).length > 0) || (c.props && Object.keys(c.props).length > 0));
      if (!pageHasProps) {
        components = project.components;
      }
    }

    const rootComponents = components.filter(c => !c.parentId);
    const hasAbsolutePositions = components.some(c => c.position && (c.position.x > 0 || c.position.y > 0));

    let inner = "";

    if (hasAbsolutePositions) {
      const sorted = [...rootComponents].sort((a, b) => ((a.position?.y || 0) - (b.position?.y || 0)) || ((a.position?.x || 0) - (b.position?.x || 0)));
      inner = `
    <main class="bx-canvas-wrapper">
      <div class="bx-canvas-layout">
        ${sorted.map(c => {
          const x = c.position?.x ?? 0;
          const y = c.position?.y ?? 0;
          const w = c.styles?.width ? `${c.styles.width}px` : "auto";
          const h = c.styles?.height ? `${c.styles.height}px` : "auto";
          return `
        <div class="bx-positioned-node" style="position: absolute; left: ${x}px; top: ${y}px; width: ${w}; min-height: ${h};">
          ${renderComponent(c, components)}
        </div>`;
        }).join("\n")}
      </div>
    </main>`;
    } else {
      inner = `
    <main class="bx-flow-wrapper">
      ${rootComponents.map(c => renderComponent(c, components)).join("\n\n")}
    </main>`;
    }

    return `
  <section class="bx-page-section${pageIndex === 0 ? " active" : ""}" data-page="${escapeHTML(page.id || page.name || `page-${pageIndex + 1}`)}">
    ${inner}
  </section>`;
  };

  const pageNav = pageEntries.map((page, idx) => `
    <button type="button" class="bx-page-tab${idx === 0 ? " active" : ""}" data-target="${escapeHTML(page.id || page.name || `page-${idx + 1}`)}">${escapeHTML(page.name || `Page ${idx + 1}`)}</button>
  `).join("\n");

  const siteTitle   = escapeHTML(project.settings?.siteTitle || project.name || "Published Website");
  const metaDesc    = escapeHTML(project.settings?.metaDesc  || project.description || "Created with BuildX");
  const lang        = escapeHTML(project.settings?.language  || "en");
  const favicon     = safeUrl(project.settings?.favicon || "");
  const ogImage     = safeUrl(project.settings?.ogImage  || "");
  const clientUrl   = process.env.CLIENT_URL || "http://localhost:5173";

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${siteTitle}</title>
  <meta name="description" content="${metaDesc}" />
  <meta property="og:title" content="${siteTitle}" />
  <meta property="og:description" content="${metaDesc}" />
  <meta property="og:type" content="website" />
  ${ogImage ? `<meta property="og:image" content="${escapeHTML(ogImage)}" />` : ""}
  ${favicon ? `<link rel="icon" href="${escapeHTML(favicon)}" />` : ""}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  ${pageEntries.length > 1 ? `<nav class="bx-page-nav">${pageNav}</nav>` : ""}
  ${pageEntries.map(renderPageBlock).join("\n")}

  <!-- Floating "Built with BuildX" Badge -->
  <aside class="bx-watermark">
    <a href="${escapeHTML(process.env.CLIENT_URL || 'http://localhost:5173')}" target="_blank" rel="noopener noreferrer">
      <span class="bx-watermark-icon">B</span>
      <span>Built with BuildX</span>
    </a>
  </aside>

  <script>
    // BuildX analytics — no personal data collected
    (function(){
      try {
        fetch('/api/v1/analytics/${escapeHTML(project.slug || '')}' + '/hit', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ path: location.pathname, referrer: document.referrer })
        });
      } catch(e){}
    })();

    window.handleFormSubmit = async function(event, form) {
      event.preventDefault();
      const msgEl = form.querySelector('.bx-form-msg');
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      if (msgEl) {
        msgEl.style.display = 'block';
        msgEl.style.color = '#3b82f6';
        msgEl.style.background = '#eff6ff';
        msgEl.innerText = 'Submitting message...';
      }
      try {
        const name = form.querySelector('input[name="name"]')?.value || '';
        const email = form.querySelector('input[name="email"]')?.value || '';
        const message = form.querySelector('textarea[name="message"]')?.value || '';
        const projectId = '${escapeHTML(project._id || project.id || '')}';
        const res = await fetch('/api/v1/forms/' + projectId + '/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message })
        });
        const result = await res.json();
        if (res.ok && result.success !== false) {
          if (msgEl) {
            msgEl.style.color = '#15803d';
            msgEl.style.background = '#dcfce7';
            msgEl.innerText = 'Thank you! Your enquiry has been received.';
          }
          form.reset();
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        if (msgEl) {
          msgEl.style.color = '#b91c1c';
          msgEl.style.background = '#fee2e2';
          msgEl.innerText = err.message || 'Error sending message. Please try again.';
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    };

    function switchTab(btn, containerId, targetIndex) {
      const container = document.getElementById(containerId);
      if (!container) return;
      const btns = container.querySelectorAll('.bx-tab-btn');
      const panes = container.querySelectorAll('.bx-tab-pane');
      btns.forEach((b, i) => b.classList.toggle('active', i === targetIndex));
      panes.forEach((p, i) => p.classList.toggle('active', i === targetIndex));
    }

    document.querySelectorAll('.bx-page-tab').forEach((button) => {
      button.addEventListener('click', () => {
        const target = button.dataset.target;
        document.querySelectorAll('.bx-page-section').forEach((section) => {
          section.classList.toggle('active', section.dataset.page === target);
        });
        document.querySelectorAll('.bx-page-tab').forEach((tab) => {
          tab.classList.toggle('active', tab === button);
        });
      });
    });
  </script>
</body>
</html>
`;
}

/**
 * Compiles CSS rules for the project.
 */
export function generateCSS(project) {
  return `/* Generated by BuildX for "${escapeHTML(project.name)}" */

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #ffffff;
  color: #1a1a1a;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
  position: relative;
}

/* Page navigation */
.bx-page-nav {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px 24px 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #e2e8f0;
}

.bx-page-tab {
  appearance: none;
  border: 1px solid #dbe2ea;
  background: #f8fafc;
  color: #334155;
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.bx-page-tab.active {
  background: #4f46e5;
  border-color: #4f46e5;
  color: #fff;
}

.bx-page-section {
  display: none;
}

.bx-page-section.active {
  display: block;
}

/* Canvas Absolute Layout Mode */
.bx-canvas-wrapper {
  width: 100%;
  min-height: 100vh;
  overflow-x: auto;
  position: relative;
  background: #ffffff;
}

.bx-canvas-layout {
  position: relative;
  min-width: 1200px;
  min-height: 900px;
  width: 100%;
}

.bx-positioned-node {
  box-sizing: border-box;
}

/* Flow Mode */
.bx-flow-wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  gap: 24px;
}

/* Navbar */
.bx-navbar {
  width: 100%;
  padding: 16px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.bx-nav-brand {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.bx-nav-links {
  display: flex;
  gap: 20px;
}

.bx-nav-link {
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  opacity: 0.85;
  transition: opacity 0.2s;
}

.bx-nav-link:hover {
  opacity: 1;
}

/* Hero Section */
.bx-hero {
  width: 100%;
  padding: 60px 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bx-hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.bx-hero h1 {
  font-size: 42px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -1px;
  margin-bottom: 16px;
}

.bx-hero p {
  font-size: 18px;
  opacity: 0.85;
  line-height: 1.6;
  margin-bottom: 24px;
}

.bx-hero-btn {
  font-size: 16px;
  padding: 12px 32px;
}

/* Header */
.bx-header {
  padding: 24px 32px;
  text-align: center;
}

.bx-header h2 {
  font-size: 28px;
  font-weight: 700;
}

/* Heading & Text */
.bx-heading {
  margin-bottom: 8px;
  line-height: 1.2;
}

.bx-text {
  line-height: 1.6;
  margin-bottom: 8px;
}

/* Buttons */
.bx-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.bx-button:hover {
  opacity: 0.9;
}

.bx-button:active {
  transform: scale(0.98);
}

/* Image & Video */
.bx-image-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.bx-image {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 8px;
}

.bx-imagegrid {
  display: grid;
  width: 100%;
}

.bx-imagegrid-item {
  overflow: hidden;
  aspect-ratio: 1/1;
}

.bx-imagegrid-item img {
  width: 100%;
  height: 100%;
  display: block;
  transition: transform 0.3s ease;
}

.bx-imagegrid-item:hover img {
  transform: scale(1.05);
}

.bx-video-wrapper {
  width: 100%;
  height: 100%;
}

.bx-video {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: block;
}

.bx-video-placeholder {
  width: 100%;
  height: 100%;
  min-height: 180px;
  background: #0f172a;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  gap: 8px;
}

.bx-video-icon {
  font-size: 28px;
}

/* Divider & Spacer */
.bx-divider {
  border: 0;
  border-top: 1px solid #e2e8f0;
  margin: 12px 0;
}

.bx-spacer {
  width: 100%;
}

/* Cards & UI */
.bx-card {
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.bx-card h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #0f172a;
}

.bx-card p {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
}

.bx-badge {
  display: inline-block;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
}

.bx-alert {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
}

.bx-alert-info { background: #e0f2fe; color: #0369a1; }
.bx-alert-success { background: #dcfce7; color: #15803d; }
.bx-alert-error { background: #fee2e2; color: #b91c1c; }
.bx-alert-warning { background: #fef3c7; color: #b45309; }

/* Tabs */
.bx-tabs {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.bx-tab-headers {
  display: flex;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.bx-tab-btn {
  padding: 10px 20px;
  background: transparent;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.bx-tab-btn.active {
  color: #6366f1;
  border-bottom-color: #6366f1;
  background: #ffffff;
}

.bx-tab-pane {
  padding: 20px;
  display: none;
}

.bx-tab-pane.active {
  display: block;
}

/* Forms */
.bx-form-group {
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bx-label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.bx-input, .bx-textarea, .bx-select {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

.bx-input:focus, .bx-textarea:focus, .bx-select:focus {
  border-color: #6366f1;
}

.bx-checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
}

.bx-formblock {
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

.bx-formblock h3 {
  margin-bottom: 16px;
  font-size: 20px;
}

.bx-form-submit {
  width: 100%;
  margin-top: 8px;
  background: #6366f1;
  color: #ffffff;
  border-radius: 6px;
}

/* Product & Pricing */
.bx-product-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
}

.bx-product-img {
  width: 100%;
  height: 200px;
  background: #f1f5f9;
  overflow: hidden;
}

.bx-product-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bx-product-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.bx-product-brand {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
  font-weight: 600;
}

.bx-product-rating {
  font-size: 13px;
  color: #f59e0b;
  font-weight: 600;
}

.bx-product-price {
  font-size: 18px;
  font-weight: 800;
  color: #059669;
}

.bx-cart-btn {
  margin-top: 8px;
  width: 100%;
  background: #0f172a;
  color: #ffffff;
  border-radius: 6px;
}

.bx-pricing-card {
  padding: 32px 24px;
  background: #ffffff;
  border: 2px solid #6366f1;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.08);
  text-align: center;
}

.bx-pricing-header h3 {
  font-size: 20px;
  color: #0f172a;
}

.bx-pricing-price {
  font-size: 36px;
  font-weight: 800;
  color: #6366f1;
  margin: 12px 0 20px;
}

.bx-pricing-features {
  list-style: none;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
  font-size: 14px;
  color: #475569;
}

.bx-pricing-btn {
  width: 100%;
  background: #6366f1;
  color: #ffffff;
  border-radius: 8px;
}

/* Testimonial, Blog & Stat Cards */
.bx-testimonial {
  padding: 24px;
  background: #f8fafc;
  border-left: 4px solid #6366f1;
  border-radius: 8px;
}

.bx-testimonial-quote {
  font-size: 16px;
  font-style: italic;
  color: #334155;
  margin-bottom: 12px;
}

.bx-testimonial-author {
  display: flex;
  flex-direction: column;
  font-size: 13px;
}

.bx-blog-card {
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
}

.bx-blog-meta {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
}

.bx-blog-category {
  color: #6366f1;
  font-weight: 600;
}

.bx-stat-card {
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  text-align: center;
}

.bx-stat-value {
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
}

.bx-stat-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.bx-stat-trend {
  margin-top: 4px;
  font-size: 12px;
  font-weight: 700;
  color: #16a34a;
}

/* Sections & Containers */
.bx-section {
  width: 100%;
  padding: 40px 32px;
}

.bx-container {
  padding: 24px;
  border-radius: 8px;
}

.bx-columns {
  display: grid;
  gap: 20px;
  width: 100%;
}

.bx-column {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

/* Footer */
.bx-footer {
  width: 100%;
  padding: 24px 32px;
  text-align: center;
  font-size: 14px;
}

/* Watermark Badge */
.bx-watermark {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 99999;
}

.bx-watermark a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border: 1px solid rgba(255,255,255,0.1);
  transition: transform 0.2s, background 0.2s;
}

.bx-watermark a:hover {
  transform: translateY(-2px);
  background: rgba(15, 23, 42, 0.95);
}

.bx-watermark-icon {
  width: 18px;
  height: 18px;
  background: #6366f1;
  color: #ffffff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
}
`;
}
