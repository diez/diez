import {Component, method, property} from '../src';

interface FooState {
  aNumber: number;
  anotherNumber: number;
}

class Foo extends Component<FooState> {
  @property aNumber = 1;
  @property anotherNumber = 2;
}

interface BarState {
  myNumber: number;
  foo: Foo;
}

class Bar extends Component<BarState> {
  @property myNumber = 3;

  @property foo = new Foo();

  @method async doSomething () {
    await this.tween({myNumber: 4}, {duration: 1000});
    await this.foo.tween(
      {aNumber: 2, anotherNumber: 4},
      {duration: 1000},
    );
    await this.tween(
      {foo: new Foo({aNumber: 3, anotherNumber: 4})},
      {duration: 1000},
    );
  }
}

const component = new Bar();
const originalFoo = component.foo;

describe('tweens', () => {
  // The tests below mimic the runtime mechanics of ticking periodically from an external event loop.
  // To allow the tween promises to resolve before the next tick, each subsequent transition is tested
  // in a subsequent test.
  test('simple numeric tween', () => {
    component.tick(0); // Start the clock at 0.
    expect(component.serialize()).toEqual({myNumber: 3, foo: {aNumber: 1, anotherNumber: 2}});
     // Tick 1000 units, but without any tweens firing. Expected: unchanged.
    component.tick(1000);
    expect(component.serialize()).toEqual({myNumber: 3, foo: {aNumber: 1, anotherNumber: 2}});
    component.doSomething();
    component.tick(1000);
     // Expected: unchanged (the time hasn't progressed from the last tick).
    expect(component.serialize()).toEqual({myNumber: 3, foo: {aNumber: 1, anotherNumber: 2}});
    component.tick(1500);
    // Expected: 50% through myNumber transition from 3 to 4.
    expect(component.serialize()).toEqual({myNumber: 3.5, foo: {aNumber: 1, anotherNumber: 2}});
    component.tick(2000);
    // Expected: 100% through myNumber transition from 3 to 4.
    expect(component.serialize()).toEqual({myNumber: 4, foo: {aNumber: 1, anotherNumber: 2}});
  });

  test('double-valued numeric tween', () => {
    // At this point, a new double-valued Foo-transition frpm {1, 2} to {2, 4} has begun.
    component.tick(2500);
    expect(component.foo.serialize()).toEqual({aNumber: 1.5, anotherNumber: 3});
    component.tick(3000);
    expect(component.foo.serialize()).toEqual({aNumber: 2, anotherNumber: 4});
  });

  test('full component tween', () => {
    // At this point, a new full-component transition from {2, 4} to {3, 4} has begun.
    component.tick(3500);
    expect(component.foo.serialize()).toEqual({aNumber: 2.5, anotherNumber: 4});
    component.tick(4000);
    expect(component.foo.serialize()).toEqual({aNumber: 3, anotherNumber: 4});
    // Important: we shouldn't have actually reassigned foo.
    expect(component.foo).toBe(originalFoo);
  });

  const interruptedComponent = new Bar();
  test('interruption', () => {
    interruptedComponent.tick(0); // Start the clock at 0.
    expect(interruptedComponent.serialize()).toEqual({myNumber: 3, foo: {aNumber: 1, anotherNumber: 2}});
     // Tick 1000 units, but without any tweens firing. Expected: unchanged.
    interruptedComponent.tick(1000);
    expect(interruptedComponent.myNumber).toBe(3);
    interruptedComponent.doSomething();
    interruptedComponent.tick(1000);
     // Expected: unchanged (the time hasn't progressed from the last tick).
    expect(interruptedComponent.myNumber).toBe(3);
    interruptedComponent.tick(1500);
    // Expected: 50% through myNumber transition from 3 to 4.
    expect(interruptedComponent.myNumber).toBe(3.5);

    // INTERRUPT!
    interruptedComponent.doSomething();
    // Expected: unchanged.
    expect(interruptedComponent.myNumber).toBe(3.5);
    interruptedComponent.tick(2000);
    // Expected: 50% through myNumber transition from 3.5 to 4.
    expect(interruptedComponent.myNumber).toBe(3.75);

    // INTERRUPT!
    interruptedComponent.doSomething();
    // Expected: unchanged.
    expect(interruptedComponent.myNumber).toBe(3.75);
    interruptedComponent.tick(2500);
    // Expected: 50% through myNumber transition from 3.75 to 4.
    expect(interruptedComponent.myNumber).toBe(3.875);

    // INTERRUPT!
    interruptedComponent.doSomething();
    // Expected: unchanged.
    expect(interruptedComponent.myNumber).toBe(3.875);
    interruptedComponent.tick(3000);
    // Expected: 50% through myNumber transition from 3.875 to 4.
    expect(interruptedComponent.myNumber).toBe(3.9375);
    interruptedComponent.tick(3500);
    // Expected: 100% through myNumber transition from 3.875 to 4.
    expect(interruptedComponent.myNumber).toBe(4);
    // Important: none of the this.foo.tween(...) calls should have fired.
    expect(interruptedComponent.serialize()).toEqual({myNumber: 4, foo: {aNumber: 1, anotherNumber: 2}});
  });
});
