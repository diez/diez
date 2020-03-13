import {Panel} from '@diez/prefabs';
import {cornerRadii, fills, shadows, typography} from './constants';

class CodeTabs {
  panel = new Panel({
    background: fills.subtle,
    dropShadow: shadows.transparent,
    cornerRadius: cornerRadii.base,
  });
  panelActive = new Panel({
    background: fills.secondary,
    dropShadow: shadows.transparent,
    cornerRadius: cornerRadii.base,
  });
}

/**
 * Default styles for `<code>` elements.
 */
export class Code {
  panel = new Panel({
    background: fills.secondary,
    dropShadow: shadows.transparent,
  });
  typograph = typography.code;
  tabs = new CodeTabs();
}
