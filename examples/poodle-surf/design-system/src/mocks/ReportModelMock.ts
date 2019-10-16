import {File} from '@diez/prefabs';
import {prefab} from '@diez/engine';
import {DayPartTimes} from './constants';
import {PoodleSurfSlicesFiles} from '../designs/PoodleSurf.sketch';

const locationMock = {
  region: 'Santa Cruz, CA',
  place: 'Natural Bridges State Park',
  mapImage: PoodleSurfSlicesFiles.SantaCruzMap3x,
  bannerImage: PoodleSurfSlicesFiles.SantaCruzBanner3x,
}

const temperatureMock = {
  value: '55°F',
  gear: '4mm Wetsuit',
}

interface WindDayPartMockData {
  direction: File;
  value: string;
  dayPart: string;
}

class WindDayPartMock extends prefab<WindDayPartMockData>() {
  defaults = {
    direction: PoodleSurfSlicesFiles.DirectionNorthEast3x,
    value: '',
    dayPart: '',
  };
}

const windMock = {
  early: new WindDayPartMock({
    direction: PoodleSurfSlicesFiles.DirectionSouthWest3x,
    value: '4',
    dayPart: DayPartTimes.Early,
  }),
  middle: new WindDayPartMock({
    direction: PoodleSurfSlicesFiles.DirectionSouth3x,
    value: '12',
    dayPart: DayPartTimes.Middle,
  }),
  late: new WindDayPartMock({
    direction: PoodleSurfSlicesFiles.DirectionNorthEast3x,
    value: '17',
    dayPart: DayPartTimes.Late,
  }),
}

interface ForecastDayPartMockData {
  value: string;
  dayPart: string;
}

class ForecastDayPartMock extends prefab<ForecastDayPartMockData>() {
  defaults = {
    value: '',
    dayPart: '',
  };
}

interface ForecastMockData {
  early: ForecastDayPartMock;
  middle: ForecastDayPartMock;
  late: ForecastDayPartMock;
}

class ForecastMock extends prefab<ForecastMockData>() {
  defaults = {
    early: new ForecastDayPartMock(),
    middle: new ForecastDayPartMock(),
    late: new ForecastDayPartMock(),
  };
}

/**
 * A mock API report object.
 */
export const reportModelMock = {
  location: locationMock,
  temperature: temperatureMock,
  wind: windMock,
  swell: new ForecastMock({
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
  }),
  tide: new ForecastMock({
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
  }),
}
