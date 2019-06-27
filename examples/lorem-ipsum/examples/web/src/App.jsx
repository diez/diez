import React from 'react';
import { Diez, DesignSystem } from 'diez-lorem-ipsum';
import styles from './App.module.css';

const Masthead = ({ ds }) => (
  <div
    className={styles.masthead}
    style={{
      backgroundColor: ds.colors.darkBackground.color,
      backgroundImage: ds.images.masthead.urlCss,
      backgroundSize: `${ds.images.masthead.width}px ${ds.images.masthead.height}px`
    }}
  />
);

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

const Title = ({ text, ds, style }) => (
  <h2 style={{
    ...ds.typographs.heading1.style,
    ...style,
  }}>
    {text}
  </h2>
);

const Caption = ({ text, ds, style }) => (
  <h3 style={{
    ...ds.typographs.caption.style,
    ...style,
  }}>
    {text}
  </h3>
);

const Body = ({ text, ds, style }) => (
  <p style={{
    ...ds.typographs.body.style,
    ...style,
  }}>
    {text}
  </p>
);

const MoreInfo = ({ ds, style }) => (
  <div style={{
    ...ds.typographs.body.style,
    ...style,
  }}>
    Refer to <a href="https://beta.diez.org/getting-started/" target="_blank">The Guides</a> for more information.
  </div>
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
        <Masthead ds={ds} />
        <div
          className={styles.contentContainer}
          style={{
            backgroundColor: ds.colors.lightBackground.color,
          }}
        >
          <div className={styles.content}>
            <Icon
              image={ds.images.logo}
              marginLeft={ds.layoutValues.contentMargin.left}
            />
            <div
              className={styles.innerContent}
              style={{
                paddingTop: ds.layoutValues.contentMargin.top,
                paddingRight: ds.layoutValues.contentMargin.right,
                paddingBottom: ds.layoutValues.contentMargin.bottom,
                paddingLeft: ds.layoutValues.contentMargin.left,
              }}
            >
              <Title
                text={ds.strings.title}
                ds={ds}
              />
              <Caption
                text={ds.strings.caption}
                ds={ds}
                style={{marginTop: ds.layoutValues.spacingSmall}}
              />
              <div className={styles.animationContainer}>
                <Animation
                  lottie={ds.loadingAnimation}
                />
                <Body
                  text={ds.strings.helper}
                  ds={ds}
                  style={{marginTop: ds.layoutValues.spacingMedium}}
                />
                <MoreInfo
                  ds={ds}
                  style={{marginTop: ds.layoutValues.spacingMedium}}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
