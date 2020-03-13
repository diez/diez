import {
  animations,
  Breadcrumb,
  Button,
  Code,
  cornerRadii,
  DocsDetail,
  DocsItem,
  palette,
  Pill,
  Scrollbar,
  Search,
  Select,
  shadows,
  sizings,
  spacings,
  typography,
} from './designs';

class Designs {
  docsItem = new DocsItem();
  docsDetail = new DocsDetail();
  breadcrumb = new Breadcrumb();
  button = new Button();
  select = new Select();
  scrollbar = new Scrollbar();
  search = new Search();
  code = new Code();
  pill = new Pill();
}

/**
 * The design langugae.
 */
export class DesignLanguage {
  animations = animations;
  palette = palette;
  typography = typography;
  shadows = shadows;
  spacings = spacings;
  sizings = sizings;
  cornerRadii = cornerRadii;
  designs = new Designs();
}
