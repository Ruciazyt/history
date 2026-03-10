import type { Ruler, RulerRelation } from './types';

/**
 * Get all related rulers for a given ruler
 */
export function getRulerRelations(ruler: Ruler, allRulers: Ruler[]): { ruler: Ruler; relation: RulerRelation }[] {
  const relations: { ruler: Ruler; relation: RulerRelation }[] = [];
  
  // Find parent
  if (ruler.parentId) {
    const parent = allRulers.find(r => r.id === ruler.parentId);
    if (parent) relations.push({ ruler: parent, relation: 'father' });
  }
  
  // Find siblings
  if (ruler.siblingIds) {
    for (const siblingId of ruler.siblingIds) {
      const sibling = allRulers.find(r => r.id === siblingId);
      if (sibling) relations.push({ ruler: sibling, relation: 'brother' });
    }
  }
  
  // Find children
  if (ruler.childrenIds) {
    for (const childId of ruler.childrenIds) {
      const child = allRulers.find(r => r.id === childId);
      if (child) relations.push({ ruler: child, relation: 'son' });
    }
  }
  
  return relations;
}

/**
 * Get relation label in Chinese
 */
export function getRelationLabel(relation: RulerRelation): string {
  const labels: Record<RulerRelation, string> = {
    father: '父',
    mother: '母',
    son: '子',
    daughter: '女',
    brother: '兄弟',
    sister: '姐妹',
    uncle: '叔伯',
    nephew: '侄',
    grandfather: '祖父',
    grandson: '孙',
    cousin: '堂兄弟',
  };
  return labels[relation];
}
