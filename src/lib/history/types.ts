export type Era = {
  id: string;
  nameKey: string; // i18n key
  startYear: number; // negative for BCE
  endYear: number;
};

export type Ruler = {
  id: string;
  eraId: string;
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
