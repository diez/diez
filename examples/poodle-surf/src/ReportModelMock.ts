import {Image} from '@livedesigner/designsystem';
import {Component, property} from '@livedesigner/engine';

class DayPartTimes extends Component {
  @property early = '6am';
  @property middle = 'Noon';
  @property late = '6pm';
}

/**
 * @internal
 */
const dayPartTimes = new DayPartTimes();

class LocationMock extends Component {
  @property region = 'Santa Cruz, CA';
  @property place = 'Natural Bridges State Park';
  @property mapImage = Image.scaled('/assets/images/Santa Cruz Map@3x.png', 3);
  @property bannerImage = Image.scaled('/assets/images/Santa Cruz Banner@3x.png', 3);
}

class TemperatureMock extends Component {
  @property value = '55°F';
  @property gear = '4mm Wetsuit';
}

interface WindDayPartMockState {
  direction: Image;
  value: string;
  dayPart: string;
}

class WindDayPartMock extends Component<WindDayPartMockState> {
  @property direction = Image.scaled('/assets/images/Direction - North@3x.png', 3);
  @property value = '';
  @property dayPart = '';
}

class WindMock extends Component {
  @property early = new WindDayPartMock({
    direction: Image.scaled('/assets/images/Direction - South West@3x.png', 3),
    value: '4',
    dayPart: dayPartTimes.early,
  });
  @property middle = new WindDayPartMock({
    direction: Image.scaled('/assets/images/Direction - South@3x.png', 3),
    value: '12',
    dayPart: dayPartTimes.middle,
  });
  @property late = new WindDayPartMock({
    direction: Image.scaled('/assets/images/Direction - North East@3x.png', 3),
    value: '17',
    dayPart: dayPartTimes.late,
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
      dayPart: dayPartTimes.early,
    }),
    middle: new ForecastDayPartMock({
      value: '6',
      dayPart: dayPartTimes.middle,
    }),
    late: new ForecastDayPartMock({
      value: '6.5',
      dayPart: dayPartTimes.late,
    }),
  });
  @property tide = new ForecastMock({
    early: new ForecastDayPartMock({
      value: '5',
      dayPart: dayPartTimes.early,
    }),
    middle: new ForecastDayPartMock({
      value: '0.5',
      dayPart: dayPartTimes.middle,
    }),
    late: new ForecastDayPartMock({
      value: '4',
      dayPart: dayPartTimes.late,
    }),
  });
}
