import {Lottie} from '@diez/prefabs';
import {palette} from './constants';

enum LottieJsons {
  HangTen = 'assets/lottie/hang10.json',
  LoadingPizza = 'assets/lottie/loading-pizza.json',
  PoodleSurf = 'assets/lottie/poodle-surf.json',
}

/**
 * The loading design.
 */
export class LoadingDesign {
  backgroundColor = palette.loadingBackground;
  animation = Lottie.fromJson(LottieJsons.PoodleSurf);
}
