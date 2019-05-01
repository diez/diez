import {HeaderDesign, LocationMock} from 'poodle-surf-web-diez';
import * as React from 'react';
import {generateGradient} from '../helpers';

interface HeroProps {
  ds: HeaderDesign;
  mocks: LocationMock;
  style?: React.CSSProperties;
  backgroundImage?: string;
}

/**
 * TODO
 */
export default class Hero extends React.PureComponent<HeroProps> {
  render () {
    const {ds, mocks, style} = this.props;

    return (
      <div style={style}>
        <div
          style={{
            backgroundImage: `url(${mocks.bannerImage.url})`,
            backgroundSize: 'cover',
            height: ds.bannerHeight,
          }}
        />
        <div style={{textAlign: 'center', marginTop:  - ds.locationImage.widthAndHeight / 2}}>
          <div
            style={{
              backgroundImage: generateGradient(ds.locationImage.strokeGradient),
              width: ds.locationImage.widthAndHeight,
              height: ds.locationImage.widthAndHeight,
              padding: ds.locationImage.strokeWidth,
              borderRadius: '50%',
              overflow: 'hidden',
              display: 'inline-block',
            }}
          >
            <img src={mocks.mapImage.url} alt="" style={{width: '100%', borderRadius: '50%'}} />
          </div>
          <h3 style={ds.regionLabel.css}>{mocks.region}</h3>
          <div>
            <img
              src={ds.mapPinIcon.url}
              alt=""
              style={{verticalAlign: 'middle', marginRight: ds.pinIconToLabelSpacing, width: 9, height: 14}}
            />
            <span style={ds.placeLabel.css}>{mocks.place}</span>
          </div>
        </div>
      </div>
    );
  }
}
