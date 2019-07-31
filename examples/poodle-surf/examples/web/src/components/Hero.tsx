import {HeaderDesign, LocationMock} from 'diez-poodle-surf';
import * as React from 'react';

interface HeroProps {
  ds: HeaderDesign;
  mocks: LocationMock;
  style?: React.CSSProperties;
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
            backgroundImage: `url("${mocks.bannerImage.url}")`,
            backgroundSize: 'cover',
            height: ds.bannerHeight,
          }}
        />
        <div style={{textAlign: 'center', marginTop:  - ds.locationImage.widthAndHeight / 2}}>
          <div
            style={{
              backgroundImage: ds.locationImage.strokeGradient.linearGradient,
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
          <h3 style={ds.regionLabel.style}>{mocks.region}</h3>
          <div>
            <img
              src={ds.mapPinIcon.url}
              alt=""
              style={{verticalAlign: 'middle', marginRight: ds.pinIconToLabelSpacing, width: 9, height: 14}}
            />
            <span style={ds.placeLabel.style}>{mocks.place}</span>
          </div>
        </div>
      </div>
    );
  }
}
