import Image from "next/image";
import styles from "./CardSnakeGame.module.css";

import Card from '../card';


export default function CardSnakeGame({
  isDarkTheme
  }: {
    isDarkTheme: boolean;
  }) {
  return (
    <Card>
        <h3>Advanced Javascript and Interactivity</h3>
        <Image
            className={`${styles.cardImageLeft} ${isDarkTheme ? styles.imageDarkMode : ''}`}
            src="/js.svg"
            width="100"
            height="100"
            alt="Javascript Logo"
        />
        <p>
            <button className={styles.gameStartBtn} id="gameStartBtn">Click here</button> to play a game I wrote in vanilla Javascript based on &quot;Snake&quot;!
        </p>
    </Card>
  );
}

