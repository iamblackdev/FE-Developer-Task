'use client';

import { useState, useEffect } from 'react';
import type { SwapiCategory } from '@/types';
import styles from './Controls.module.css';
import { getSortOptions } from '@/lib/helper';
import { useDebounce } from '@/hooks/useDebounce';

const CATEGORIES: SwapiCategory[] = ['films', 'people', 'planets', 'species', 'starships', 'vehicles'];

interface Props {
	category: SwapiCategory;
	search: string;
	order: string;
	recent: string;
	onCategoryChange: (cat: SwapiCategory) => void;
	onSearchChange: (value: string) => void;
	onSortChange: (order: string) => void;
}

export default function Controls({ category, search, order, recent, onCategoryChange, onSearchChange, onSortChange }: Props) {
	const sortOptions = getSortOptions(category);

	// Local state drives the input immediately; the debounced value triggers onSearchChange.
	const [inputValue, setInputValue] = useState(search);
	const debouncedSearch = useDebounce(inputValue, 300);

	// Sync external search (e.g. URL change) back into local input.
	useEffect(() => {
		setInputValue(search);
	}, [search]);

	// Fire the URL update only after the user has stopped typing for 300ms.
	useEffect(() => {
		onSearchChange(debouncedSearch);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch]);

	const handleSortChange = (value: string) => {
		if (value === 'default') onSortChange('');
		else onSortChange(value);
	};

	return (
		<div className={styles.bar}>
			<div className={styles.inner}>
				<div className={styles.controls}>
					<div className={styles.field}>
						<label htmlFor="category-select" className={styles.label}>
							Category
						</label>
						<select id="category-select" className={styles.select} value={category} onChange={(e) => onCategoryChange(e.target.value as SwapiCategory)}>
							{CATEGORIES.map((cat) => (
								<option key={cat} value={cat}>
									{cat.charAt(0).toUpperCase() + cat.slice(1)}
								</option>
							))}
						</select>
					</div>

					<div className={styles.field}>
						<label htmlFor="search-input" className={styles.label}>
							Search
						</label>
						<input
							id="search-input"
							type="search"
							className={styles.input}
							placeholder="Search by name or title"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							autoComplete="off"
						/>
					</div>

					<div className={styles.field}>
						<label htmlFor="sort-select" className={styles.label}>
							Sort
						</label>
						<select id="sort-select" className={styles.select} value={order} onChange={(e) => handleSortChange(e.target.value)}>
							{sortOptions.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					</div>
				</div>

				{recent && (
					<div className={styles.badgeGroup}>
						<span className={styles.badgeLabel}>Recent</span>
						<span className={styles.badge}>{recent}</span>
					</div>
				)}
			</div>
		</div>
	);
}
