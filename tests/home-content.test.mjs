import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const index = readFileSync('src/pages/index.astro', 'utf8');

test('home wires the campaign sections without removing existing sections', () => {
  const expectedImports = [
    'CampaignActionRail',
    'PeruvianLiteratureSpotlight',
    'CampaignTrustFlow',
    'OrderSupportCTA',
  ];

  for (const name of expectedImports) {
    assert.match(index, new RegExp(`import ${name} from`));
    assert.match(index, new RegExp(`<${name}\\b`));
  }

  for (const existing of ['<Hero />', '<CategoryGrid />', '<FeaturedCarousel', '<BenefitsBar />']) {
    assert.ok(index.includes(existing), `${existing} should remain on the home page`);
  }
});

test('campaign banner uses fixed contrast instead of token text on accent', () => {
  assert.match(index, /bg-accent/);
  assert.doesNotMatch(index, /text-primary">Feria del Libro/);
  assert.match(index, /text-\[#0D0D0D\]/);
});
