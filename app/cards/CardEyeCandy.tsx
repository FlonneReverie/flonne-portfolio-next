import Image from "next/image";
import styles from "./CardEyeCandy.module.css";

import Card from '../card';


export default function CardEyeCandy() {
  return (
    <Card>
        <h3>Kinetic Animation (&quot;Eye Candy&quot;)</h3>
        <button className={`${styles.clearBtnStyle} ${styles.fillBtn}`} aria-label="Touch to play a button animation">Touch me!</button>
        <button className={`${styles.clearBtnStyle} ${styles.spinBtn}`} aria-label="Touch to play a button animation">Touch me!</button>
        <button className={`${styles.clearBtnStyle} ${styles.karatBtn}`} aria-label="Touch to play a button animation">Touch me!</button>
        <button className={`${styles.clearBtnStyle} ${styles.rainbowBtn}`} aria-label="Touch to play a button animation">Touch me!</button>
    </Card>
  );
}

