import * as Prism from 'prismjs';

/**
 * This is needed to ensure language compilers are loaded correctly into the `Prism` UMD global because the Prism
 * templating language works by having plugins directly modify `Prism.languages` when injected.
 */
/* tslint:disable:no-var-requires */
require('prismjs/components/prism-swift.js');
require('prismjs/components/prism-c.js');
require('prismjs/components/prism-objectivec.js');
require('prismjs/components/prism-java.js');
require('prismjs/components/prism-kotlin.js');
require('prismjs/components/prism-scss.js');
/* tslint:enable:no-var-requires */

export default Prism;
