import {AssetBinder, AssetBindings} from '@diez/compiler';
import {File, Image} from '@diez/prefabs';
import {basename, dirname, join, parse} from 'path';
import {IosBinding, IosOutput} from '../../targets/ios.api';
import {sourcesPath} from '../../utils';

const assetCatalog = 'Images.xcassets';

const makeContentsInfoJson = (bundleId: string) => ({
  version: 1,
  author: bundleId,
});

const makeContentsJson = (bundleId: string) => ({
  info: makeContentsInfoJson(bundleId),
});

const makeFolderContentsJson = (bundleId: string) => ({
  info: makeContentsInfoJson(bundleId),
  properties: {
    'provides-namespace': true,
  },
});

const makeImagesetContentsImageJson = (filename: string, scale: string) => ({
  filename,
  scale,
  idiom: 'universal',
});

const makeImagesetContentsJson = (bundleId: string, file: string, file2x: string, file3x: string) => ({
  info: makeContentsInfoJson(bundleId),
  images: [
    makeImagesetContentsImageJson(file, '1x'),
    makeImagesetContentsImageJson(file2x, '2x'),
    makeImagesetContentsImageJson(file3x, '3x'),
  ],
});

const addCatalog = (assetBindings: AssetBindings, bundleId: string) => {
  if (assetBindings.has(assetCatalog)) {
    return;
  }

  const json = makeContentsJson(bundleId);
  const contents = JSON.stringify(json, null, 2);

  assetBindings.set(
    join(assetCatalog, 'Contents.json'),
    {contents},
  );
};

const addFolderGroups = (path: string, assetBindings: AssetBindings, bundleId: string) => {
  const components = path.split('/');
  if (components.length === 0) {
    return;
  }

  const json = makeFolderContentsJson(bundleId);
  const contents = JSON.stringify(json, null, 2);

  let pathWalk = assetCatalog;
  for (const component of components) {
    pathWalk = join(pathWalk, component);

    const contentsFile = join(pathWalk, 'Contents.json');
    if (assetBindings.has(contentsFile)) {
      continue;
    }

    assetBindings.set(
      contentsFile,
      {contents},
    );
  }
};

const addImageSetContents = (destination: string, instance: Image, assetBindings: AssetBindings, bundleId: string) => {
  const imageSetContents = join(destination, 'Contents.json');

  const file = basename(instance.file.src);
  const file2x = basename(instance.file2x.src);
  const file3x = basename(instance.file3x.src);
  const json = makeImagesetContentsJson(bundleId, file, file2x, file3x);
  const contents = JSON.stringify(json, null, 2);

  assetBindings.set(
    imageSetContents,
    {contents},
  );
};

const addImage = async (file: File, destination: string, projectRoot: string, assetBindings: AssetBindings) => {
  const filename = basename(file.src);
  const path = join(destination, filename);

  assetBindings.set(
    path,
    {
      contents: join(projectRoot, file.src),
      copy: true,
    },
  );
};

const addImageSet = async (instance: Image, projectRoot: string, assetBindings: AssetBindings, bundleId: string) => {
  const parsed1x = parse(instance.file.src);
  const destination = join(assetCatalog, parsed1x.dir, `${parsed1x.name}.imageset`);

  return Promise.all([
    addImage(instance.file, destination, projectRoot, assetBindings),
    addImage(instance.file2x, destination, projectRoot, assetBindings),
    addImage(instance.file3x, destination, projectRoot, assetBindings),
    addImageSetContents(destination, instance, assetBindings, bundleId),
  ]);
};

const imageAssetBinder: AssetBinder<Image, IosOutput> =
  async (instance, {projectRoot, hot}, {assetBindings, bundleIdPrefix}) => {
    // In hot mode, we don't need an asset bundle as files are loaded dynamically.
    if (hot) {
      return;
    }

    // In non-hot mode, we don't need to create static assets from the underlying files.
    assetBindings.delete(instance.file.src);
    assetBindings.delete(instance.file2x.src);
    assetBindings.delete(instance.file3x.src);

    const bundleId = `${bundleIdPrefix}.Static`;

    await Promise.all([
      addCatalog(assetBindings, bundleId),
      addFolderGroups(dirname(instance.file.src), assetBindings, bundleId),
      addImageSet(instance, projectRoot, assetBindings, bundleId),
    ]);
  };

const binding: IosBinding<Image> = {
  sources: [join(sourcesPath, 'ios', 'bindings', 'Image.swift')],
  imports: ['UIKit'],
  assetsBinder: imageAssetBinder,
};

export = binding;
