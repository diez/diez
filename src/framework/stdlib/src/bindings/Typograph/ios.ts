import {Typograph} from '@diez/prefabs';
import {IosBinding, IosLanguages} from '@diez/targets';
import {join} from 'path';
import {sourcesPath} from '../../utils';

const examplesPath = join(sourcesPath, 'ios', 'examples', 'Typograph');

const binding: IosBinding<Typograph> = {
  sources: [join(sourcesPath, 'ios', 'bindings', 'Typograph+Binding.swift')],
  examples: [
    {
      example: 'UILabel',
      snippets: [
        {
          lang: IosLanguages.Swift,
          templatePath: join(examplesPath, 'UILabel.swift.handlebars'),
        },
        {
          lang: IosLanguages.ObjectiveC,
          templatePath: join(examplesPath, 'UILabel.objc.handlebars'),
        },
      ],
    },
    {
      example: 'UITextField',
      snippets: [
        {
          lang: IosLanguages.Swift,
          templatePath: join(examplesPath, 'UITextField.swift.handlebars'),
        },
        {
          lang: IosLanguages.ObjectiveC,
          templatePath: join(examplesPath, 'UITextField.objc.handlebars'),
        },
      ],
    },
    {
      example: 'UITextView',
      snippets: [
        {
          lang: IosLanguages.Swift,
          templatePath: join(examplesPath, 'UITextView.swift.handlebars'),
        },
        {
          lang: IosLanguages.ObjectiveC,
          templatePath: join(examplesPath, 'UITextView.objc.handlebars'),
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
