import {ForecastCardDesign, ForecastMock, WindDayPartMock} from 'diez-poodle-surf';
import * as React from 'react';
import Card from './Card';
import Column from './Column';

interface ForecastCardProps {
  ds: ForecastCardDesign;
  mocks: ForecastMock;
}

/**
 * TODO
 */
export default class ForecastCard extends React.PureComponent<ForecastCardProps> {
  render () {
    const {ds, mocks} = this.props;

    return (
      <Card ds={ds.shared}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          {Object.values(mocks).map((dayPart: WindDayPartMock) => (
            <Column
              key={dayPart.dayPart}
              ds={ds.dayPart}
              icon={dayPart.direction && dayPart.direction.url}
              iconSize={ds.dayPart.iconSize}
              name={dayPart.dayPart}
              value={dayPart.value}
            />
          ))}
        </div>
      </Card>
    );
  }
}
