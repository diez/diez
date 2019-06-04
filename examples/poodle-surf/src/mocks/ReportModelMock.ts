import {File} from '@diez/prefabs';
import {Component, property} from '@diez/engine';
import {DayPartTimes} from './constants';
import {PoodleSurfSlicesFiles} from '../designs/PoodleSurf.sketch';

class LocationMock extends Component {
  @property region = 'Santa Cruz, CA';
  @property place = 'Natural Bridges State Park';
  @property mapImage = PoodleSurfSlicesFiles.SantaCruzMap3x;
  @property bannerImage = PoodleSurfSlicesFiles.SantaCruzBanner3x;
}

class TemperatureMock extends Component {
  @property value = '55°F';
  @property gear = '4mm Wetsuit';
}

interface WindDayPartMockState {
  direction: File;
  value: string;
  dayPart: string;
}

class WindDayPartMock extends Component<WindDayPartMockState> {
  @property direction = PoodleSurfSlicesFiles.DirectionNorthEast3x;
  @property value = '';
  @property dayPart = '';
}

class WindMock extends Component {
  @property early = new WindDayPartMock({
    direction: PoodleSurfSlicesFiles.DirectionSouthWest3x,
    value: '4',
    dayPart: DayPartTimes.Early,
  });
  @property middle = new WindDayPartMock({
    direction: PoodleSurfSlicesFiles.DirectionSouth3x,
    value: '12',
    dayPart: DayPartTimes.Middle,
  });
  @property late = new WindDayPartMock({
    direction: PoodleSurfSlicesFiles.DirectionNorthEast3x,
    value: '17',
    dayPart: DayPartTimes.Late,
  });
}

interface ForecastDayPartMockState {
  value: string;
  dayPart: string;
}

class ForecastDayPartMock extends Component<ForecastDayPartMockState> {
  @property value = '';
  @property dayPart = '';
}

interface ForecastMockState {
  early: ForecastDayPartMock;
  middle: ForecastDayPartMock;
  late: ForecastDayPartMock;
}

class ForecastMock extends Component<ForecastMockState> {
  @property early = new ForecastDayPartMock();
  @property middle = new ForecastDayPartMock();
  @property late = new ForecastDayPartMock();
}

/**
 * A mock API report object.
 */
export class ReportModelMock extends Component {
  @property location = new LocationMock();
  @property temperature = new TemperatureMock();
  @property wind = new WindMock();
  @property swell = new ForecastMock({
    early: new ForecastDayPartMock({
      value: '6.3',
      dayPart: DayPartTimes.Early,
    }),
    middle: new ForecastDayPartMock({
      value: '6',
      dayPart: DayPartTimes.Middle,
    }),
    late: new ForecastDayPartMock({
      value: '6.5',
      dayPart: DayPartTimes.Late,
    }),
  });
  @property tide = new ForecastMock({
    early: new ForecastDayPartMock({
      value: '5',
      dayPart: DayPartTimes.Early,
    }),
    middle: new ForecastDayPartMock({
      value: '0.5',
      dayPart: DayPartTimes.Middle,
    }),
    late: new ForecastDayPartMock({
      value: '4',
      dayPart: DayPartTimes.Late,
    }),
  });
}
