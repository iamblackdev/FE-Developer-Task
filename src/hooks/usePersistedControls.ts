'use client';

import { useState } from 'react';
import type { SwapiCategory } from '@/types';
import { SWAPI_CATEGORY_KEY, SWAPI_CONTROLS_KEY } from '@/lib/data';
import { writeToStorage, readFromStorage } from '@/lib/helper';

interface StoredControls {
	search: string;
	sortOrder: string;
}

interface PersistedControls {
	category: SwapiCategory;
	search: string;
	sort: string;
	setCategory: (cat: SwapiCategory) => void;
	setSearch: (value: string) => void;
	setSort: (value: string) => void;
}

export function usePersistedControls(): PersistedControls {
	// const [category, setCategory] = useState<SwapiCategory>('planets');
	// const [search, setSearch] = useState<string>('');
	// const [sort, setSort] = useState<string>('default');
	const [category, setCategory] = useState<SwapiCategory>(() => readFromStorage<SwapiCategory>(SWAPI_CATEGORY_KEY) ?? 'planets');
	const [search, setSearch] = useState<string>(() => readFromStorage<StoredControls>(SWAPI_CONTROLS_KEY)?.search ?? '');
	const [sort, setSort] = useState<string>(() => readFromStorage<StoredControls>(SWAPI_CONTROLS_KEY)?.sortOrder ?? 'default');

	/**
	 * Updates the active category and persists it.
	 */
	const handleSetCategory = (cat: SwapiCategory) => {
		setCategory(cat);
		writeToStorage<SwapiCategory>(SWAPI_CATEGORY_KEY, cat);
	};

	/**
	 * Updates the search term and persists both search + current sort.
	 */
	const handleSetSearch = (value: string) => {
		setSearch(value);
		writeToStorage<StoredControls>(SWAPI_CONTROLS_KEY, {
			search: value,
			sortOrder: sort,
		});
	};

	/**
	 * Updates the sort order and persists both current search + new sort.
	 */
	const handleSetSort = (value: string) => {
		setSort(value);
		writeToStorage<StoredControls>(SWAPI_CONTROLS_KEY, {
			search,
			sortOrder: value,
		});
	};

	return {
		category,
		search,
		sort,
		setCategory: handleSetCategory,
		setSearch: handleSetSearch,
		setSort: handleSetSort,
	};
}
