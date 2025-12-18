import { Cases, CaseStatus } from './Cases';
import { CaseAttaches } from './CaseAttaches';
import { CaseStatements } from './CaseStatements';
import { CaseResolutions } from './CaseResolutions';

export interface SupportCase {
  base: Cases;
  attachments: CaseAttaches[];
  statements: CaseStatements[];
  resolutions: CaseResolutions[];
}

export type { CaseStatus };


