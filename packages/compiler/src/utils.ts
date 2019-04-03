import {TemplateHandlerFactory, TemplateProvider} from './api';

/**
 * A TemplateProvider factory.
 */
export const provideTemplate = (path: string, factory: TemplateHandlerFactory): TemplateProvider => (
  {path, factory});
