import {Presentable, Serializable} from './api';

const isSerializable = (value: any): value is Serializable<any> => value && value.serialize instanceof Function;

/**
 * Checks if a value conforms to the [[Presentable]] interface
 *
 * @ignore
 */
export const isPresentable = (value: any): value is Presentable<any> => value && value.toPresentableValue instanceof Function;

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

const presentProperty = <T>(value: T): any => {
  if (isPresentable(value)) {
    // Important! We must recursively serialize any subcomponents below.
    return presentProperty(value.toPresentableValue());
  }

  if (isPrimitive(value)) {
    return value;
  }

  if (Array.isArray(value)) {
    return `[${value.map(presentProperty)}]`;
  }
};

/**
 * An agnostic serializer for design token components, producing a stable and noncircular
 * representation of the data held in components.
 */
export const presentProperties = <T>(value: T): any => {
  const serialized: any = {};
  for (const key in value) {
    serialized[key] = presentProperty(value[key]);
  }
  return serialized;
};
