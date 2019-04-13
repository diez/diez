import {NamedComponentMap} from '@livedesigner/compiler';
import {Component, property} from '@livedesigner/engine';

export class PrimitivesComponent extends Component {
  @property number = 10;
  @property string = 'ten';
  @property boolean = !!10;
}

export const primitivesComponentMap: NamedComponentMap = new Map([[
  'PrimitivesComponent',
  {
    properties: [
      {
        name: 'number',
        isComponent: false,
      },
      {
        name: 'string',
        isComponent: false,
      },
      {
        name: 'boolean',
        isComponent: false,
      },
    ],
  },
]]);
