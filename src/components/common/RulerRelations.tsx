'use client';

import * as React from 'react';
import type { Ruler } from '@/lib/history/types';
import { getRulerRelations, getRelationLabel } from '@/lib/history/rulerRelations';
import { useTranslations } from 'next-intl';
import { RULER_RELATIONS_COLORS } from '@/lib/history/constants';

interface RulerRelationsProps {
  ruler: Ruler;
  allRulers: Ruler[];
  onRulerClick?: (rulerId: string) => void;
}

export function RulerRelations({ ruler, allRulers, onRulerClick }: RulerRelationsProps) {
  const t = useTranslations();
  const relations = React.useMemo(() => getRulerRelations(ruler, allRulers), [ruler, allRulers]);
  
  if (relations.length === 0) return null;
  
  return (
    <div className={`mt-2 pt-2 border-t ${RULER_RELATIONS_COLORS.container.border}`}>
      <div className={`text-xs ${RULER_RELATIONS_COLORS.label.text} mb-1`}>{t('ruler.relations') || '家族关系'}</div>
      <div className="flex flex-wrap gap-1">
        {relations.map(({ ruler: relRuler, relation }) => (
          <button
            key={`${relRuler.id}-${relation}`}
            onClick={() => onRulerClick?.(relRuler.id)}
            className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs ${RULER_RELATIONS_COLORS.badge.bg} ${RULER_RELATIONS_COLORS.badge.hoverBg} ${RULER_RELATIONS_COLORS.badge.text} rounded border ${RULER_RELATIONS_COLORS.badge.border} transition-colors`}
          >
            <span className="font-medium">{getRelationLabel(relation)}</span>
            <span>:</span>
            <span>{t(relRuler.nameKey)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
