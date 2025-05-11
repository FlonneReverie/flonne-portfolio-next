"use client";

import Image from "next/image";
import styles from "./page.module.css";

import { useTheme } from "./context/ThemeContext";
import ThemeToggleButton from "./ThemeToggleButton";

import CardAccessibility from "./cards/CardAccessibility";
import CardAnimation from "./cards/CardAnimation";
import CardBackend from "./cards/CardBackend";
import CardEyeCandy from "./cards/CardEyeCandy";
import CardSnakeGame from "./cards/CardSnakeGame";
import Game from "./game";

export default function Home() {

  const {isDarkTheme, isHired} = useTheme();

  return (
    <div className={`${styles.page} ${isDarkTheme ? styles.darkMode : ''}`}>
      <ThemeToggleButton />
      <div id="mainContent">
        <main className={styles.main}>
          <a href="https://github.com/FlonneReverie/flonne-portfolio-next" className={styles.githubSection} target="_blank" aria-label="View this portfolio's code on GitHub in a new tab">
            <Image
              src="/github-mark.svg"
              width="48" height="48"
              alt="GitHub Logo"
              title="View code on GitHub"
              className={styles.githubLogo}
            />
            <div>View code on GitHub &gt;</div>
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
            Hello! My name is Flonne Reverie. I&apos;m a computer programmer and full-stack web developer with 8+ years of experience!
          </p>
          <p>
            <a className={styles.cvLink} href="/files/flonne-reverie-cv-2025-rev4.pdf" target="_blank" aria-label="View my CV in a new tab">Check out my CV!</a>
          </p>
          <p className={styles.currentStatus}>
              Currently seeking hybrid/remote roles from Porto, Portugal! 🇵🇹 (Already a legal resident!)
          </p>
          <p className={styles.outro}>
              Please allow me to demonstrate a little bit of what I can do:
          </p>
          <CardAnimation />
          <CardSnakeGame />
          <CardBackend />
          <CardEyeCandy  />
          <CardAccessibility />
        </main>
        <footer className={styles.footer}>
          Made using{" "}
          <a href="https://react.dev/" rel="nofollow noreferrer" target="_blank" aria-label="Visit React website in a new tab">
            <Image
              src="/react.svg"
              width="24" height="24"
              alt="React Logo"
              title="React"
            /> React
          </a> and <br />
          <a href="https://nextjs.org/" rel="nofollow noreferrer" target="_blank" aria-label="Visit Next.js website in a new tab">
            <Image
              className={styles.nextLogo}
              src={isDarkTheme ? "/next-darkmode.svg" : "/next.svg"}
              width="196" height="40"
              alt="Next.js Logo"
              title="Next.js"
            />
          </a>
          {isHired
            ? <p>(I've been hired! The bunny got the carrot.)</p>
            : <p>(The bunny gets the carrot if you hire me~)</p>
          }
        </footer>
      </div>
      <Game />
    </div>
  );
}
