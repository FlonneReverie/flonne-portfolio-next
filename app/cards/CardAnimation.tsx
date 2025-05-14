import { useState } from "react";

import Image from "next/image";
import styles from "./CardAnimation.module.css";

import Card from '../card';
import { useTheme } from "../context/ThemeContext";


export default function CardAnimation() {

  const {isDarkTheme, isReducedMotion, isHired} = useTheme();

  const [manuallyAllowMotion, setManuallyAllowMotion] = useState(false);

  const reducedMotionMode = isReducedMotion && !manuallyAllowMotion;

  return (
    <Card className={`${styles.demoAnimation} ${isDarkTheme ? styles.demoDarkMode : ''} ${reducedMotionMode ? styles.reducedMotion : ''} ${isHired ? styles.hired : ''}`}>
        <h3>
            <span className={styles.demoAnimationText1}>CSS</span>
            {" "}
            <Image
            className={styles.demoAnimationCarrot}
            src="/cayroot.webp"
            width="10"
            height="27"
            alt=""
            aria-hidden="true"
            />
            {" "}
            <span className={styles.demoAnimationText2}>Animations</span>
            <div className={styles.demoAnimationBunny}></div>
        </h3>
        {reducedMotionMode
          ? <p>
              Your browser requested reduced motion, so the bunny is relaxing for now.
              {" "}
              <a
                href="#"
                title="Click to play animation demo"
                aria-label="Click to play animation demo"
                onClick={(evt) => {
                  setManuallyAllowMotion(true);
                  evt.preventDefault();
                  return false;
                }}
              >Click to play!</a>
            </p>
          : null
        }
    </Card>
  );
}
