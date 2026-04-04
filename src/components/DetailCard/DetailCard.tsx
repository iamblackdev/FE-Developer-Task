import Link from 'next/link';
import { extractPath, isSwapiUrl } from '@/lib/swapi';
import styles from './DetailCard.module.css';

function formatLabel(key: string): string {
  return key
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function renderValue(value: unknown): React.ReactNode {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className={styles.muted}>None</span>;
    }
    return (
      <ul className={styles.list}>
        {value.map((item, i) =>
          isSwapiUrl(item) ? (
            <li key={i}>
              <Link href={extractPath(item)} className={styles.link}>
                {extractPath(item)}
              </Link>
            </li>
          ) : (
            <li key={i} className={styles.listItem}>
              {String(item)}
            </li>
          )
        )}
      </ul>
    );
  }

  if (isSwapiUrl(value)) {
    return (
      <Link href={extractPath(value)} className={styles.link}>
        {extractPath(value)}
      </Link>
    );
  }

  if (value === null || value === undefined || value === '') {
    return <span className={styles.muted}>N/A</span>;
  }

  const str = String(value);
  if (str.length > 180) {
    return <p className={styles.longText}>{str}</p>;
  }

  return <span>{str}</span>;
}

interface Props {
  fieldName: string;
  value: unknown;
}

export default function DetailCard({ fieldName, value }: Props) {
  return (
    <div className={styles.card}>
      <dt className={styles.label}>{formatLabel(fieldName)}</dt>
      <dd className={styles.value}>{renderValue(value)}</dd>
    </div>
  );
}
