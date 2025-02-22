import Image from "next/image";
import Script from "next/script";
import styles from "./game.module.css";

export default function Game() {
  return (
    <div className={styles.gameSection} id="gameSection">
        <Image className={styles.gameDpad} alt="D-pad" id="gameDpad" src="/gameassets/dpad.png" />
        <div className={styles.gameContainer} id="gameContainer">
          <button className={styles.gameExitBtn} id="gameExitBtn">Back to Portfolio</button>
          <div id="javascriptWarning"></div>
          <div className={styles.gameTitlePage} id="gameTitlePage">
            <div className={styles.gameTitleMargin} id="gameTitleMargin">
              <div className={styles.gameTitleLine} id="gameTitleLine"><strong>Ice Snake</strong></div>
              <p>
                Use the arrow keys (desktop) or touch the d-pad (mobile) to direct the ice snake into the ice cubes.
              </p>
              <p>
                If you hit your tail, or one of the <span className={styles.red}>red</span> ice cubes, you lose!
              </p>
              <p>
                You can safely travel through the sides of the screen -- you'll end up on the other side!
              </p>
              <p>
                <strong>Ice Cubes</strong>
              </p>
              <Image src="/gameassets/blockblue.png" alt="Blue ice block" className={styles.twoEmSized} /> 5 Points&nbsp;&nbsp;&nbsp;<Image src="/gameassets/blockyellow.png" alt="Yellow ice block" className={styles.twoEmSized} /> 10 Points
              <br />
              <Image src="/gameassets/blockpurple.png" alt="Purple ice block" className={styles.twoEmSized} /> 15 Points&nbsp;&nbsp;&nbsp;<Image src="/gameassets/blockrainbow.png" alt="Rainbow ice block" className={styles.twoEmSized} /> 20 Points!
              <p>
                <strong>Press any direction to begin!</strong>
              </p>
            </div>
          </div>
          <div className={styles.gameScoreBox} id="gameScoreBox">Score: 0</div>
        </div>
      <Script src="/game.js"></Script>
    </div>
  );
}
