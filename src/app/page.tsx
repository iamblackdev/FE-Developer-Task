'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SwapiCategory } from '@/types';
import { fetchPage } from '@/lib/swapi';
import Controls from '@/components/Controls/Controls';
import DataTable from '@/components/DataTable/DataTable';
import Pagination from '@/components/Pagination/Pagination';
import { usePersistedControls } from '@/hooks/usePersistedControls';
import styles from './page.module.css';
import { getTotalPages } from '@/lib/helper';
import { PAGE_SIZE } from '@/lib/data';

export default function Home() {
	const { category, search, sort, setCategory, setSearch, setSort } = usePersistedControls();

	const [rawData, setRawData] = useState<Record<string, unknown>[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);

	const handleSearchChange = (value: string) => {
		setSearch(value);
		setPage(1);
	};

	const handleCategoryChange = (cat: SwapiCategory) => {
		setCategory(cat);
	};

	// Fetch the current page whenever category, page, or search changes.
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

	// sorting applied to the current page's results.
	const displayData = useMemo(() => {
		if (sort === 'default') return rawData;
		const sortField = sort.startsWith('title') ? 'title' : 'name';
		const asc = sort.endsWith('asc');
		return [...rawData].sort((a, b) => {
			const cmp = String(a[sortField] ?? '').localeCompare(String(b[sortField] ?? ''));
			return asc ? cmp : -cmp;
		});
	}, [rawData, sort]);

	const totalPages = getTotalPages(totalCount, PAGE_SIZE);

	return (
		<main className={styles.main}>
			<Controls category={category} search={search} sort={sort} onCategoryChange={handleCategoryChange} onSearchChange={handleSearchChange} onSortChange={setSort} />
			<div className={styles.tableArea}>
				<DataTable category={category} data={displayData} totalItems={totalCount} loading={loading} error={error} />
				{!loading && !error && totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
			</div>
		</main>
	);
}
