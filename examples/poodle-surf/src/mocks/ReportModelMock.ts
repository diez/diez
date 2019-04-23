import {File} from '@diez/designsystem';
import {Component, property} from '@diez/engine';
import {Images} from './assets';
import {DayPartTimes} from './constants';

class LocationMock extends Component {
  @property region = 'Santa Cruz, CA';
  @property place = 'Natural Bridges State Park';
  @property mapImage = Images.SantaCruzMap;
  @property bannerImage = Images.SantaCruzBanner;
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
  @property direction = Images.WindNorth;
  @property value = '';
  @property dayPart = '';
}

class WindMock extends Component {
  @property early = new WindDayPartMock({
    direction: Images.WindSouthWest,
    value: '4',
    dayPart: DayPartTimes.early,
  });
  @property middle = new WindDayPartMock({
    direction: Images.WindSouth,
    value: '12',
    dayPart: DayPartTimes.middle,
  });
  @property late = new WindDayPartMock({
    direction: Images.WindNorthEast,
    value: '17',
    dayPart: DayPartTimes.late,
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
      dayPart: DayPartTimes.early,
    }),
    middle: new ForecastDayPartMock({
      value: '6',
      dayPart: DayPartTimes.middle,
    }),
    late: new ForecastDayPartMock({
      value: '6.5',
      dayPart: DayPartTimes.late,
    }),
  });
  @property tide = new ForecastMock({
    early: new ForecastDayPartMock({
      value: '5',
      dayPart: DayPartTimes.early,
    }),
    middle: new ForecastDayPartMock({
      value: '0.5',
      dayPart: DayPartTimes.middle,
    }),
    late: new ForecastDayPartMock({
      value: '4',
      dayPart: DayPartTimes.late,
    }),
  });
}
