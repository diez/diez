import {warning} from '@diez/cli-core';
import {Haiku} from '@diez/prefabs';
import {getTempFileName} from '@diez/storage';
import {outputFileSync, readFileSync} from 'fs-extra';
import {compile} from 'handlebars';
import pascalCase from 'pascal-case';
import {join} from 'path';
import {WebBinding} from '../../targets/web.api';
import {sourcesPath} from '../../utils';

/**
 * This "metabinding" does all the heavy lifting in in assets binder.
 *
 * The problem we're solving is that of producing web SDK files generated uniquely per Haiku component,
 * which ensures we don't interfere with tree shaking using dynamic requires.
 */
const binding: WebBinding<Haiku> = {
  sources: [],
  declarations: [],
  skipGeneration: true,
  assetsBinder: async (instance, _, output, spec) => {
    // Here, we take full control of the generated spec for inline embedding of a Haiku component.
    // This will allow us to generate a unique wrapper per Haiku component type.
    const componentName = pascalCase(instance.component);
    if (output.processedComponents.has(componentName)) {
      return;
    }

    let versionConstraint = 'latest';

    try {
      const packageJson = require(join(instance.component, 'package.json'));
      versionConstraint = packageJson.version;
    } catch (_) {
      warning(`Unable to resolve Haiku component ${instance.component} during compilation.`);
      warning('Please be sure to add it as a dependency in package.json.');
      return;
    }

    // Now we can write out bespoke bindings for this specific component, using require statements
    // with string literals. This ensures our SDK will not interfere with tree-shaking and sources actually work.
    const sourceTemplate = readFileSync(join(sourcesPath, 'web', 'bindings', 'Haiku.js')).toString();
    const sourceFileName = getTempFileName();
    const declarationTemplate = readFileSync(join(sourcesPath, 'web', 'bindings', 'Haiku.d.ts')).toString();
    const declarationFileName = getTempFileName();
    const tokens = {
      componentName,
      haikuComponent: instance.component,
      loop: instance.loop,
      autoplay: instance.autoplay,
    };
    outputFileSync(
      sourceFileName,
      compile(sourceTemplate)(tokens),
    );
    outputFileSync(
      declarationFileName,
      compile(declarationTemplate)(tokens),
    );

    // Add our declaration imports so our typing actually works.
    output.declarationImports.add("import {ComponentFactory} from '@haiku/core/lib/HaikuContext';");

    // Overwrite the spec with our new component name. It should receive no properties.
    spec.componentName = componentName;
    spec.properties = {};

    output.processedComponents.set(
      componentName,
      {
        spec,
        binding: {
          sources: [sourceFileName],
          declarations: [declarationFileName],
          skipGeneration: true,
          dependencies: [{
            packageJson: {
              versionConstraint,
              name: instance.component,
            },
          }],
        },
        instances: new Set([instance]),
      },
    );
  },
};

export = binding;
