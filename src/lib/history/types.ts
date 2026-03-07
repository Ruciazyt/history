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
  entityId: string; // dynasty/country/etc
  year: number;
  title: string;
  summary: string;
  tags?: string[];
  location?: { lon: number; lat: number; label?: string };
  sources?: { label: string; url?: string }[];
};
