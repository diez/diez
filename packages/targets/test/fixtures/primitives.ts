import {NamedComponentMap} from '@diez/compiler';
import {Component, property} from '@diez/engine';

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
        type: 'number',
        depth: 0,
      },
      {
        name: 'string',
        isComponent: false,
        type: 'string',
        depth: 0,
      },
      {
        name: 'boolean',
        isComponent: false,
        type: 'boolean',
        depth: 0,
      },
    ],
  },
]]);
