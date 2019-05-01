import {ForecastCardDesign, ForecastMock, WindDayPartMock} from 'poodle-surf-web-diez';
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
            columns: 3,
            columnGap: ds.dayPartsHorizontalSpacing,
            columnRule: `${ds.separatorWidth}px solid ${ds.separatorColor}`,
            display: 'inline-block',
          }}
        >
          {Object.values(mocks).map((dayPart: WindDayPartMock) => (
            <Column
              // style={{marginRight: ds.dayPartsHorizontalSpacing}}
              key={dayPart.dayPart}
              ds={ds.dayPart}
              icon={dayPart.direction && dayPart.direction.url}
              name={dayPart.dayPart}
              value={dayPart.value}
            />
          ))}
        </div>
      </Card>
    );
  }
}
