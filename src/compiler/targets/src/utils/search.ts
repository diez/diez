import {Builder, stopWordFilter, trimmer} from 'lunr';
import {DocsTargetSpec} from '../targets/docs.api';

/**
 * Build a Lunr index for the given tree.
 */
export const buildIndex = (trees: DocsTargetSpec[]) => {
  const builder = new Builder();

  builder.pipeline.add(
    trimmer,
    stopWordFilter,
  );

  builder.ref('id');
  builder.field('name');
  builder.field('type');

  trees.forEach((tree) => addItemToIndex(tree, builder));

  return builder.build();
};

const addItemToIndex = (item: DocsTargetSpec, builder: Builder) => {
  builder.add(item);

  if (!item.binding) {
    Object.values(item.properties).forEach((property) => addItemToIndex(property, builder));
  }
};
