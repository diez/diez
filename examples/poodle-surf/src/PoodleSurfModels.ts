import {File, Image} from '@livedesigner/designsystem';
import {Component, property} from '@livedesigner/engine';

class Strings extends Component {
  @property recommendedLabel = 'Recommended';
}

class Images extends Component {
  @property someIcon = new Image({
    file: new File({
      src: '/assets/images/some-icon.png',
    }),
    scale: 3,
  });
}

/**
 * Provides model data for the Poodle Surf app.
 */
export class PoodleSurfModels extends Component {
  @property strings = new Strings();
  @property images = new Images();
}
