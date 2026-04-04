import styles from './ErrorMessage.module.css';

interface Props {
  message: string;
}

export default function ErrorMessage({ message }: Props) {
  return (
    <div role="alert" className={styles.error}>
      <span className={styles.icon} aria-hidden="true">⚠</span>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
