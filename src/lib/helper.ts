import { SwapiCategory } from '@/types';
import { BASE_URL } from './swapi';

/**
 * Converts a snake_case field name to a Title Case label.
 */
export const formatFieldName = (key: string): string => key.split('_').join(' ');

/**
 * Extracts category and numeric ID from a SWAPI URL.
 * e.g. "https://swapi.dev/api/people/1/" → { category: "people", id: "1" }
 * Returns null if the URL doesn't match the expected pattern.
 */
export const extractCategoryAndId = (url: string): { category: string; id: string } | null => {
	const match = url.match(/\/api\/([a-z]+)\/(\d+)\/?$/);
	if (!match) return null;
	return { category: match[1], id: match[2] };
};

/**
 * Formats an ISO date string as a human-readable date.
 */
export const formatDate = (dateStr: string): string => {
	const date = new Date(dateStr);
	if (isNaN(date.getTime())) return dateStr;
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
};

/**
 * Returns true if a value looks like a SWAPI resource URL.
 */
export const isSwapiUrl = (value: unknown): value is string => {
	return typeof value === 'string' && /^https?:\/\/swapi\.dev\/api\//.test(value);
};

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

/**
 * Derives total page count from the API's total item count.
 */
export function getTotalPages(count: number, pageSize: number): number {
	if (pageSize <= 0) return 0;
	return Math.ceil(count / pageSize);
}

/**
 * Reads a JSON-serialised value from localStorage.
 * Returns null if the key is absent, the value is malformed, or
 * localStorage is unavailable (e.g. SSR, private-browsing quota).
 */
export function readFromStorage<T>(key: string): T | null {
	try {
		const raw = localStorage.getItem(key);
		if (raw === null) return null;
		return JSON.parse(raw) as T;
	} catch {
		return null;
	}
}

/**
 * Serialises a value to JSON and writes it to localStorage.
 */
export function writeToStorage<T>(key: string, value: T): void {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// Unavailable — no-op
	}
}

/**
 * Constructs a SWAPI list URL with optional search and page parameters.
 */
export function buildSwapiUrl(category: string, page: number, search?: string): string {
	const params = new URLSearchParams();
	params.set('page', String(page));
	if (search && search.trim()) {
		params.set('search', search.trim());
	}
	return `${BASE_URL}/${category}/?${params.toString()}`;
}
