import {DocsTargetSpec} from '@diez/targets';

export const singletonComponent: DocsTargetSpec = {
  id: '/DesignLanguage/Palette/red',
  comments: {
    type: '',
    instance: '',
  },
  name: 'red',
  type: 'Color',
  properties: {},
  value: {},
  isPrimitive: false,
  binding: {
    templates: {
      detail: 'Color/color-detail.vue',
      item: 'Color/color-item.vue',
      icon: 'Color/color-icon.vue',
    },
  },
  examples: {
    ios: [
      {
        example: 'UIColor',
        snippets: [
          {
            lang: 'Swift',
            snippet: '',
          },
          {
            lang: 'Objective-C',
            snippet: '',
          },
        ],
      },
    ],
    web: [
      {
        example: 'Color',
        snippets: [
          {
            lang: 'JavaScript',
            snippet: '',
          },
          {
            lang: 'CSS',
            snippet: '',
          },
        ],
      },
    ],
    android: {
      Programmatic: [
        {
          example: 'Color',
          snippets: [],
        },
      ],
      Declarative: [
        {
          example: 'Color',
          snippets: [],
        },
      ],
    },
  },
};
