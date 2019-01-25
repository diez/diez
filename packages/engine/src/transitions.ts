import {Curve} from './api';

/**
 * Given a time interval [t0, t1], returns the normalized value of t in [0, 1].
 */
const normalizedProgress = (t0: number, t1: number, t: number) => {
  if (t0 === t1) {
    return 1;
  }

  return (t - t0) / (t1 - t0);
};

/**
 * Given a numeric value progression from v0 to v1, returns an intermediate value after [0, 1]-normalized progress.
 * For example, at progress 0 the value is v0, at progress 1 the value is v1, and at progress 0.5 the value is the
 * average of v0 and v1.
 */
const progression = (v0: number, v1: number, progress: number) => {
  if (v0 === v1) {
    return v1;
  }

  return v0 + (v1 - v0) * progress;
};

/**
 * Simple interpolator between numbers.
 */
export const interpolateNumbers = (v0: number, v1: number, t0: number, t1: number, t: number, curve: Curve): number =>
  progression(v0, v1, curve(normalizedProgress(t0, t1, t)));
