import {Typograph} from '@diez/prefabs';
import {IosBinding, IosLanguages} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const examplesPath = join(sourcesPath, 'ios', 'examples', 'Typograph');

const binding: IosBinding<Typograph> = {
  sources: [
    join(sourcesPath, 'ios', 'bindings', 'Typograph+Binding.swift'),
    join(sourcesPath, 'ios', 'bindings', 'WrappedView.swift'),
    join(sourcesPath, 'ios', 'bindings', 'Label.swift'),
    join(sourcesPath, 'ios', 'bindings', 'TextField.swift'),
    join(sourcesPath, 'ios', 'bindings', 'TextView.swift'),
    join(sourcesPath, 'ios', 'bindings', 'Button.swift'),
  ],
  examples: [
    {
      example: 'Label',
      snippets: [
        {
          lang: IosLanguages.Swift,
          templatePath: join(examplesPath, 'Label.swift.handlebars'),
        },
        {
          lang: IosLanguages.ObjectiveC,
          templatePath: join(examplesPath, 'Label.objc.handlebars'),
        },
      ],
    },
    {
      example: 'TextField',
      snippets: [
        {
          lang: IosLanguages.Swift,
          templatePath: join(examplesPath, 'TextField.swift.handlebars'),
        },
        {
          lang: IosLanguages.ObjectiveC,
          templatePath: join(examplesPath, 'TextField.objc.handlebars'),
        },
      ],
    },
    {
      example: 'TextView',
      snippets: [
        {
          lang: IosLanguages.Swift,
          templatePath: join(examplesPath, 'TextView.swift.handlebars'),
        },
        {
          lang: IosLanguages.ObjectiveC,
          templatePath: join(examplesPath, 'TextView.objc.handlebars'),
        },
      ],
    },
    {
      example: 'Button',
      snippets: [
        {
          lang: IosLanguages.Swift,
          templatePath: join(examplesPath, 'Button.swift.handlebars'),
        },
        {
          lang: IosLanguages.ObjectiveC,
          templatePath: join(examplesPath, 'Button.objc.handlebars'),
        },
      ],
    },
    {
      example: 'UINavigationBar Title Text Attributes',
      snippets: [
        {
          lang: IosLanguages.Swift,
          templatePath: join(examplesPath, 'UINavigationBar-Title.swift.handlebars'),
        },
        {
          lang: IosLanguages.ObjectiveC,
          templatePath: join(examplesPath, 'UINavigationBar-Title.objc.handlebars'),
        },
      ],
    },
    {
      example: 'UISegmentedControl Title Text Attributes',
      snippets: [
        {
          lang: IosLanguages.Swift,
          templatePath: join(examplesPath, 'UISegmentedControl-Title.swift.handlebars'),
        },
        {
          lang: IosLanguages.ObjectiveC,
          templatePath: join(examplesPath, 'UISegmentedControl-Title.objc.handlebars'),
        },
      ],
    },
    {
      example: 'UIBarItem Title Text Attributes',
      snippets: [
        {
          lang: IosLanguages.Swift,
          templatePath: join(examplesPath, 'UIBarItem-Title.swift.handlebars'),
        },
        {
          lang: IosLanguages.ObjectiveC,
          templatePath: join(examplesPath, 'UIBarItem-Title.objc.handlebars'),
        },
      ],
    },
    {
      example: 'NSAttributedString',
      snippets: [
        {
          lang: IosLanguages.Swift,
          templatePath: join(examplesPath, 'NSAttributedString.swift.handlebars'),
        },
        {
          lang: IosLanguages.ObjectiveC,
          templatePath: join(examplesPath, 'NSAttributedString.objc.handlebars'),
        },
      ],
    },
    {
      example: 'NSAttributedString Attributes',
      snippets: [
        {
          lang: IosLanguages.Swift,
          templatePath: join(examplesPath, 'NSAttributedString-Attributes.swift.handlebars'),
        },
        {
          lang: IosLanguages.ObjectiveC,
          templatePath: join(examplesPath, 'NSAttributedString-Attributes.objc.handlebars'),
        },
      ],
    },
  ],
};

export = binding;
