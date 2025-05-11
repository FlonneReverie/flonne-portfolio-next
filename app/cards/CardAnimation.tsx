import Image from "next/image";
import styles from "./CardAnimation.module.css";

import Card from '../card';
import { useTheme } from "../context/ThemeContext";


export default function CardAnimation() {

  const {isDarkTheme, isReducedMotion, isHired} = useTheme();

  return (
    <Card className={`${styles.demoAnimation} ${isDarkTheme ? styles.demoDarkMode : ''} ${isReducedMotion ? styles.reducedMotion : ''} ${isHired ? styles.hired : ''}`}>
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
        {isReducedMotion
          ? <p>Your browser requested reduced motion, so the bunny will relax for now.</p>
          : null
        }
    </Card>
  );
}
