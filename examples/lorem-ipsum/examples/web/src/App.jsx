import React from 'react';
import {DesignSystem} from 'diez-lorem-ipsum';
import styles from './App.module.css';

const Masthead = ({backgroundColor, backgroundImage}) => (
  <div 
    className={styles.masthead}
    style={{
      backgroundColor: backgroundColor,
      backgroundImage: backgroundImage,
    }} 
  />
);

const Icon = ({src, icon, marginLeft}) => (
  <img
    src={src}
    alt="logo"
    className={styles.icon}
    style={{
      marginLeft: marginLeft,
    }}
  />
);

const Title = ({style, text}) => (
  <h2 style={style}>
    {text}
  </h2>
);

const Caption = ({style, text}) => (
  <h3 style={style}>
    {text}
  </h3>
);

class Animation extends React.Component {
  componentDidMount () {
    this.props.lottie.mount(this.refs.animation);
  }
  
  render () {
    return (
      <div 
        className={styles.animation} 
        ref="animation"
      />
    );
  }
}

export default class App extends React.PureComponent {
  static defaultProps = {ds: new DesignSystem()};

  render () {
    const {ds} = this.props;

    return (
      <div className={styles.wrapper}>
        <Masthead 
          backgroundColor={ds.colors.darkBackground.toString()}
          backgroundImage={`url(${ds.images.masthead.url})`}
        />
        <div 
          className={styles.contentContainer}
          style={{
            backgroundColor: ds.colors.lightBackground.toString(),
          }}
        >
          <div className={styles.content}>
            <Icon
              src={ds.images.logo.url}
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
                <Animation lottie={ds.loadingAnimation}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
