import {loadingDesign, navigationTitleDesign, palette, reportDesign, typographs} from './designs';

const designs = {
  report: reportDesign,
  loading: loadingDesign,
  navigationTitle: navigationTitleDesign,
}

/**
 * The design system for Poodle Surf.
 */
export const designSystem = {
  designs,
  palette,
  typographs,
}
