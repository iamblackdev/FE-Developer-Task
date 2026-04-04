import styles from './LoadingSpinner.module.css';

interface Props {
  label?: string;
}

export default function LoadingSpinner({ label = 'Loading…' }: Props) {
  return (
    <div role="status" aria-live="polite" className={styles.wrapper}>
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </div>
  );
}
