import Image from "next/image";
import styles from "./CardAccessibility.module.css";

import Card from '../card';
import { useTheme } from "../context/ThemeContext";


export default function CardAccessibility() {

  const {isDarkTheme} = useTheme();

  return (
    <Card>
        <h3>Accessibility / ARIA</h3>
        <Image
            className={`${styles.cardImageRight} ${isDarkTheme ? styles.imageDarkMode : ''}`}
            src="/aria.webp"
            width="100"
            height="100"
            alt="W3C ARIA Logo"
        />
        <p>Try browsing this page using a screen reader! :)</p>
    </Card>
  );
}

