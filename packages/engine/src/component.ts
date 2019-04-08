import {
  Indexable,
  Listeners,
  Listening,
  Patcher,
  Serializable,
  Stateful,
  Tickable,
  Tween,
  Tweenable,
  TweenSpecification,
} from './api';
import {getPatcher} from './platform';
import {Serializer} from './serialization';
import {interpolateNumbers} from './transitions';

/**
 * Private type verifier for component-ness.
 */
const isComponent = (maybeComponent: any): maybeComponent is Component<any> => {
  return maybeComponent && maybeComponent.constructor && maybeComponent.constructor.isComponent;
};

/**
 * Private type verifier for number-ness.
 */
const isNumeric = (n: any): n is number => !isNaN(parseFloat(n)) && isFinite(n);

/**
 * A default tween to use when no other tween is available.
 */
const linearTween = (t: number) => t;

interface EndtimeResolver<T> {
  resolve (): void;
  reject (): void;
  endTime: number;
  keys: Set<keyof T>;
}

/**
 * The abstract Component class is responsible for serializing its readonly state via patches.
 * @typeparam T - An [[Indexable]] interface the component state must adhere to. This parameter can be elided unless the
 *                component is instantiated with overridden state.
 */
export abstract class Component<T extends Indexable = any>
  implements Stateful<T>, Tweenable<T>, Listening, Tickable, Serializable {
  /**
   * Important: this flag instructs the hosting system we are a component instance.
   */
  static isComponent = true;

  /**
   * A registry of hosted child components.
   */
  private readonly children = new Map<keyof T, Component<any>>();

  /**
   * A registry of tweens.
   */
  tweens = new Map<keyof T, Tween>();

  /**
   * Humble, readonly state container.
   */
  protected readonly state: T;

  /**
   * The (nullable) component that is hosting us.
   */
  host?: Component<any>;

  /**
   * Initialized via decorators.
   */
  listeners?: Listeners;

  /**
   * Responsible for serializing against our mutable state container.
   */
  private readonly serializer: Serializer<T>;

  /**
   * Responsible for tracking tween end resolutions.
   */
  private readonly endtimeResolvers = new Set<EndtimeResolver<T>>();

  /**
   * The internal timekeeping mechanism for this component.
   */
  time = 0;

  /**
   * Internal tracker for whether our component instance should patch on the next tick.
   */
  private doPatch = false;

  /**
   * A map of bound state names.
   */
  readonly boundStates = new Map<string, boolean>();

  /**
   * A map of bound shared data.
   */
  readonly boundShared = new Map<string, any>();

  constructor (
    state: Partial<T> = {},
    private readonly patcher: Patcher = getPatcher(),
  ) {
    // Note how we explicitly case state as T. (We will soon also accept Expression<T>s at init time).
    // Our engine relies on runtime initialization with defaults in concrete implementations.
    this.state = state as T;
    this.serializer = new Serializer<T>(this.state);
  }

  /**
   * Private patcher implementation.
   */
  private patch () {
    if (this.doPatch) {
      this.doPatch = false;
      this.patcher(this.serializer.payload);
    }
  }

  eachChild (handler: (child: Component<any>) => void) {
    this.children.forEach(handler);
  }

  /**
   * Serializable interface.
   *
   * Generic serialization instructions. These can be overridden as needed.
   */
  serialize () {
    return this.serializer.payload;
  }

  /**
   * Notes that state has been mutated and serialized payload should be re-flushed.
   */
  dirty () {
    if (this.host) {
      this.host.dirty();
    } else {
      this.doPatch = true;
    }
  }

  /**
   * Tickable interface. Ticks the clock at the provided time.
   */
  tick (time: number) {
    this.time = time;
    this.eachChild((child) => child.tick(time));
    this.executeTweens();

    // Check our endtime resolvers for any dangling promises, and resolve them if we are past the end time.
    for (const endtimeResolver of this.endtimeResolvers) {
      if (endtimeResolver.endTime <= time) {
        endtimeResolver.resolve();
        this.endtimeResolvers.delete(endtimeResolver);
      }
    }
    if (!this.host) {
      this.patch();
    }
  }

  /**
   * Stateful<T> interface. Retrieves a state value.
   */
  get<K extends keyof T> (key: K): T[K] {
    return this.state[key];
  }

  /**
   * Stateful<T> interface. Updates states and patch.
   */
  set (state: Partial<T>): void {
    let dirty = false;
    Object.entries(state).forEach(([key, child]) => {
      if (this.state[key] === child) {
        return;
      }

      dirty = true;
      if (isComponent(child)) {
        this.children.set(key, child);
        child.host = this;
      }
      this.state[key] = child;
    });
    if (dirty) {
      this.dirty();
    }
  }

  /**
   * Tweenable<T> interface. Schedule state updates for the duration of the tween.
   */
  tween (state: Partial<T>, spec: TweenSpecification): Promise<void> {
    if (spec.duration === 0) {
      this.set(state);
      return new Promise((resolve) => resolve());
    }

    const endTime = this.time + spec.duration;

    if (
      !spec.curve ||
      !(spec.curve instanceof Function)
      || spec.curve(0) !== 0
      || spec.curve(1) !== 1
    ) {
      spec.curve = linearTween;
    }

    for (const k in state) {
      if (isNumeric(this.state[k]) && isNumeric(state[k])) {
        // Do not bother setting trivial tweens.
        if (this.state[k] === state[k]) {
          continue;
        }

        this.tweens.set(k, {
          endTime,
          startValue: this.state[k],
          endValue: state[k]!,
          startTime: this.time,
          curve: spec.curve,
        });
      } else if (isComponent(this.state[k]) && isComponent(state[k])) {
        this.state[k].tween(state[k].state, spec);
      }
    }

    // Check for any transitions in progress that were interrupted. Reject and dequeue them.
    const keys = Object.keys(state);
    for (const endtimeResolver of this.endtimeResolvers) {
      if (keys.filter((key) => endtimeResolver.keys.has(key)).length > 0) {
        endtimeResolver.reject();
        this.endtimeResolvers.delete(endtimeResolver);
      }
    }

    return new Promise((resolve, reject) => {
      this.endtimeResolvers.add({endTime, resolve, reject, keys: new Set(keys)});
    });
  }

  /**
   * Ticks all active tweens, trims completed tweens, and fires onComplete callbacks.
   */
  private executeTweens () {
    const tweenPatch: Partial<T> = {};
    for (const [key, tween] of this.tweens) {
      // FIXME: in the case of a bulk tween, we are significantly overcalculating here.
      // The tween function can be wrapped to store its tween values at time for better
      // computational efficiency.
      tweenPatch[key] = interpolateNumbers(
        tween.startValue,
        tween.endValue,
        tween.startTime,
        tween.endTime,
        this.time,
        tween.curve,
      ) as T[keyof T];

      if (tween.endTime <= this.time) {
        this.tweens.delete(key);
      }
    }
    this.set(tweenPatch);
  }

  /**
   * Listening interface. Fires the event listener for a given event name and payload type.
   */
  trigger<D> (name: string, payload?: D) {
    if (!this.listeners || !this.listeners[name]) {
      return;
    }

    this.listeners[name].call(this, payload);
  }
}

/**
 * A concrete component, used for typing.
 */
export class ConcreteComponent extends Component<any> {}

/**
 * A concrete component type, used for typing.
 */
export type ConcreteComponentType = typeof ConcreteComponent;
