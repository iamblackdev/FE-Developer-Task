import { isSwapiUrl } from '@/lib/swapi';
import styles from './DetailCard.module.css';
import { formatDate, formatFieldName, isSwapiUrlArray } from '@/lib/helper';
import { useMemo } from 'react';
import UrlChip from '../UrlChip/UrlChip';

interface Props {
	fieldKey: string;
	value: unknown;
}

export default function DetailCard({ fieldKey, value }: Props) {
	const renderValue = useMemo(() => {
		if (fieldKey === 'created' || fieldKey === 'edited') {
			return <span className={styles.value}>{formatDate(String(value))}</span>;
		}

		// Opening crawl — monospace block
		if (fieldKey === 'opening_crawl') {
			return <pre className={styles.crawl}>{String(value)}</pre>;
		}

		// Array of SWAPI URLs
		if (isSwapiUrlArray(value)) {
			return (
				<div className={styles.chips}>
					{(value as string[]).map((url) => (
						<UrlChip key={url} url={url} />
					))}
				</div>
			);
		}

		// Single SWAPI URL (e.g. homeworld)
		if (isSwapiUrl(value)) {
			return (
				<div className={styles.chips}>
					<UrlChip url={value as string} />
				</div>
			);
		}

		// Plain value
		return <span className={styles.value}>{value === null || value === undefined || value === '' ? '—' : String(value)}</span>;
	}, [value]);

	return (
		<div className={styles.card}>
			<dt className={styles.label}>{formatFieldName(fieldKey)}</dt>
			<dd className={styles.value}>{renderValue}</dd>
		</div>
	);
}
