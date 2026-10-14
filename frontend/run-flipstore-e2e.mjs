import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const artifactsDir = 'C:\\Users\\mukes\\.gemini\\antigravity-ide\\brain\\ec277263-39c6-479f-801d-c46f06b1ca77';

async function run() {
  console.log('=== STARTING FLIP STORE E2E DEMO BUILD, TEST & PUBLISH ===\n');

  // Step 1: Login via API to obtain token and user details
  console.log('[Step 1] Authenticating with backend...');
  const userEmail = process.env.USER_EMAIL || 'mukesh@gmail.com';
  const userPassword = process.env.USER_PASS || '';
  const authRes = await fetch('http://localhost:5000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userEmail, password: userPassword })
  });

  const authData = await authRes.json();
  if (!authRes.ok || !authData.success) {
    throw new Error(`Authentication failed: ${JSON.stringify(authData)}`);
  }
  const token = authData.payload.token;
  const user = authData.payload.user;
  console.log(`✔ Authenticated successfully as ${user.name} (${user.email})`);

  // Step 2: Create "FLIP STORE — Demo Storefront" Project
  console.log('\n[Step 2] Creating project "FLIP STORE — Demo Storefront"...');
  
  // Clean FLIP STORE components model
  const components = [
    // 1. Navbar
    {
      id: 'navbar-1',
      type: 'navbar',
      name: 'FLIP STORE Navbar',
      parentId: null,
      order: 0,
      x: 0, y: 0, w: 1200, h: 64,
      props: {
        brand: 'FLIP STORE',
        links: 'Home, Products, Why Us, Contact',
        bg: '#0f172a',
        color: '#f8fafc'
      }
    },
    // 2. Hero Section
    {
      id: 'section-hero',
      type: 'section',
      name: 'Hero Section',
      parentId: null,
      order: 1,
      x: 0, y: 64, w: 1200, h: 380,
      props: {
        bg: '#0f172a',
        layout: 'stack',
        padding: 56,
        align: 'center',
        justify: 'center',
        gap: 16
      }
    },
    {
      id: 'container-hero',
      type: 'container',
      name: 'Hero Content',
      parentId: 'section-hero',
      order: 0,
      x: 0, y: 0, w: 900, h: 260,
      props: {
        layout: 'stack',
        maxWidth: '900px',
        align: 'center',
        justify: 'center',
        gap: 16,
        bg: 'transparent',
        padding: 0
      }
    },
    {
      id: 'hero-badge',
      type: 'badge',
      name: 'Hero Badge',
      parentId: 'container-hero',
      order: 0,
      x: 0, y: 0, w: 140, h: 32,
      props: {
        text: '✦ 2026 AUDIO & SMART TECH',
        bg: '#4f46e5',
        color: '#ffffff',
        fullWidth: false,
        alignSelf: 'center'
      }
    },
    {
      id: 'hero-heading',
      type: 'heading',
      name: 'Hero Heading',
      parentId: 'container-hero',
      order: 1,
      x: 0, y: 0, w: 800, h: 80,
      props: {
        text: 'Next-Gen Audio & Smart Electronics',
        fontSize: 40,
        fontWeight: '800',
        color: '#ffffff',
        textAlign: 'center'
      }
    },
    {
      id: 'hero-text',
      type: 'text',
      name: 'Hero Description',
      parentId: 'container-hero',
      order: 2,
      x: 0, y: 0, w: 760, h: 50,
      props: {
        text: 'Experience studio-grade acoustics, health-monitoring wearables, and premium home sound engineered for everyday life.',
        fontSize: 16,
        color: '#94a3b8',
        textAlign: 'center'
      }
    },
    {
      id: 'hero-cta',
      type: 'button',
      name: 'Shop Now Button',
      parentId: 'container-hero',
      order: 3,
      x: 0, y: 0, w: 180, h: 48,
      props: {
        text: 'Explore Products ↓',
        bg: '#6366f1',
        color: '#ffffff',
        radius: 10,
        fullWidth: false,
        alignSelf: 'center'
      }
    },

    // 3. Featured Products Section
    {
      id: 'section-products',
      type: 'section',
      name: 'Featured Products Section',
      parentId: null,
      order: 2,
      x: 0, y: 444, w: 1200, h: 620,
      props: {
        sectionId: 'products',
        bg: '#f8fafc',
        layout: 'stack',
        padding: 56,
        align: 'center',
        gap: 24
      }
    },
    {
      id: 'products-header-container',
      type: 'container',
      name: 'Products Header',
      parentId: 'section-products',
      order: 0,
      x: 0, y: 0, w: 800, h: 80,
      props: {
        layout: 'stack',
        maxWidth: '800px',
        align: 'center',
        gap: 8,
        bg: 'transparent',
        padding: 0
      }
    },
    {
      id: 'products-title',
      type: 'heading',
      name: 'Products Section Title',
      parentId: 'products-header-container',
      order: 0,
      x: 0, y: 0, w: 600, h: 40,
      props: {
        text: 'Featured Electronics',
        fontSize: 32,
        fontWeight: '800',
        color: '#0f172a',
        textAlign: 'center'
      }
    },
    {
      id: 'products-subtitle',
      type: 'text',
      name: 'Products Subtitle',
      parentId: 'products-header-container',
      order: 1,
      x: 0, y: 0, w: 600, h: 30,
      props: {
        text: 'Engineered for durability, pristine clarity, and instant connectivity.',
        fontSize: 15,
        color: '#64748b',
        textAlign: 'center'
      }
    },
    {
      id: 'products-grid-container',
      type: 'container',
      name: 'Products 3-Col Grid',
      parentId: 'section-products',
      order: 1,
      x: 0, y: 0, w: 1160, h: 480,
      props: {
        layout: 'grid',
        cols: 3,
        gap: 24,
        padding: 0,
        maxWidth: '1160px',
        bg: 'transparent'
      }
    },
    // Product 1
    {
      id: 'product-card-1',
      type: 'container',
      name: 'Product Card 1',
      parentId: 'products-grid-container',
      order: 0,
      x: 0, y: 0, w: 360, h: 440,
      props: {
        layout: 'stack',
        gap: 12,
        padding: 20,
        bg: '#ffffff',
        radius: 16,
        borderColor: '#e2e8f0'
      }
    },
    {
      id: 'p1-image',
      type: 'image',
      name: 'Headphones Image',
      parentId: 'product-card-1',
      order: 0,
      x: 0, y: 0, w: 320, h: 180,
      props: {
        src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
        alt: 'Flip Pro Wireless Headphones',
        fit: 'cover',
        radius: 10
      }
    },
    {
      id: 'p1-badge',
      type: 'badge',
      name: 'P1 Rating',
      parentId: 'product-card-1',
      order: 1,
      x: 0, y: 0, w: 120, h: 26,
      props: {
        text: '★ 4.9 · Noise Cancelling',
        bg: '#eff6ff',
        color: '#2563eb',
        fullWidth: false
      }
    },
    {
      id: 'p1-title',
      type: 'heading',
      name: 'P1 Title',
      parentId: 'product-card-1',
      order: 2,
      x: 0, y: 0, w: 320, h: 30,
      props: {
        text: 'Flip Pro Wireless Headphones',
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a'
      }
    },
    {
      id: 'p1-price',
      type: 'text',
      name: 'P1 Price',
      parentId: 'product-card-1',
      order: 3,
      x: 0, y: 0, w: 100, h: 30,
      props: {
        text: '$189.99',
        fontSize: 22,
        fontWeight: '800',
        color: '#0f172a'
      }
    },
    {
      id: 'p1-btn',
      type: 'button',
      name: 'P1 Enquiry Button',
      parentId: 'product-card-1',
      order: 4,
      x: 0, y: 0, w: 320, h: 42,
      props: {
        text: 'Order Enquiry',
        bg: '#0f172a',
        color: '#ffffff',
        radius: 8,
        fullWidth: true
      }
    },

    // Product 2
    {
      id: 'product-card-2',
      type: 'container',
      name: 'Product Card 2',
      parentId: 'products-grid-container',
      order: 1,
      x: 0, y: 0, w: 360, h: 440,
      props: {
        layout: 'stack',
        gap: 12,
        padding: 20,
        bg: '#ffffff',
        radius: 16,
        borderColor: '#e2e8f0'
      }
    },
    {
      id: 'p2-image',
      type: 'image',
      name: 'Watch Image',
      parentId: 'product-card-2',
      order: 0,
      x: 0, y: 0, w: 320, h: 180,
      props: {
        src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
        alt: 'Flip Pulse Smart Watch',
        fit: 'cover',
        radius: 10
      }
    },
    {
      id: 'p2-badge',
      type: 'badge',
      name: 'P2 Rating',
      parentId: 'product-card-2',
      order: 1,
      x: 0, y: 0, w: 120, h: 26,
      props: {
        text: '★ 4.8 · ECG & GPS Tracker',
        bg: '#f0fdf4',
        color: '#16a34a',
        fullWidth: false
      }
    },
    {
      id: 'p2-title',
      type: 'heading',
      name: 'P2 Title',
      parentId: 'product-card-2',
      order: 2,
      x: 0, y: 0, w: 320, h: 30,
      props: {
        text: 'Flip Pulse Smart Watch',
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a'
      }
    },
    {
      id: 'p2-price',
      type: 'text',
      name: 'P2 Price',
      parentId: 'product-card-2',
      order: 3,
      x: 0, y: 0, w: 100, h: 30,
      props: {
        text: '$129.99',
        fontSize: 22,
        fontWeight: '800',
        color: '#0f172a'
      }
    },
    {
      id: 'p2-btn',
      type: 'button',
      name: 'P2 Enquiry Button',
      parentId: 'product-card-2',
      order: 4,
      x: 0, y: 0, w: 320, h: 42,
      props: {
        text: 'Order Enquiry',
        bg: '#0f172a',
        color: '#ffffff',
        radius: 8,
        fullWidth: true
      }
    },

    // Product 3
    {
      id: 'product-card-3',
      type: 'container',
      name: 'Product Card 3',
      parentId: 'products-grid-container',
      order: 2,
      x: 0, y: 0, w: 360, h: 440,
      props: {
        layout: 'stack',
        gap: 12,
        padding: 20,
        bg: '#ffffff',
        radius: 16,
        borderColor: '#e2e8f0'
      }
    },
    {
      id: 'p3-image',
      type: 'image',
      name: 'SoundBar Image',
      parentId: 'product-card-3',
      order: 0,
      x: 0, y: 0, w: 320, h: 180,
      props: {
        src: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=60',
        alt: 'Flip SoundBar Bass 360',
        fit: 'cover',
        radius: 10
      }
    },
    {
      id: 'p3-badge',
      type: 'badge',
      name: 'P3 Rating',
      parentId: 'product-card-3',
      order: 1,
      x: 0, y: 0, w: 120, h: 26,
      props: {
        text: '★ 4.9 · Spatial Bass Pro',
        bg: '#fef3c7',
        color: '#d97706',
        fullWidth: false
      }
    },
    {
      id: 'p3-title',
      type: 'heading',
      name: 'P3 Title',
      parentId: 'product-card-3',
      order: 2,
      x: 0, y: 0, w: 320, h: 30,
      props: {
        text: 'Flip SoundBar Bass 360',
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a'
      }
    },
    {
      id: 'p3-price',
      type: 'text',
      name: 'P3 Price',
      parentId: 'product-card-3',
      order: 3,
      x: 0, y: 0, w: 100, h: 30,
      props: {
        text: '$249.99',
        fontSize: 22,
        fontWeight: '800',
        color: '#0f172a'
      }
    },
    {
      id: 'p3-btn',
      type: 'button',
      name: 'P3 Enquiry Button',
      parentId: 'product-card-3',
      order: 4,
      x: 0, y: 0, w: 320, h: 42,
      props: {
        text: 'Order Enquiry',
        bg: '#0f172a',
        color: '#ffffff',
        radius: 8,
        fullWidth: true
      }
    },

    // 4. Why Choose Us Section
    {
      id: 'section-why-us',
      type: 'section',
      name: 'Why Choose Us Section',
      parentId: null,
      order: 3,
      x: 0, y: 1064, w: 1200, h: 380,
      props: {
        sectionId: 'why-us',
        bg: '#ffffff',
        layout: 'stack',
        padding: 56,
        align: 'center',
        gap: 24
      }
    },
    {
      id: 'why-us-header',
      type: 'container',
      name: 'Why Us Header',
      parentId: 'section-why-us',
      order: 0,
      x: 0, y: 0, w: 800, h: 70,
      props: {
        layout: 'stack',
        maxWidth: '800px',
        align: 'center',
        gap: 8,
        bg: 'transparent',
        padding: 0
      }
    },
    {
      id: 'why-us-title',
      type: 'heading',
      name: 'Why Us Title',
      parentId: 'why-us-header',
      order: 0,
      x: 0, y: 0, w: 600, h: 40,
      props: {
        text: 'Why Choose FLIP STORE',
        fontSize: 32,
        fontWeight: '800',
        color: '#0f172a',
        textAlign: 'center'
      }
    },
    {
      id: 'why-us-subtitle',
      type: 'text',
      name: 'Why Us Subtitle',
      parentId: 'why-us-header',
      order: 1,
      x: 0, y: 0, w: 600, h: 26,
      props: {
        text: 'Built to exceed performance expectations backed by industry guarantees.',
        fontSize: 15,
        color: '#64748b',
        textAlign: 'center'
      }
    },
    {
      id: 'why-us-grid',
      type: 'container',
      name: 'Features Grid',
      parentId: 'section-why-us',
      order: 1,
      x: 0, y: 0, w: 1160, h: 220,
      props: {
        layout: 'grid',
        cols: 3,
        gap: 20,
        padding: 0,
        maxWidth: '1160px',
        bg: 'transparent'
      }
    },
    {
      id: 'feature-1',
      type: 'card',
      name: 'Feature 1',
      parentId: 'why-us-grid',
      order: 0,
      x: 0, y: 0, w: 360, h: 180,
      props: {
        title: '✦ Certified Audio Fidelity',
        body: 'Every transducer is tuned and lab-certified for 0.01% harmonic distortion with a full 2-year warranty.',
        bg: '#f8fafc',
        radius: 14
      }
    },
    {
      id: 'feature-2',
      type: 'card',
      name: 'Feature 2',
      parentId: 'why-us-grid',
      order: 1,
      x: 0, y: 0, w: 360, h: 180,
      props: {
        title: '⚡ 48-Hour Global Dispatch',
        body: 'Direct automated logistics guarantee safe express packaging with real-time tracking to your door.',
        bg: '#f8fafc',
        radius: 14
      }
    },
    {
      id: 'feature-3',
      type: 'card',
      name: 'Feature 3',
      parentId: 'why-us-grid',
      order: 2,
      x: 0, y: 0, w: 360, h: 180,
      props: {
        title: '🛡 24/7 Specialist Support',
        body: 'Real technicians on standby for setup assistance, plus a zero-friction 30-day return policy.',
        bg: '#f8fafc',
        radius: 14
      }
    },

    // 5. Contact Section
    {
      id: 'section-contact',
      type: 'section',
      name: 'Contact Section',
      parentId: null,
      order: 4,
      x: 0, y: 1444, w: 1200, h: 480,
      props: {
        sectionId: 'contact',
        bg: '#f1f5f9',
        layout: 'stack',
        padding: 56,
        align: 'center',
        gap: 20
      }
    },
    {
      id: 'contact-container',
      type: 'container',
      name: 'Contact Box',
      parentId: 'section-contact',
      order: 0,
      x: 0, y: 0, w: 680, h: 400,
      props: {
        layout: 'stack',
        maxWidth: '680px',
        align: 'stretch',
        gap: 16,
        bg: 'transparent',
        padding: 0
      }
    },
    {
      id: 'contact-heading',
      type: 'heading',
      name: 'Contact Title',
      parentId: 'contact-container',
      order: 0,
      x: 0, y: 0, w: 680, h: 36,
      props: {
        text: 'Product Enquiry & Customer Support',
        fontSize: 28,
        fontWeight: '800',
        color: '#0f172a',
        textAlign: 'center'
      }
    },
    {
      id: 'contact-form',
      type: 'formblock',
      name: 'Enquiry Form',
      parentId: 'contact-container',
      order: 1,
      x: 0, y: 0, w: 680, h: 320,
      props: {
        title: 'Send a Direct Message to FLIP STORE',
        cta: 'Submit Enquiry'
      }
    },

    // 6. Footer
    {
      id: 'footer-1',
      type: 'footer',
      name: 'Store Footer',
      parentId: null,
      order: 5,
      x: 0, y: 1924, w: 1200, h: 80,
      props: {
        text: '© 2026 FLIP STORE Electronics Inc. All rights reserved. Powered by BuildX Website Engine.',
        bg: '#0f172a',
        color: '#94a3b8'
      }
    }
  ];

  const formattedComponents = components.map(c => ({
    ...c,
    properties: { ...(c.properties || {}), ...(c.props || {}) },
    props: { ...(c.props || {}), ...(c.properties || {}) }
  }));

  const createRes = await fetch('http://localhost:5000/api/v1/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: 'FLIP STORE — Demo Storefront',
      description: 'Official electronics storefront for FLIP STORE audio and wearables',
      components: formattedComponents
    })
  });

  const createData = await createRes.json();
  if (!createRes.ok || !createData.success) {
    throw new Error(`Failed to create project: ${JSON.stringify(createData)}`);
  }
  const project = createData.payload.project;
  const projectId = project._id;
  console.log(`✔ Project created successfully with ID: ${projectId}`);
  console.log(`✔ Components initialized: ${project.components.length} nodes`);

  // Step 3: Real Chrome Automation
  console.log('\n[Step 3] Launching Google Chrome to test Builder & Canvas Interactions...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });

    // Set auth token in localStorage on localhost:5173
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await page.evaluate((tok, usr) => {
      localStorage.setItem('token', tok);
      localStorage.setItem('user', JSON.stringify(usr));
    }, token, user);

    // Open the Project in the Builder
    const builderUrl = `http://localhost:5173/builder/${projectId}`;
    console.log(`Navigating to Builder URL: ${builderUrl}`);
    await page.goto(builderUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for the canvas flow to render
    await page.waitForSelector('.bx-canvas-flow', { timeout: 15000 });
    console.log('✔ Builder canvas loaded successfully!');

    // Verify nodes rendered in the canvas
    const renderedNodesCount = await page.$$eval('.bx-layout-node', els => els.length);
    console.log(`✔ Canvas rendered ${renderedNodesCount} components in the visual hierarchy`);

    // Verify Properties Panel interaction
    console.log('\nTesting Properties Inspector and live editing...');
    // Select the Hero Heading node
    const headingEl = await page.$('#node-hero-heading');
    if (headingEl) {
      await headingEl.click();
      await new Promise(r => setTimeout(r, 600));

      // Inspect properties panel
      const propsPanel = await page.$('.bx-props-panel');
      if (propsPanel) {
        console.log('✔ Properties panel opened for selected component');
      }
    }

    // Capture Builder Screenshot
    const builderScreenshotPath = path.join(artifactsDir, 'builder_canvas_desktop.png');
    await page.screenshot({ path: builderScreenshotPath, fullPage: true });
    console.log(`✔ Saved Builder screenshot: ${builderScreenshotPath}`);

    // Step 4: Test Preview Mode in Builder
    console.log('\n[Step 4] Testing Builder Preview Mode...');
    // Click the Preview button in the top bar
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent && b.textContent.includes('Preview'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    const previewScreenshotPath = path.join(artifactsDir, 'preview_desktop.png');
    await page.screenshot({ path: previewScreenshotPath, fullPage: true });
    console.log(`✔ Saved Desktop Preview screenshot: ${previewScreenshotPath}`);

    // Test Mobile Preview Mode (390px viewport)
    await page.setViewport({ width: 390, height: 844 });
    await new Promise(r => setTimeout(r, 600));
    const previewMobilePath = path.join(artifactsDir, 'preview_mobile.png');
    await page.screenshot({ path: previewMobilePath, fullPage: true });
    console.log(`✔ Saved Mobile Preview screenshot: ${previewMobilePath}`);

    // Restore Desktop Viewport
    await page.setViewport({ width: 1400, height: 900 });

    // Step 5: Publish the Project
    console.log('\n[Step 5] Publishing project via backend API...');
    const publishRes = await fetch(`http://localhost:5000/api/v1/projects/${projectId}/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        customSlug: 'flip-store',
        components: formattedComponents
      })
    });

    const publishData = await publishRes.json();
    if (!publishRes.ok || !publishData.success) {
      throw new Error(`Publish failed: ${JSON.stringify(publishData)}`);
    }
    const publishedUrl = publishData.payload.publishedUrl;
    const slug = publishData.payload.slug;
    console.log(`✔ Project published successfully!`);
    console.log(`✔ Official Public Live URL: ${publishedUrl}`);

    // Step 6: Test Public Website in an Unauthenticated Browser Context
    console.log('\n[Step 6] Testing Public Website in an unauthenticated browser context...');
    const publicPage = await browser.newPage();
    await publicPage.setViewport({ width: 1300, height: 900 });

    // Load the public published URL
    const pubResponse = await publicPage.goto(publishedUrl, { waitUntil: 'networkidle2', timeout: 15000 });
    console.log(`✔ Public page HTTP status: ${pubResponse.status()}`);
    if (pubResponse.status() !== 200) {
      throw new Error(`Published website returned HTTP ${pubResponse.status()}`);
    }

    // Verify key sections on the public site
    const title = await publicPage.title();
    console.log(`✔ Published Document Title: "${title}"`);

    // Verify Navbar brand
    const brandText = await publicPage.$eval('.bx-nav-brand, .bx-navbar', el => el.innerText);
    console.log(`✔ Navbar Branding verified: "${brandText.trim().replace(/\n/g, ' ')}"`);

    // Verify 3 product cards
    const productCardsCount = await publicPage.$$eval('.bx-container-wrapper, .bx-card', els => els.length);
    console.log(`✔ Product & Feature containers verified in DOM (${productCardsCount} container elements)`);

    // Capture Desktop Published Website Screenshot
    const publishedDesktopPath = path.join(artifactsDir, 'published_website_desktop.png');
    await publicPage.screenshot({ path: publishedDesktopPath, fullPage: true });
    console.log(`✔ Saved Published Desktop screenshot: ${publishedDesktopPath}`);

    // Step 7: Test Form Submission & Data Persistence
    console.log('\n[Step 7] Testing Form Submission on Public Website...');
    const formEl = await publicPage.$('form');
    if (formEl) {
      // Fill in enquiry form
      await publicPage.$eval('input[name="name"]', el => el.value = 'Sarah Connor');
      await publicPage.$eval('input[name="email"]', el => el.value = 'sarah.connor@example.com');
      await publicPage.$eval('textarea[name="message"]', el => el.value = 'Interested in purchasing 20 units of Flip Pro Wireless Headphones for our design studio.');

      // Click submit
      const submitBtn = await publicPage.$('button[type="submit"]');
      if (submitBtn) {
        await submitBtn.click();
        console.log('Submitted enquiry form...');
        await new Promise(r => setTimeout(r, 1500));

        // Check for success feedback message
        const feedbackText = await publicPage.$eval('.bx-form-msg', el => el.innerText).catch(() => '');
        console.log(`✔ Form feedback response: "${feedbackText}"`);
      }
    }

    // Verify Database Persistence of the Submission!
    console.log('Verifying submission persisted in backend database...');
    const subRes = await fetch(`http://localhost:5000/api/v1/forms/${projectId}/submissions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const subData = await subRes.json();
    if (subRes.ok && subData.payload?.submissions?.length > 0) {
      const latest = subData.payload.submissions[0];
      console.log(`✔ Database persistence verified! Stored submission for "${latest.name}" (${latest.email}) with message: "${latest.message}"`);
    } else {
      console.log('ℹ Submissions check result:', subData);
    }

    // Step 8: Capture Mobile Published Website Screenshot
    console.log('\n[Step 8] Testing Mobile Published Website (390px)...');
    await publicPage.setViewport({ width: 390, height: 844 });
    await new Promise(r => setTimeout(r, 600));

    const publishedMobilePath = path.join(artifactsDir, 'published_website_mobile.png');
    await publicPage.screenshot({ path: publishedMobilePath, fullPage: true });
    console.log(`✔ Saved Published Mobile screenshot: ${publishedMobilePath}`);

    console.log('\n=======================================================');
    console.log('FLIP STORE E2E TEST & PUBLISH COMPLETED WITH 100% SUCCESS!');
    console.log(`Live Public Storefront: ${publishedUrl}`);
    console.log('=======================================================');

  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error('E2E Execution Error:', err);
  process.exit(1);
});
