import {DayPartDesign} from 'diez-poodle-surf';
import * as React from 'react';

interface ColumnProps {
  value: string;
  name: string;
  icon?: string;
  ds: DayPartDesign;
  style?: React.CSSProperties;
}

/**
 * TODO
 */
export default class Column extends React.PureComponent<ColumnProps> {
  render () {
    const {name, value, icon, ds, style} = this.props;

    return (
      <div style={{textAlign: 'center', ...style}}>
        {icon && <img src={icon} alt="" style={{width: '67px', height: '67px'}} />}
        <p style={{margin: 0, ...ds.valueTypograph.style}}>{value} <span style={ds.unitTypograph.style}>ft</span></p>
        <span style={ds.timeTypograph.style}>{name}</span>
      </div>
    );
  }
}
