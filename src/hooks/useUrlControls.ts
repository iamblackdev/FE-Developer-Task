'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { SwapiCategory, AppUrlParams } from '@/types';
import { DEFAULT_PAGE } from '@/lib/data';
import { buildAppUrl, readParams } from '@/lib/helper';

interface UrlControls {
	category: SwapiCategory;
	search: string;
	sort: string;
	order: string;
	page: number;
	recent: string;
	setCategory: (cat: SwapiCategory) => void;
	setSearch: (value: string) => void;
	setSort: (sort: string, order: string) => void;
	setPage: (page: number) => void;
}

export function useUrlControls(): UrlControls {
	const router = useRouter();
	const searchParams = useSearchParams();
	const current = readParams(searchParams);

	const replace = useCallback(
		(next: AppUrlParams) => {
			router.replace(buildAppUrl(next), { scroll: false });
		},
		[router],
	);

	/**
	 * Update category. Sets ?recent= to the category being left.
	 * Retains search, sort, order, and page as-is.
	 */
	const setCategory = useCallback(
		(cat: SwapiCategory) => {
			replace({ ...current, category: cat, recent: current.category });
		},
		[current, replace],
	);

	/**
	 * Update search term. Resets page to 1.
	 * Clears ?search= when value is empty.
	 */
	const setSearch = useCallback(
		(value: string) => {
			replace({ ...current, search: value, page: DEFAULT_PAGE });
		},
		[current, replace],
	);

	/**
	 * Update sort field and direction together.
	 * Pass empty strings to reset to default (removes both params from URL).
	 */
	const setSort = useCallback(
		(sort: string, order: string) => {
			replace({ ...current, sort, order });
		},
		[current, replace],
	);

	/**
	 * Update page. Omits ?page= from URL when value is DEFAULT_PAGE.
	 */
	const setPage = useCallback(
		(page: number) => {
			replace({ ...current, page });
		},
		[current, replace],
	);

	return {
		...current,
		setCategory,
		setSearch,
		setSort,
		setPage,
	};
}
