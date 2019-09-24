import {Serializable} from './api';

const isSerializable = (value: any): value is Serializable<any> => value && value.serialize instanceof Function;

const isPrimitive = (value: any) => value === null || typeof value !== 'object';

/**
 * An agnostic serializer for design token components, producing a stable and noncircular
 * representation of the data held in components.
 */
export const serialize = <T>(value: T): any => {
  if (isSerializable(value)) {
    // Important! We must recursively serialize any subcomponents below.
    return serialize(value.serialize());
  }

  if (isPrimitive(value)) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(serialize);
  }

  const serialized: any = {};
  for (const key in value) {
    serialized[key] = serialize(value[key]);
  }
  return serialized;
};
