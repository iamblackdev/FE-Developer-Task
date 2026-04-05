'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { fetchPage } from '@/lib/swapi';
import Controls from '@/components/Controls/Controls';
import DataTable from '@/components/DataTable/DataTable';
import Pagination from '@/components/Pagination/Pagination';
import { useUrlControls } from '@/hooks/useUrlControls';
import { getTotalPages } from '@/lib/helper';
import { PAGE_SIZE } from '@/lib/data';
import styles from './page.module.css';

function HomeInner() {
	const { category, search, order, page, recent, setCategory, setSearch, setSort, setPage } = useUrlControls();

	const [rawData, setRawData] = useState<Record<string, unknown>[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const { results, count } = await fetchPage<Record<string, unknown>>(category, page, search.trim() || undefined);
			setRawData(results);
			setTotalCount(count);
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setLoading(false);
		}
	}, [category, page, search]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// Sorting is applied client-side on the current page's results.
	// SWAPI does not support server-side sorting.
	const displayData = useMemo(() => {
		const field = category === 'films' ? 'title' : 'name';
		if (!order) return rawData;
		const asc = order === 'asc';
		return [...rawData].sort((a, b) => {
			const cmp = String(a[field] ?? '').localeCompare(String(b[field] ?? ''));
			return asc ? cmp : -cmp;
		});
	}, [rawData, order, category]);

	const totalPages = getTotalPages(totalCount, PAGE_SIZE);

	return (
		<main className={styles.main}>
			<Controls category={category} search={search} order={order} recent={recent} onCategoryChange={setCategory} onSearchChange={setSearch} onSortChange={setSort} />
			<div className={styles.tableArea}>
				<DataTable category={category} data={displayData} totalItems={totalCount} loading={loading} error={error} />
				{!loading && !error && totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
			</div>
		</main>
	);
}

// useSearchParams() requires a Suspense boundary.
export default function Home() {
	return (
		<Suspense>
			<HomeInner />
		</Suspense>
	);
}
