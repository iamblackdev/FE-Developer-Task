import type { SwapiCategory, SwapiListResponse } from '@/types';
import { buildSwapiUrl } from './helper';

export const BASE_URL = 'https://swapi.dev/api';

/**
 * Fetches a single page from the SWAPI list endpoint.
 * Search is delegated to SWAPI's ?search= param.
 * Sorting is NOT supported by SWAPI and must be applied client-side.
 */
export async function fetchPage<T>(category: SwapiCategory, page: number, search?: string): Promise<{ results: T[]; count: number }> {
	const url = buildSwapiUrl(category, page, search);
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`Failed to fetch ${category}: ${res.status} ${res.statusText}`);
	}
	const data: SwapiListResponse<T> = await res.json();
	return { results: data.results, count: data.count };
}

export async function fetchById<T>(category: SwapiCategory, id: string): Promise<T> {
	const res = await fetch(`${BASE_URL}/${category}/${id}/`);
	if (!res.ok) {
		throw new Error(`Failed to fetch ${category}/${id}: ${res.status} ${res.statusText}`);
	}
	return res.json();
}

export function extractPath(url: string): string {
	const match = url.match(/\/api\/([a-z]+)\/(\d+)\//);
	return match ? `/${match[1]}/${match[2]}` : '#';
}

export function isSwapiUrl(value: unknown): value is string {
	return typeof value === 'string' && /^https:\/\/swapi\.dev\/api\/[a-z]+\/\d+\/$/.test(value);
}
