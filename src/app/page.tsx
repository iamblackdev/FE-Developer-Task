'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { SwapiCategory, CategoryState } from '@/types';
import { fetchAllResults } from '@/lib/swapi';
import Controls from '@/components/Controls/Controls';
import DataTable from '@/components/DataTable/DataTable';
import styles from './page.module.css';
import { DEFAULT_CATEGORY, SEARCH_FIELD } from '@/lib/data';

export default function Home() {
	const [category, setCategory] = useState<SwapiCategory>(DEFAULT_CATEGORY);
	const [rawData, setRawData] = useState<Record<string, unknown>[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState('');
	const [sort, setSort] = useState('default');

	const categoryStateRef = useRef<Partial<Record<SwapiCategory, CategoryState>>>({});

	const loadCategory = useCallback(async (cat: SwapiCategory) => {
		setLoading(true);
		setError(null);
		setRawData([]);
		try {
			const results = await fetchAllResults<Record<string, unknown>>(cat);
			setRawData(results);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadCategory(category);
	}, [category, loadCategory]);

	const handleCategoryChange = useCallback(
		(newCat: SwapiCategory) => {
			categoryStateRef.current[category] = { search, sort };
			const saved = categoryStateRef.current[newCat];
			setSearch(saved?.search ?? '');
			setSort(saved?.sort ?? 'default');
			setCategory(newCat);
		},
		[category, search, sort],
	);

	const displayData = useMemo(() => {
		const field = SEARCH_FIELD[category];
		let filtered = rawData;

		if (search.trim()) {
			const q = search.trim().toLowerCase();
			filtered = filtered.filter((item) =>
				String(item[field] ?? '')
					.toLowerCase()
					.includes(q),
			);
		}

		if (sort !== 'default') {
			const sortField = sort.startsWith('title') ? 'title' : 'name';
			const asc = sort.endsWith('asc');
			filtered = [...filtered].sort((a, b) => {
				const cmp = String(a[sortField] ?? '').localeCompare(String(b[sortField] ?? ''));
				return asc ? cmp : -cmp;
			});
		}

		return filtered;
	}, [rawData, search, sort, category]);

	return (
		<main className={styles.main}>
			<Controls category={category} search={search} sort={sort} onCategoryChange={handleCategoryChange} onSearchChange={setSearch} onSortChange={setSort} />
			<div className={styles.tableArea}>
				<DataTable category={category} data={displayData} totalItems={rawData.length} loading={loading} error={error} />
			</div>
		</main>
	);
}
