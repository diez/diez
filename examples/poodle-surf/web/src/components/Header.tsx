import {NavigationTitleDesign} from 'poodle-surf-web-diez';
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
          color: ds.barTintColor.toString(),
          height: 51,
        }}
      >
        <img
          src={ds.icon.url}
          alt="logo"
          style={{marginRight: ds.iconToTitleSpacing, width: 29, height: 26}}
        />
        <span style={ds.textStyle.css}>{ds.title}</span>
      </header>
    );
  }
}
