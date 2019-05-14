import {AssetBinder, AssetBindings} from '@diez/compiler';
import {File, Image} from '@diez/prefabs';
import {stat} from 'fs-extra';
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

const makeImagesetContentsJson = (bundleId: string, file1x: string, file2x: string, file3x: string) => ({
  info: makeContentsInfoJson(bundleId),
  images: [
    makeImagesetContentsImageJson(file1x, '1x'),
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

  const file1x = basename(instance.file1x.src);
  const file2x = basename(instance.file2x.src);
  const file3x = basename(instance.file3x.src);
  const json = makeImagesetContentsJson(bundleId, file1x, file2x, file3x);
  const contents = JSON.stringify(json, null, 2);

  assetBindings.set(
    imageSetContents,
    {contents},
  );
};

const addImage = async (file: File, destination: string, projectRoot: string, assetBindings: AssetBindings) => {
  const filePath = join(projectRoot, file.src);

  const stats = await stat(filePath);
  if (!stats.isFile()) {
    throw new Error(`Image file at ${filePath} does not exist.`);
  }

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
  const parsed1x = parse(instance.file1x.src);
  const destination = join(assetCatalog, parsed1x.dir, `${parsed1x.name}.imageset`);

  return Promise.all([
    addImage(instance.file1x, destination, projectRoot, assetBindings),
    addImage(instance.file2x, destination, projectRoot, assetBindings),
    addImage(instance.file3x, destination, projectRoot, assetBindings),
    addImageSetContents(destination, instance, assetBindings, bundleId),
  ]);
};

const imageAssetBinder: AssetBinder<Image, IosOutput> =
  async (instance, projectRoot, {assetBindings, bundleIdPrefix}) => {
    const dirname1x = dirname(instance.file1x.src);
    const dirname2x = dirname(instance.file2x.src);
    const dirname3x = dirname(instance.file3x.src);
    const directoriesMatch = (dirname1x === dirname2x && dirname2x === dirname3x);

    if (!directoriesMatch) {
      throw new Error(`Image files are not in the same directory:
- ${instance.file1x.src}
- ${instance.file2x.src}
- ${instance.file3x.src}`);
    }

    const bundleId = `${bundleIdPrefix}.Static`;

    await Promise.all([
      addCatalog(assetBindings, bundleId),
      addFolderGroups(dirname1x, assetBindings, bundleId),
      addImageSet(instance, projectRoot, assetBindings, bundleId),
    ]);
  };

const binding: IosBinding<Image> = {
  sources: [join(sourcesPath, 'ios', 'bindings', 'Image.swift')],
  imports: ['UIKit'],
  assetsBinder: imageAssetBinder,
};

export = binding;
