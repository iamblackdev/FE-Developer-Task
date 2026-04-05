'use client';

import styles from './Pagination.module.css';

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  return (
    <nav className={styles.nav} aria-label="Pagination">
      <button
        className={styles.btn}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Go to previous page"
        type="button"
      >
        ← Prev
      </button>

      <span className={styles.indicator} aria-current="page" aria-live="polite">
        Page {page} of {totalPages}
      </span>

      <button
        className={styles.btn}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Go to next page"
        type="button"
      >
        Next →
      </button>
    </nav>
  );
}
