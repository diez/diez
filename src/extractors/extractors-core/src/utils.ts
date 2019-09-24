import {cliRequire, findPlugins, Log} from '@diez/cli-core';
import {ExtractorFactory, ExtractorInput} from './api';

const factories = new Set<ExtractorFactory>();

/**
 * Locates the correct extractor factory for a given source.
 */
const findFactory = async (source: string): Promise<ExtractorFactory> => {
  if (!factories.size) {
    for (const [plugin, {providers}] of await findPlugins()) {
      if (!providers || !providers.extractors) {
        continue;
      }

      for (const extractor of providers.extractors) {
        factories.add(cliRequire(plugin, extractor));
      }
    }
  }

  for (const factory of factories) {
    if (await factory.canParse(source)) {
      return factory;
    }
  }

  throw new Error(`Unable to find appropriate extractor for ${source}.`);
};

/**
 * Performs extraction for a bespoke ExtractorInput.
 */
export const performExtraction = async (
  input: ExtractorInput,
  projectRoot: string,
) => {
  const constructorArgs: string[] = [];
  const factory = await findFactory(input.source);
  if (factory.configure) {
    await factory.configure(constructorArgs);
  }

  try {
    const extractor = factory.create(...constructorArgs);
    await extractor.export(input, projectRoot, {progress: Log.info, error: Log.warning});
  } catch (error) {
    if (factory.shouldRetryError && await factory.shouldRetryError(error)) {
      await performExtraction(input, projectRoot);
    } else {
      throw error;
    }
  }
};
