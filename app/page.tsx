import Image from "next/image";
import styles from "./page.module.css";
import CardAccessibility from "./cards/CardAccessibility";
import CardAnimation from "./cards/CardAnimation";
import CardEyeCandy from "./cards/CardEyeCandy";
import CardSnakeGame from "./cards/CardSnakeGame";
import Game from "./game";

export default function Home() {
  return (
    <div className={styles.page}>
      <div id="mainContent">
        <main className={styles.main}>
          <a href="https://github.com/FlonneReverie/flonne-portfolio-next" className={styles.githubSection} target="_blank">
            <Image
              src="/github-mark.svg"
              width="48" height="48"
              alt="GitHub Logo"
              title="View code on GitHub"
            /><br />
            View code on GitHub &gt;
          </a>
          <h1>Flonne Reverie</h1>
          <h2>Web Developer &bull; Full-Stack</h2>
          <Image
            className={styles.flagImg}
            src="/lgbt.webp"
            width="36" height="37"
            alt="LGBTQ+ Pride Flag"
            title="LGBTQ+ Community Member"
          />
          <Image
            className={styles.flagImg}
            src="/tg.webp"
            width="36" height="37"
            alt="Transgender Flag"
            title="Transgender"
          />
          <p>
            Hello! My name is Flonne Reverie. I&apos;m a computer programmer and Senior Web Developer with 8+ years of full-stack experience!
          </p>
          <p>
            <a className={styles.cvLink} href="/files/flonne-reverie-resume-2025-rev2.pdf" target="_blank">View Resumé / CV</a>
          </p>
          <p className={styles.currentStatus}>
              Currently seeking hybrid/remote roles from Porto, Portugal! 🇵🇹 (Already a legal resident!)
          </p>
          <p>
              Please allow me to demonstrate a little bit of what I can do:
          </p>
          <CardAnimation />
          <CardSnakeGame />
          <CardEyeCandy />
          <CardAccessibility />
        </main>
        <footer className={styles.footer}>
          Made using{" "}
          <Image
            src="/react.svg"
            width="24" height="24"
            alt="React Logo"
            title="React"
          /> React and <br />
          <Image
            className={styles.nextLogo}
            src="/next.svg"
            width="196" height="40"
            alt="Next.js Logo"
            title="Next.js"
          /><br />
          (The bunny gets the carrot if you hire me~)
        </footer>
      </div>
      <Game />
    </div>
  );
}
