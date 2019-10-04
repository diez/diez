import {DayPartDesign, Size2D} from 'diez-poodle-surf';
import * as React from 'react';

interface ColumnProps {
  value: string;
  name: string;
  icon?: string;
  iconSize?: Size2D;
  ds: DayPartDesign;
  style?: React.CSSProperties;
}

/**
 * TODO
 */
export default class Column extends React.PureComponent<ColumnProps> {
  render () {
    const {name, value, icon, iconSize, ds, style} = this.props;

    return (
      <div style={style}>
        {icon && iconSize && <img src={icon} alt="" style={iconSize.style} />}
        <p style={{margin: 0, ...ds.valueTypograph.style}}>{value} <span style={ds.unitTypograph.style}>ft</span></p>
        <p style={ds.timeTypograph.style}>{name}</p>
      </div>
    );
  }
}
