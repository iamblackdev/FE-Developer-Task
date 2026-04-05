'use client';

import type { SwapiCategory } from '@/types';
import styles from './Controls.module.css';
import { getSortOptions } from '@/lib/helper';

const CATEGORIES: SwapiCategory[] = ['films', 'people', 'planets', 'species', 'starships', 'vehicles'];

interface Props {
	category: SwapiCategory;
	search: string;
	sort: string;
	order: string;
	recent: string;
	onCategoryChange: (cat: SwapiCategory) => void;
	onSearchChange: (value: string) => void;
	/** Receives the split sort field and order direction. Pass ('', '') to reset. */
	onSortChange: (sort: string, order: string) => void;
}

export default function Controls({ category, search, sort, order, recent, onCategoryChange, onSearchChange, onSortChange }: Props) {
	const sortOptions = getSortOptions(category);

	// Reconstruct the combined select value from the two URL params.
	const combinedSort = sort && order ? `${sort}-${order}` : 'default';

	const handleSortChange = (value: string) => {
		if (value === 'default') {
			onSortChange('', '');
		} else {
			// Values are like 'name-asc', 'title-desc' — split on the last '-'.
			const lastDash = value.lastIndexOf('-');
			onSortChange(value.slice(0, lastDash), value.slice(lastDash + 1));
		}
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
							value={search}
							onChange={(e) => onSearchChange(e.target.value)}
							autoComplete="off"
						/>
					</div>

					<div className={styles.field}>
						<label htmlFor="sort-select" className={styles.label}>
							Sort
						</label>
						<select id="sort-select" className={styles.select} value={combinedSort} onChange={(e) => handleSortChange(e.target.value)}>
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
