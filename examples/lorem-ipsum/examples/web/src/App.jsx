import React from 'react';
import { Diez, DesignSystem } from 'diez-lorem-ipsum';
import styles from './App.module.css';

const Masthead = ({ backgroundColor, backgroundImage }) => (
  <div
    className={styles.masthead}
    style={{
      backgroundColor: backgroundColor,
      backgroundImage: `url(${backgroundImage.url})`,
      backgroundSize: `${backgroundImage.width}px ${backgroundImage.height}px`
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

const Title = ({ style, text }) => (
  <h2 style={style}>
    {text}
  </h2>
);

const Caption = ({ style, text }) => (
  <h3 style={style}>
    {text}
  </h3>
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
      />
    );
  }
}

export default class App extends React.PureComponent {
  diez = new Diez(DesignSystem);

  componentWillMount() {
    this.diez.attach((ds) => {
      this.setState({ ds });
    });
  }

  render() {
    const { ds } = this.state;

    return (
      <div className={styles.wrapper}>
        <Masthead
          backgroundColor={ds.colors.darkBackground.toString()}
          backgroundImage={ds.images.masthead}
        />
        <div
          className={styles.contentContainer}
          style={{
            backgroundColor: ds.colors.lightBackground.toString(),
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
                style={{
                  ...ds.typographs.heading1.css,
                  marginBottom: ds.layoutValues.spacingSmall
                }}
                text={ds.strings.title}
              />
              <Caption
                style={{
                  ...ds.typographs.caption.css,
                  marginBottom: ds.layoutValues.spacingSmall
                }}
                text={ds.strings.caption}
              />
              <div className={styles.animationContainer}>
                <Animation lottie={ds.loadingAnimation} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
