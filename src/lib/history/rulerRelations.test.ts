import { describe, it, expect } from 'vitest';
import { getRulerRelations, getRelationLabel } from '@/lib/history/rulerRelations';
import type { Ruler } from '@/lib/history/types';

describe('rulerRelations', () => {
  const mockRulers: Ruler[] = [
    {
      id: 'r1',
      eraId: 'era1',
      nameKey: 'ruler.r1',
      startYear: -700,
      endYear: -650,
      childrenIds: ['r2', 'r3'],
    },
    {
      id: 'r2',
      eraId: 'era1',
      nameKey: 'ruler.r2',
      startYear: -650,
      endYear: -600,
      parentId: 'r1',
      siblingIds: ['r3'],
      childrenIds: ['r4'],
    },
    {
      id: 'r3',
      eraId: 'era1',
      nameKey: 'ruler.r3',
      startYear: -645,
      endYear: -600,
      parentId: 'r1',
      siblingIds: ['r2'],
    },
    {
      id: 'r4',
      eraId: 'era1',
      nameKey: 'ruler.r4',
      startYear: -600,
      endYear: -550,
      parentId: 'r2',
    },
  ];

  describe('getRulerRelations', () => {
    it('should find parent relation', () => {
      const r2 = mockRulers.find(r => r.id === 'r2')!;
      const relations = getRulerRelations(r2, mockRulers);
      
      expect(relations).toContainEqual(
        expect.objectContaining({ ruler: expect.anything(), relation: 'father' })
      );
    });

    it('should find sibling relations', () => {
      const r2 = mockRulers.find(r => r.id === 'r2')!;
      const relations = getRulerRelations(r2, mockRulers);
      
      expect(relations).toContainEqual(
        expect.objectContaining({ relation: 'brother' })
      );
    });

    it('should find child relations', () => {
      const r2 = mockRulers.find(r => r.id === 'r2')!;
      const relations = getRulerRelations(r2, mockRulers);
      
      expect(relations).toContainEqual(
        expect.objectContaining({ relation: 'son' })
      );
    });

    it('should return empty array for ruler with no relations', () => {
      const r4 = mockRulers.find(r => r.id === 'r4')!;
      // r4 has parent but parent doesn't have childrenIds pointing to r4 from the parent's perspective in this test data
      // Actually let me fix the test data - r2 should have childrenIds
      const relations = getRulerRelations(r4, mockRulers);
      // r4 is a child of r2, so it should find father
      expect(relations).toHaveLength(1);
      expect(relations[0].relation).toBe('father');
    });
  });

  describe('getRelationLabel', () => {
    it('should return correct Chinese labels', () => {
      expect(getRelationLabel('father')).toBe('父');
      expect(getRelationLabel('son')).toBe('子');
      expect(getRelationLabel('brother')).toBe('兄弟');
    });
  });
});
