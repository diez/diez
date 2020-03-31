import {compile, HelperOptions, registerHelper, RuntimeOptions} from 'handlebars';
import markdownIt from 'markdown-it';
import {applyCase, joinToCase} from './casing';
import prism from './prism';

registerHelper('case', (str: string, {hash}: HelperOptions) => {
  return applyCase(str, hash.style);
});

registerHelper('path', ({data, hash}: HelperOptions) => {
  return joinToCase(data.root.path.slice(2), hash.style, hash.separator, hash.prefix, hash.suffix);
});

const markdownParser = new markdownIt();

/**
 * Applies HTML markup that displays syntax highlighting to the provided text.
 */
export const highlight = (text: string, language: string) => {
  return prism.highlight(text, prism.languages[language], language);
};

/**
 * Converts markdown to HTML markup.
 */
export const markdown = (text: string) => {
  return markdownParser.render(text);
};

/**
 * Compiles and runs a Handlebars template.
 */
export const handlebars = (text: string, context?: any, options?: RuntimeOptions) => {
  return compile(text)(context, options);
};
