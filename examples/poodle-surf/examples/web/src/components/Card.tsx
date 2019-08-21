import {SharedCardDesign} from 'diez-poodle-surf';
import * as React from 'react';

interface CardProps {
  ds: SharedCardDesign;
}

/**
 * TODO
 */
export default class Card extends React.PureComponent<CardProps> {
  render () {
    const {ds} = this.props;

    return (
      <div
        className="card"
        style={{
          ...ds.panel.style,
          paddingTop: ds.layoutMargins.top,
          paddingLeft: ds.layoutMargins.left,
          paddingBottom: ds.layoutMargins.bottom,
          paddingRight: ds.layoutMargins.right,
          marginBottom: ds.layoutMargins.bottom,
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'column',
          width: '42%',
        }}
      >
        <h3 style={{marginBottom: 20, ...ds.titleTypograph.style}}>{ds.title}</h3>
        {this.props.children}
      </div>
    );
  }
}
