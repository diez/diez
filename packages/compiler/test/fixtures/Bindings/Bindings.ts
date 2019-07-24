import {prefab} from '@diez/engine';

export class BoundComponent extends prefab<{}>() {
  defaults = {};
}

export class Bindings {
  bound = new BoundComponent();
  ambiguous: any = '12';
}
