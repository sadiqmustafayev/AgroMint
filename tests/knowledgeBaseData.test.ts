import { describe, it, expect } from 'vitest';
import knowledgeBase from '../src/data/agronomyKnowledgeBase.json';

describe('Agronomy Knowledge Base Dataset', () => {
  it('contains at least 25 structured agronomic knowledge chunks', () => {
    expect(Array.isArray(knowledgeBase)).toBe(true);
    expect(knowledgeBase.length).toBeGreaterThanOrEqual(25);
  });

  it('contains key Azerbaijani agronomy textbooks with valid fields', () => {
    const bitkichilik = knowledgeBase.find((c: any) => c.title.includes('Bitkiçilik'));
    expect(bitkichilik).toBeDefined();
    expect(bitkichilik.author).toContain('Məmmədov');
    expect(bitkichilik.content.length).toBeGreaterThan(50);
  });
});
