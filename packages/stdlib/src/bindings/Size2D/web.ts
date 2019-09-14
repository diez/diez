import {Size2D} from '@diez/prefabs';
import {joinToKebabCase, Rule, WebBinding} from '@diez/targets';
import {join} from 'path';
import {sourcesPath, updateStyleSheetWithUnitedVariables} from '../../utils';

const binding: WebBinding<Size2D> = {
  sources: [join(sourcesPath, 'web', 'bindings', 'Size2D.js')],
  declarations: [join(sourcesPath, 'web', 'bindings', 'Size2D.d.ts')],
  assetsBinder: async (instance, program, output, spec, property) => {
    // TODO: this shouldn't be necessary with a good and general design for "resource boundaries".
    if (property.parentType !== 'Image') {
      const baseName = joinToKebabCase(property.parentType, property.name);
      const rule: Rule = {
        selector: baseName,
        declaration: {},
      };

      if (instance.width) {
        updateStyleSheetWithUnitedVariables(`${baseName}-width`, `${instance.width}`, output.styleSheet);
        rule.declaration.width = `${instance.width}px`;
      }

      if (instance.height) {
        updateStyleSheetWithUnitedVariables(`${baseName}-height`, `${instance.height}`, output.styleSheet);
        rule.declaration.height = `${instance.height}px`;
      }

      if (instance.width || instance.height) {
        output.styleSheet.styles.insertRule(rule);
      }
    }
  },
};

export = binding;
