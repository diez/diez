import React, { useCallback, useState, useEffect } from 'react';
import { Diez, DesignSystem } from 'diez-lorem-ipsum';
import styles from './App.module.scss';

const Animation = (props) => {
  const animation = useCallback((node) => {
    if (node !== null) {
      props.lottie.mount(node);
    }
  }, []);

  return (
    <div
      className={styles.animation}
      ref={animation}
      style={props.style}
    />
  );
}

const App = () => {
  const [ds, setDs] = useState();
  const diez = new Diez(DesignSystem);

  useEffect(() => {
    // Here we are observing hot updates to our design system.
    //
    // Since this instance of Diez was initialized with DesignSystem, it will deliver updates to the DesignSystem
    // object described in `src/DesignSystem.ts` (relative to the root of the Diez project).
    diez.attach(setDs);
  }, []);

  if (typeof ds === 'undefined') {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.mastheadContainer}>
        <div className={styles.masthead} />
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.content}>
          <div className={styles.icon}></div>
          <div className={styles.innerContent}>
            <h2 className={styles.title}>{ds.strings.title}</h2>
            <h3 className={styles.caption}>{ds.strings.caption}</h3>
            <div className={styles.animationContainer}>
              <Animation lottie={ds.loadingAnimation} />
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

export default App;
