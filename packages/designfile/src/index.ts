import {figma} from './exporters/figma';
import {illustrator} from './exporters/illustrator';
import {sketch} from './exporters/sketch';

const ENABLED_EXPORTERS = [figma, illustrator, sketch];

const findExporter = (source: string) => {
  return ENABLED_EXPORTERS.find((exporter) => exporter.canParse(source));
};

export const canParse = (source: string): boolean => {
  return Boolean(findExporter(source));
};

export const exportSVG = async (source: string, out: string) => {
  const exporter = findExporter(source);

  if (exporter) {
    return exporter.exportSVG(source, out);
  }

  return false;
};
