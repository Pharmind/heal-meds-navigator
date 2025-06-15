
export type SensitivityResult = 'sensitive' | 'variable' | 'resistant';

export type PathogenData = {
  [antibiotic: string]: SensitivityResult;
};

export type AntibioticMatrix = {
  [pathogen: string]: PathogenData;
};

export interface FlowStep {
  title: string;
  description: string;
  component: React.ReactNode;
}

export interface Recommendation {
  title: string;
  description: string;
  color: string;
  action: string;
}
