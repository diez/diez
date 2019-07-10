import React from 'react';
import { Diez, DesignSystem } from 'diez-lorem-ipsum';
import styles from './App.module.scss';

const Icon = ({ image, marginLeft }) => (
  <img
    src={image.url}
    width={image.width}
    height={image.height}
    alt="logo"
    className={styles.icon}
    style={{
      marginLeft: marginLeft,
    }}
  />
);

class Animation extends React.Component {
  componentDidMount() {
    this.props.lottie.mount(this.refs.animation);
  }

  render() {
    return (
      <div
        className={styles.animation}
        ref="animation"
        style={this.props.style}
      />
    );
  }
}

export default class App extends React.PureComponent {
  diez = new Diez(DesignSystem);

  componentWillMount() {
    // Here we are observing hot updates to our design system.
    //
    // Since this instance of Diez was initialized with DesignSystem, it will deliver updates to the DesignSystem
    // object described in `src/DesignSystem.ts` (relative to the root of the Diez project).
    this.diez.attach((ds) => {
      this.setState({ ds });
    });
  }

  render() {
    const { ds } = this.state;

    return (
      <div className={styles.wrapper}>
        <div className={styles.masthead} />
        <div className={styles.contentContainer}>
          <div className={styles.content}>
            <Icon
              image={ds.images.logo}
              marginLeft={ds.layoutValues.contentMargin.left}
            />
            <div className={styles.innerContent}>
              <h2 className={styles.title}>{ds.strings.title}</h2>
              <h3 className={styles.caption}>{ds.strings.caption}</h3>
              <div className={styles.animationContainer}>
                <Animation
                  lottie={ds.loadingAnimation}
                />
                <p className={styles.body}>{ds.strings.helper}</p>
                <div className={styles.footer}>
                    Refer to <a href="https://beta.diez.org/getting-started/" target="_blank">The Guides</a> for more information.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
