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
        style={{
          backgroundImage: ds.gradient.linearGradient,
          paddingTop: ds.layoutMargins.top,
          paddingLeft: ds.layoutMargins.left,
          paddingBottom: ds.layoutMargins.bottom,
          paddingRight: ds.layoutMargins.right,
          borderRadius: ds.cornerRadius,
          marginBottom: ds.layoutMargins.bottom,
          breakInside: 'avoid',
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'column',
        }}
      >
        <h3 style={{marginBottom: 20, ...ds.titleTypograph.style}}>{ds.title}</h3>
        {this.props.children}
      </div>
    );
  }
}
