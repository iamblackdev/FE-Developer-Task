'use client';

import { useRouter } from 'next/navigation';
import type { SwapiCategory } from '@/types';
import { extractPath } from '@/lib/swapi';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import styles from './DataTable.module.css';

type Column = { key: string; label: string };

const COLUMNS: Record<SwapiCategory, Column[]> = {
  films: [
    { key: 'title', label: 'Title' },
    { key: 'director', label: 'Director' },
    { key: 'producer', label: 'Producer' },
    { key: 'release_date', label: 'Release Date' },
  ],
  people: [
    { key: 'name', label: 'Name' },
    { key: 'gender', label: 'Gender' },
    { key: 'birth_year', label: 'Birth Year' },
    { key: 'homeworld', label: 'Home World' },
  ],
  planets: [
    { key: 'name', label: 'Name' },
    { key: 'climate', label: 'Climate' },
    { key: 'terrain', label: 'Terrain' },
    { key: 'population', label: 'Population' },
  ],
  species: [
    { key: 'name', label: 'Name' },
    { key: 'classification', label: 'Classification' },
    { key: 'language', label: 'Language' },
    { key: 'homeworld', label: 'Home World' },
  ],
  starships: [
    { key: 'name', label: 'Name' },
    { key: 'model', label: 'Model' },
    { key: 'manufacturer', label: 'Manufacturer' },
    { key: 'cost_in_credits', label: 'Cost in Credits' },
    { key: 'length', label: 'Length' },
    { key: 'crew', label: 'Crew' },
    { key: 'passengers', label: 'Passengers' },
    { key: 'cargo_capacity', label: 'Cargo Capacity' },
  ],
  vehicles: [
    { key: 'name', label: 'Name' },
    { key: 'model', label: 'Model' },
    { key: 'manufacturer', label: 'Manufacturer' },
    { key: 'cost_in_credits', label: 'Cost in Credits' },
    { key: 'length', label: 'Length' },
    { key: 'crew', label: 'Crew' },
    { key: 'passengers', label: 'Passengers' },
    { key: 'cargo_capacity', label: 'Cargo Capacity' },
  ],
};

interface Props {
  category: SwapiCategory;
  data: Record<string, unknown>[];
  totalItems: number;
  loading: boolean;
  error: string | null;
}

export default function DataTable({ category, data, totalItems, loading, error }: Props) {
  const router = useRouter();
  const columns = COLUMNS[category];

  const navigate = (item: Record<string, unknown>) => {
    router.push(extractPath(item.url as string));
  };

  const handleKeyDown = (e: React.KeyboardEvent, item: Record<string, unknown>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(item);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Fetching data from the galaxy…" />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (data.length === 0) {
    return (
      <div role="status" aria-live="polite" className={styles.empty}>
        {totalItems > 0
          ? 'No results match your search. Try a different term.'
          : 'No results found.'}
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} scope="col" className={styles.th}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr
                key={i}
                className={styles.row}
                tabIndex={0}
                onClick={() => navigate(item)}
                onKeyDown={(e) => handleKeyDown(e, item)}
                aria-label={`View details for ${String(item[columns[0].key] ?? '')}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={styles.td}>
                    {String(item[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={styles.count} aria-live="polite">
        Showing {data.length} of {totalItems} result{totalItems !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
