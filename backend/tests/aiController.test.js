import test from 'node:test';
import assert from 'node:assert/strict';

import { validateAiComponents } from '../controllers/AIController.js';

test('accepts valid BuildX component payloads', () => {
  const payload = [
    {
      id: 'nav-1',
      type: 'navbar',
      properties: { brand: 'Guitar House', links: ['Home', 'Shop', 'About'] },
      styles: { width: 1200, height: 72, background: '#0f172a', color: '#f8fafc' },
      position: { x: 0, y: 0 }
    },
    {
      id: 'hero-1',
      type: 'hero',
      properties: { heading: 'Modern Guitar Store', subtext: 'Handpicked instruments for every stage.' },
      styles: { width: 1200, height: 300 },
      position: { x: 0, y: 80 }
    }
  ];

  assert.deepEqual(validateAiComponents(payload), payload);
});

test('rejects malformed AI output before it is inserted into the Builder', () => {
  assert.throws(() => validateAiComponents([
    { type: 'script', properties: { code: 'alert(1)' } }
  ]), /invalid/i);
});
