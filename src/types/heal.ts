
export interface Medication {
  id: string;
  mvCode: string;
  name: string;
  presentation: string;
  therapeuticClass: string;
  indication: string;
  dose: {
    adult: string;
    pediatric: string;
    maximum: string;
  };
  doseAdjustment: string;
  photosensitive: boolean;
  administrationRoute: string;
  preparation: {
    reconstitution: string;
    dilution: string;
    healStandard: string;
  };
  stability: string;
  observation: string;
  lastUpdate: string;
}

export interface Material {
  id: string;
  mvCode: string;
  name: string;
  observation: string;
}

export interface Diet {
  id: string;
  mvCode: string;
  name: string;
  observation: string;
}

export type SearchItem = Medication | Material | Diet;

export type ItemType = 'medication' | 'material' | 'diet';
