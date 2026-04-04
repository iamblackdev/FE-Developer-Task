import { SwapiCategory } from '@/types';

/**
 * Converts a snake_case field name to a Title Case label.
 * e.g. "birth_year" → "Birth Year"
 */
export function formatFieldName(key: string): string {
	return key
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

/**
 * Extracts category and numeric ID from a SWAPI URL.
 * e.g. "https://swapi.dev/api/people/1/" → { category: "people", id: "1" }
 * Returns null if the URL doesn't match the expected pattern.
 */
export function extractCategoryAndId(url: string): { category: string; id: string } | null {
	const match = url.match(/\/api\/([a-z]+)\/(\d+)\/?$/);
	if (!match) return null;
	return { category: match[1], id: match[2] };
}

/**
 * Formats an ISO date string as a human-readable date.
 * e.g. "2014-12-09T13:50:51.644000Z" → "Dec 9, 2014"
 */
export function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	if (isNaN(date.getTime())) return dateStr;
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
}

/**
 * Returns true if a value looks like a SWAPI resource URL.
 */
export function isSwapiUrl(value: unknown): value is string {
	return typeof value === 'string' && /^https?:\/\/swapi\.dev\/api\//.test(value);
}

/**
 * Returns true if a value is an array of SWAPI URLs.
 */
export function isSwapiUrlArray(value: unknown): value is string[] {
	return Array.isArray(value) && value.length > 0 && value.every((v) => isSwapiUrl(v));
}

/**
 * Returns the sigular label
 */
export const getSingularLabel = (category: string): string => {
	const map: Record<string, string> = {
		people: 'Person',
		planets: 'Planet',
		films: 'Film',
		species: 'Species',
		vehicles: 'Vehicle',
		starships: 'Starship',
	};
	return map[category] ?? formatFieldName(category);
};

/**
 * Returns the sort option for controls
 */

export const getSortOptions = (category: SwapiCategory) => {
	const field = category === 'films' ? 'Title' : 'Name';
	return [
		{ value: 'default', label: 'Default' },
		{ value: `${field.toLowerCase()}-asc`, label: `${field} A→Z` },
		{ value: `${field.toLowerCase()}-desc`, label: `${field} Z→A` },
	];
};
