import {TemperatureMock, WaterTemperatureCardDesign} from 'diez-poodle-surf';
import * as React from 'react';
import Card from './Card';

interface WaterTemperatureCardProps {
  ds: WaterTemperatureCardDesign;
  mocks: TemperatureMock;
}

/**
 * TODO
 */
export default class WaterTemperatureCard extends React.PureComponent<WaterTemperatureCardProps> {
  render () {
    const {ds, mocks} = this.props;

    return (
      <Card ds={ds.shared}>
        <div style={{display: 'flex', alignContent: 'center', justifyContent: 'space-between'}}>
          <div>
            <img
              width="44px"
              height="44px"
              src={ds.temperature.icon.url}
              alt=""
              style={{marginRight: ds.temperature.iconSpacing, float: 'left'}}
            />
            <span style={ds.temperature.typograph.css}>
              {mocks.value}
            </span>
          </div>
          <div style={{width: 140}}>
            <img
              width="43px"
              height="27px"
              src={ds.wetsuit.icon.url}
              alt=""
              style={{marginRight: ds.temperature.iconSpacing, float: 'left'}}
            />
            <div>
              <h5 style={ds.wetsuit.headerTypograph.css}>
                {ds.wetsuit.headerText}
              </h5>
              <p style={ds.wetsuit.valueTypograph.css}>
                {mocks.gear}
              </p>
            </div>
          </div>
        </div>
      </Card>
    );
  }
}
