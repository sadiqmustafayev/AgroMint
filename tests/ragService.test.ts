import { describe, it, expect } from 'vitest';
import { retrieveAgronomicContext } from '../src/lib/ragService';

describe('RAG Retrieval Service', () => {
  it('retrieves cotton weed and boll maturation literature for cotton farmer with weed infestation', () => {
    const results = retrieveAgronomicContext({
      crop: 'Cotton',
      mainProblem: 'Alaq otları sahəni basıb, qozaların açılması ləngiyir',
      soilType: 'Loamy',
    }, 4);

    expect(results.length).toBeGreaterThanOrEqual(1);
    const topResult = results[0];
    expect(topResult.score).toBeGreaterThan(0);
    expect(topResult.chunk.crops).toContain('Cotton');
    expect(topResult.chunk.title).toContain('Bitkiçilik');
  });

  it('retrieves complex fertilizer guidelines when farmer asks about nitrogen and potassium rates', () => {
    const results = retrieveAgronomicContext({
      crop: 'Wheat',
      mainProblem: 'Karbamid yemləmə normasının və kompleks gübrələrin təyini',
    }, 3);

    expect(results.some(r => r.chunk.category === 'fertilizer')).toBe(true);
  });

  it('returns default general agronomic literature if no specific problem is given', () => {
    const results = retrieveAgronomicContext({ crop: 'Cotton' }, 2);
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});
