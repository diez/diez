import {Lottie} from '@diez/designsystem';
import {Component, property} from '@diez/engine';
import {palette} from './constants';

enum LottieJsons {
  HangTen = '/assets/lottie/hang10.json',
  LoadingPizza = '/assets/lottie/loading-pizza.json',
}

/**
 * The loading design.
 */
export class LoadingDesign extends Component {
  @property backgroundColor = palette.blue;
  @property animation = Lottie.fromJson(LottieJsons.HangTen);
}
