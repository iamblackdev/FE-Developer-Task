import { buildAppUrl, buildSwapiUrl, getTotalPages, isSwapiUrl, isSwapiUrlArray } from './helper';

describe('buildSwapiUrl', () => {
	it('builds a URL with page only', () => {
		expect(buildSwapiUrl('planets', 1)).toBe('https://swapi.dev/api/planets/?page=1');
	});

	it('appends the search term when provided', () => {
		expect(buildSwapiUrl('people', 2, 'luke')).toBe('https://swapi.dev/api/people/?page=2&search=luke');
	});

	it('omits search when it is an empty string', () => {
		expect(buildSwapiUrl('films', 1, '')).toBe('https://swapi.dev/api/films/?page=1');
	});

	it('trims whitespace from the search term', () => {
		const url = buildSwapiUrl('planets', 1, '  tat  ');
		expect(url).toContain('search=tat');
		expect(url).not.toContain('  ');
	});
});

describe('buildAppUrl', () => {
	const base = { category: 'planets' as const, search: '', sort: '', order: '', page: 1, recent: '' };

	it('returns "/" when all params are at their defaults', () => {
		expect(buildAppUrl(base)).toBe('/');
	});

	it('omits ?category= when it equals the default', () => {
		expect(buildAppUrl({ ...base, category: 'planets' })).not.toContain('category');
	});

	it('includes ?category= when it differs from the default', () => {
		expect(buildAppUrl({ ...base, category: 'films' })).toContain('category=films');
	});

	it('includes ?search= when a term is present', () => {
		expect(buildAppUrl({ ...base, search: 'tat' })).toContain('search=tat');
	});

	it('omits ?search= when the term is empty', () => {
		expect(buildAppUrl({ ...base, search: '' })).not.toContain('search');
	});

	it('includes ?sort= and ?order= when both are set', () => {
		const url = buildAppUrl({ ...base, sort: 'name', order: 'asc' });
		expect(url).toContain('sort=name');
		expect(url).toContain('order=asc');
	});

	it('omits ?sort= and ?order= when both are empty', () => {
		const url = buildAppUrl({ ...base, sort: '', order: '' });
		expect(url).not.toContain('sort');
		expect(url).not.toContain('order');
	});

	it('omits ?page= when page is 1', () => {
		expect(buildAppUrl({ ...base, page: 1 })).not.toContain('page');
	});

	it('includes ?page= when page is greater than 1', () => {
		expect(buildAppUrl({ ...base, page: 3 })).toContain('page=3');
	});

	it('includes ?recent= when a recent category is set', () => {
		expect(buildAppUrl({ ...base, recent: 'starships' })).toContain('recent=starships');
	});
});

describe('getTotalPages', () => {
	it('calculates pages correctly', () => {
		expect(getTotalPages(60, 10)).toBe(6);
	});

	it('rounds up when results do not divide evenly', () => {
		expect(getTotalPages(61, 10)).toBe(7);
	});

	it('returns 0 when count is 0', () => {
		expect(getTotalPages(0, 10)).toBe(0);
	});

	it('returns 0 when pageSize is 0 (guard against division by zero)', () => {
		expect(getTotalPages(100, 0)).toBe(0);
	});
});

describe('isSwapiUrl', () => {
	it('returns true for a valid SWAPI URL', () => {
		expect(isSwapiUrl('https://swapi.dev/api/people/1/')).toBe(true);
	});

	it('returns false for a plain string', () => {
		expect(isSwapiUrl('Tatooine')).toBe(false);
	});

	it('returns false for a non-SWAPI URL', () => {
		expect(isSwapiUrl('https://example.com/api/people/1/')).toBe(false);
	});

	it('returns false for non-string values', () => {
		expect(isSwapiUrl(42)).toBe(false);
		expect(isSwapiUrl(null)).toBe(false);
	});
});

describe('isSwapiUrlArray', () => {
	it('returns true for an array of SWAPI URLs', () => {
		expect(isSwapiUrlArray(['https://swapi.dev/api/films/1/', 'https://swapi.dev/api/films/2/'])).toBe(true);
	});

	it('returns false for an empty array', () => {
		expect(isSwapiUrlArray([])).toBe(false);
	});

	it('returns false if any element is not a SWAPI URL', () => {
		expect(isSwapiUrlArray(['https://swapi.dev/api/films/1/', 'not-a-url'])).toBe(false);
	});

	it('returns false for non-array values', () => {
		expect(isSwapiUrlArray('https://swapi.dev/api/films/1/')).toBe(false);
	});
});
