import styles from "./card.module.css";
import { useTheme } from "./context/ThemeContext";

export default function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { isReducedMotion } = useTheme();

  return (
    <div
      className={`${styles.card} ${isReducedMotion ? styles.reducedMotion : ""} ${className ? className : ""}`}
    >
      {children}
    </div>
  );
}
