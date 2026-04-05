import { SwapiCategory } from '@/types';
import type { AppUrlParams } from '@/types';
import { BASE_URL } from './swapi';
import { DEFAULT_CATEGORY, DEFAULT_PAGE } from './data';
import { type useSearchParams } from 'next/navigation';

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
 * Constructs the landing page URL from a full AppUrlParams object.
 * Defaults are omitted to keep URLs clean:
 *   - category omitted when it equals DEFAULT_CATEGORY
 *   - search omitted when empty
 *   - sort/order omitted when empty
 *   - page omitted when it equals DEFAULT_PAGE
 *   - recent omitted when empty
 */
export function buildAppUrl(params: AppUrlParams): string {
	const p = new URLSearchParams();
	if (params.category !== DEFAULT_CATEGORY) p.set('category', params.category);
	if (params.search) p.set('search', params.search);
	if (params.sort) p.set('sort', params.sort);
	if (params.order) p.set('order', params.order);
	if (params.page !== DEFAULT_PAGE) p.set('page', String(params.page));
	if (params.recent) p.set('recent', params.recent);
	const qs = p.toString();
	return qs ? `/?${qs}` : '/';
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

export const readParams = (searchParams: ReturnType<typeof useSearchParams>): AppUrlParams => {
	const category = (searchParams.get('category') ?? DEFAULT_CATEGORY) as SwapiCategory;
	const search = searchParams.get('search') ?? '';
	const sort = searchParams.get('sort') ?? '';
	const order = searchParams.get('order') ?? '';
	const page = Number(searchParams.get('page') ?? DEFAULT_PAGE);
	const recent = searchParams.get('recent') ?? '';
	return { category, search, sort, order, page, recent };
};
