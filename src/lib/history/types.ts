export type Era = {
  id: string;
  nameKey: string; // i18n key
  startYear: number; // negative for BCE
  endYear: number;

  /**
   * Multi-polity (parallel states) era such as Warring States / Five Dynasties.
   * When true, UI may render rulers grouped by polities instead of a single list.
   */
  isParallelPolities?: boolean;
  polities?: { id: string; nameKey: string }[];
};

export type Ruler = {
  id: string;
  eraId: string;
  /** Optional: used when era.isParallelPolities is true */
  polityId?: string;
  nameKey: string; // i18n key
  startYear: number;
  endYear: number;
  bioKey?: string; // i18n key
  highlightKey?: string; // i18n key
};

export type Entity = {
  id: string;
  name: string;
  kind: 'country' | 'dynasty' | 'empire' | 'state' | 'region';
  parentId?: string; // e.g. dynasty -> country
  startYear: number;
  endYear: number;
  center?: { lon: number; lat: number };
};

export type Event = {
  id: string;
  entityId: string; // eraId
  year: number;
  titleKey: string; // i18n key
  summaryKey: string; // i18n key
  tags?: string[];
  location?: { lon: number; lat: number; label?: string };
  sources?: { label: string; url?: string }[];
};
