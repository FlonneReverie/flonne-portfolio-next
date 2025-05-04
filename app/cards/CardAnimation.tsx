import Image from "next/image";
import styles from "./CardAnimation.module.css";

import Card from '../card';


export default function CardAnimation({
  isDarkTheme
  }: {
    isDarkTheme: boolean;
  }) {
  return (
    <Card className={`${styles.demoAnimation} ${isDarkTheme ? styles.demoDarkMode : ''}`}>
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
    </Card>
  );
}
