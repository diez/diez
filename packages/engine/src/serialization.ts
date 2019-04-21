import {AnySerializable, Primitive, Serializable} from './api';

const isSerializable = (value: object | AnySerializable): value is Serializable => {
  return value !== null && (value as Serializable).serialize instanceof Function;
};

const isPrimitive = (value: object | AnySerializable): value is Primitive => {
  return value === null || typeof value !== 'object';
};

const serialize = (value: any): AnySerializable => {
  if (isSerializable(value)) {
    // Important! We must recursively serialize any subcomponents below.
    return serialize(value.serialize());
  }

  if (isPrimitive(value)) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((arrayValue) => serialize(arrayValue)) as AnySerializable;
  }

  const serialized: any = {};
  for (const key in value) {
    serialized[key] = serialize(value[key]);
  }
  return serialized;
};

/**
 * Generically typed serializer for a given state shape.
 *
 * TODO: track dirty state and use an internal cache so we don't have to reserialize values that haven't changed.
 */
export class Serializer<T> {
  constructor (private readonly state: T) {}

  get payload (): {[property: string]: AnySerializable} {
    return serialize(this.state) as {[property: string]: AnySerializable};
  }
}
