import {DesignSystem, Diez, ModelMocks} from 'diez-poodle-surf';
import * as React from 'react';
import ForecastCard from './components/ForecastCard';
import Header from './components/Header';
import Hero from './components/Hero';
import WaterTemperatureCard from './components/WaterTemperatureCard';
import {generateGradient} from './helpers';

class App extends React.PureComponent<{}, {ds: DesignSystem, mocks: ModelMocks}> {
  private diezDs = new Diez<DesignSystem>(DesignSystem);
  private diezMocks = new Diez<ModelMocks>(ModelMocks);

  componentWillMount () {
    this.diezDs.attach((ds) => {
      this.setState({ds});
    });

    this.diezMocks.attach((mocks) => {
      this.setState({mocks});
    });
  }

  render () {
    const {mocks, ds} = this.state;

    return (
      <div>
        <Header ds={ds.designs.navigationTitle} />
        <Hero
          style={{marginBottom: ds.designs.report.contentLayoutMargins.bottom}}
          mocks={mocks.report.location}
          ds={ds.designs.report.header}
          backgroundImage={generateGradient(ds.palette.gradient)}
        />
        <div
          style={{
            columns: '320px 2',
            columnGap: ds.designs.report.contentSpacing,
            maxWidth: 680,
            margin: '0 auto',
            paddingLeft: ds.designs.report.contentLayoutMargins.left,
            paddingRight: ds.designs.report.contentLayoutMargins.right,
          }}
        >
          <WaterTemperatureCard ds={ds.designs.report.waterTemperature} mocks={mocks.report.temperature} />
          <ForecastCard ds={ds.designs.report.wind} mocks={mocks.report.wind} />
          <ForecastCard ds={ds.designs.report.swell} mocks={mocks.report.swell} />
          <ForecastCard ds={ds.designs.report.tide} mocks={mocks.report.tide} />
        </div>
      </div>
    );
  }
}

export default App;
