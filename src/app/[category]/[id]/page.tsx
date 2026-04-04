'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { SwapiCategory } from '@/types';
import { fetchById } from '@/lib/swapi';
import DetailCard from '@/components/DetailCard/DetailCard';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import styles from './page.module.css';

const VALID_CATEGORIES: SwapiCategory[] = ['films', 'people', 'planets', 'species', 'starships', 'vehicles'];

const EXCLUDED_FIELDS = new Set(['created', 'edited', 'url']);

export default function DetailPage() {
	const params = useParams();
	const category = params.category as string;
	const id = params.id as string;

	const [data, setData] = useState<Record<string, unknown> | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!VALID_CATEGORIES.includes(category as SwapiCategory)) {
			setError(`"${category}" is not a valid category.`);
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);
		setData(null);

		fetchById<Record<string, unknown>>(category as SwapiCategory, id)
			.then(setData)
			.catch((err) => setError(err instanceof Error ? err.message : 'Failed to load.'))
			.finally(() => setLoading(false));
	}, [category, id]);

	const displayTitle = data ? String(data.title ?? data.name ?? `${category} #${id}`) : `${category.charAt(0).toUpperCase() + category.slice(1)} #${id}`;

	const fields = data ? Object.entries(data).filter(([key]) => !EXCLUDED_FIELDS.has(key)) : [];

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<div className={styles.topBar}>
					<Link href="/" className={styles.backBtn}>
						← Back to Explorer
					</Link>
					{!loading && !error && <span className={styles.categoryTag}>{category.charAt(0).toUpperCase() + category.slice(1)}</span>}
				</div>

				{loading && <LoadingSpinner label="Loading details…" />}
				{error && <ErrorMessage message={error} />}

				{data && !loading && (
					<>
						<h1 className={styles.title}>{displayTitle}</h1>
						<dl className={styles.grid}>
							{fields.map(([key, value]) => (
								<DetailCard key={key} fieldName={key} value={value} />
							))}
						</dl>
					</>
				)}
			</div>
		</div>
	);
}
