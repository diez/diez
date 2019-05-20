import {SimpleGradient} from 'diez-poodle-surf';

/**
 * TODO
 * @param position
 * @param gradient
 */
export const generateGradient = (gradient: SimpleGradient) => {
  // TODO: properly calculate the gradient angle
  return `linear-gradient(149deg, ${gradient.startColor}, ${gradient.endColor})`;
};
