import styles from "./card.module.css";

export default function Card({
    className,
    children,
  }: {
    className?: string; 
    children: React.ReactNode
  }) {
  return (
    <div className={`${styles.card} ${className ? className : ''}`}>
        {children}
    </div>
  );
}
