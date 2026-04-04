'use client';

import type { SwapiCategory } from '@/types';
import styles from './Controls.module.css';
import { getSortOptions } from '@/lib/helper';

const CATEGORIES: SwapiCategory[] = ['films', 'people', 'planets', 'species', 'starships', 'vehicles'];

interface Props {
	category: SwapiCategory;
	search: string;
	sort: string;
	onCategoryChange: (cat: SwapiCategory) => void;
	onSearchChange: (value: string) => void;
	onSortChange: (value: string) => void;
}

export default function Controls({ category, search, sort, onCategoryChange, onSearchChange, onSortChange }: Props) {
	const sortOptions = getSortOptions(category);
	const placeholder = category === 'films' ? 'Search by title…' : 'Search by name…';

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
							placeholder={placeholder}
							value={search}
							onChange={(e) => onSearchChange(e.target.value)}
							autoComplete="off"
						/>
					</div>

					<div className={styles.field}>
						<label htmlFor="sort-select" className={styles.label}>
							Sort
						</label>
						<select id="sort-select" className={styles.select} value={sort} onChange={(e) => onSortChange(e.target.value)}>
							{sortOptions.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>
		</div>
	);
}
