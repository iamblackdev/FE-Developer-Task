import type { SwapiCategory, SwapiListResponse } from '@/types';

const BASE_URL = 'https://swapi.dev/api';

export async function fetchAllResults<T>(category: SwapiCategory): Promise<T[]> {
  const all: T[] = [];
  let url: string | null = `${BASE_URL}/${category}/`;

  while (url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${category}: ${res.status} ${res.statusText}`);
    }
    const data: SwapiListResponse<T> = await res.json();
    all.push(...data.results);
    url = data.next;
  }

  return all;
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
  return (
    typeof value === 'string' &&
    /^https:\/\/swapi\.dev\/api\/[a-z]+\/\d+\/$/.test(value)
  );
}
