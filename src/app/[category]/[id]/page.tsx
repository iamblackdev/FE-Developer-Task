'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { SwapiCategory } from '@/types';
import { fetchById } from '@/lib/swapi';
import DetailCard from '@/components/DetailCard/DetailCard';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import styles from './page.module.css';

const VALID_CATEGORIES: SwapiCategory[] = ['films', 'people', 'planets', 'species', 'starships', 'vehicles'];

const EXCLUDED_FIELDS = new Set(['url']);

export default function DetailPage() {
	const params = useParams();
	const category = params.category as string;
	const id = params.id as string;

	const [data, setData] = useState<Record<string, unknown> | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		if (!VALID_CATEGORIES.includes(category as SwapiCategory)) {
			setLoading(false);
			setError('Invalid Category');
			return;
		}
		try {
			const data = await fetchById<Record<string, unknown>>(category as SwapiCategory, id);
			setData(data);
		} catch {
			setData(null);
			setError('Failed to load.');
		} finally {
			setLoading(false);
		}
	}, [category, id]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const fields = useMemo(() => {
		if (data) return Object.entries(data).filter(([key]) => !EXCLUDED_FIELDS.has(key));
		return [];
	}, [data]);

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<div className={styles.topBar}>
					<Link href="/" className={styles.backBtn}>
						← Back to Explorer
					</Link>
					{!loading && !error && <span className={styles.categoryTag}>{category}</span>}
				</div>

				{loading && <LoadingSpinner label="Loading details…" />}
				{error && <ErrorMessage message={error} />}

				{data && !loading && (
					<>
						<h1 className={styles.title}>{String(data.title || data.name)}</h1>
						<dl className={styles.grid}>
							{fields.map(([key, value]) => (
								<DetailCard key={key} fieldKey={key} value={value} />
							))}
						</dl>
					</>
				)}
			</div>
		</div>
	);
}
