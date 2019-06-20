import {NavigationTitleDesign} from 'diez-poodle-surf';
import * as React from 'react';

interface HeaderProps {
  ds: NavigationTitleDesign;
}

/**
 * Main header
 */
export default class Header extends React.PureComponent<HeaderProps> {
  render () {
    const {ds} = this.props;

    return (
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: ds.barTintColor.color,
          height: 51,
        }}
      >
        <img
          src={ds.icon.url}
          alt="logo"
          style={{marginRight: ds.iconToTitleSpacing, width: 29, height: 26}}
        />
        <span style={ds.typograph.style}>{ds.title}</span>
      </header>
    );
  }
}
