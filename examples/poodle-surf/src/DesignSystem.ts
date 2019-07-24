import {LoadingDesign, NavigationTitleDesign, palette, ReportDesign, typographs} from './designs';

class Designs {
  report = new ReportDesign();
  loading = new LoadingDesign();
  navigationTitle = new NavigationTitleDesign();
}

/**
 * The design system for Poodle Surf.
 */
export class DesignSystem {
  palette = palette;
  typographs = typographs;
  designs = new Designs();
}
