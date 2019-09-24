import {prefab, Target} from '@diez/engine';

interface FilteredData {
  excludeMe: boolean;
  includeMe: boolean;
  includeUs: boolean[];
}

export class Filtered extends prefab<FilteredData>() {
  defaults = {
    excludeMe: false,
    includeMe: true,
    includeUs: [true, true, true],
  };

  options = {
    excludeMe: {targets: ['not-test' as Target]},
    includeUs: {targets: ['test' as Target]},
  };
}
