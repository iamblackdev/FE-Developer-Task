import { render, screen } from '@testing-library/react';
import DetailPage from './page';
import * as swapi from '@/lib/swapi';

// ── Next.js navigation mocks ──────────────────────────────────────────────────

const mockNotFound = jest.fn();

jest.mock('next/navigation', () => ({
	notFound: () => mockNotFound(),
}));

// next/link renders as a plain <a> in tests
jest.mock('next/link', () => {
	const Link = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
		<a href={href} className={className}>
			{children}
		</a>
	);
	Link.displayName = 'Link';
	return Link;
});

// UrlChip inside DetailCard uses useRouter
jest.mock('next/navigation', () => ({
	notFound: () => mockNotFound(),
	useRouter: () => ({ push: jest.fn() }),
}));

// ── swapi mock ────────────────────────────────────────────────────────────────

jest.mock('@/lib/swapi', () => ({
	...jest.requireActual('@/lib/swapi'),
	fetchById: jest.fn(),
}));

const mockFetchById = swapi.fetchById as jest.MockedFunction<typeof swapi.fetchById>;

// ── fixtures ──────────────────────────────────────────────────────────────────

const PLANET_DATA = {
	name: 'Tatooine',
	climate: 'arid',
	terrain: 'desert',
	population: '200000',
	diameter: '10465',
	residents: ['https://swapi.dev/api/people/1/', 'https://swapi.dev/api/people/2/'],
	films: ['https://swapi.dev/api/films/1/'],
	url: 'https://swapi.dev/api/planets/1/',
};

const FILM_DATA = {
	title: 'A New Hope',
	episode_id: 4,
	director: 'George Lucas',
	opening_crawl: 'It is a period of civil war.',
	url: 'https://swapi.dev/api/films/1/',
};

// Helper: render the async server component
async function renderDetailPage(category: string, id: string) {
	const jsx = await DetailPage({ params: Promise.resolve({ category, id }) });
	return render(jsx as React.ReactElement);
}

// ── tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
	mockNotFound.mockClear();
	mockFetchById.mockClear();
	mockFetchById.mockResolvedValue(PLANET_DATA as never);
});

describe('Detail page — DetailPage', () => {
	describe('valid category', () => {
		it('calls fetchById with the correct category and id', async () => {
			await renderDetailPage('planets', '1');
			expect(mockFetchById).toHaveBeenCalledWith('planets', '1');
		});

		it('renders the item title as a heading', async () => {
			await renderDetailPage('planets', '1');
			expect(screen.getByRole('heading', { name: 'Tatooine' })).toBeInTheDocument();
		});

		it('uses data.title for film entries', async () => {
			mockFetchById.mockResolvedValue(FILM_DATA as never);
			await renderDetailPage('films', '1');
			expect(screen.getByRole('heading', { name: 'A New Hope' })).toBeInTheDocument();
		});

		it('renders a card for each non-excluded field', async () => {
			await renderDetailPage('planets', '1');
			// "url" is excluded; all others must appear as labels
			expect(screen.getByText('name')).toBeInTheDocument();
			expect(screen.getByText('climate')).toBeInTheDocument();
			expect(screen.queryByText('url')).not.toBeInTheDocument();
		});

		it('renders the category tag', async () => {
			await renderDetailPage('planets', '1');
			expect(screen.getByText('planets')).toBeInTheDocument();
		});

		it('renders a Back to Explorer link pointing to "/"', async () => {
			await renderDetailPage('planets', '1');
			const link = screen.getByRole('link', { name: /back to explorer/i });
			expect(link).toHaveAttribute('href', '/');
		});
	});

	describe('field rendering', () => {
		it('renders plain string values', async () => {
			await renderDetailPage('planets', '1');
			expect(screen.getByText('arid')).toBeInTheDocument();
		});

		it('renders SWAPI URL arrays as clickable UrlChip buttons', async () => {
			await renderDetailPage('planets', '1');
			// residents array has 2 URLs + films array has 1 URL = 3 chips total
			expect(screen.getAllByRole('button')).toHaveLength(3);
		});

		it('renders the opening_crawl inside a <pre> block', async () => {
			mockFetchById.mockResolvedValue(FILM_DATA as never);
			await renderDetailPage('films', '1');
			const pre = screen.getByText(/civil war/);
			expect(pre.tagName).toBe('PRE');
		});
	});

	describe('invalid category', () => {
		it('calls notFound() for an unrecognised category', async () => {
			// notFound() throws in real Next.js; here we just check it was called
			mockNotFound.mockImplementation(() => { throw new Error('NEXT_NOT_FOUND'); });
			await expect(renderDetailPage('dragons', '1')).rejects.toThrow('NEXT_NOT_FOUND');
			expect(mockNotFound).toHaveBeenCalled();
		});

		it('does not call fetchById for an invalid category', async () => {
			mockNotFound.mockImplementation(() => { throw new Error('NEXT_NOT_FOUND'); });
			await expect(renderDetailPage('invalid', '99')).rejects.toThrow();
			expect(mockFetchById).not.toHaveBeenCalled();
		});
	});

	// Accessibility
	describe('accessibility', () => {
		it('the back link is a proper <a> element with descriptive text', async () => {
			await renderDetailPage('planets', '1');
			const link = screen.getByRole('link', { name: /back to explorer/i });
			expect(link.tagName).toBe('A');
		});

		it('fields are rendered in a <dl> with <dt> labels and <dd> values', async () => {
			const { container } = await renderDetailPage('planets', '1');
			expect(container.querySelector('dl')).toBeInTheDocument();
			expect(container.querySelectorAll('dt').length).toBeGreaterThan(0);
			expect(container.querySelectorAll('dd').length).toBeGreaterThan(0);
		});

		it('the page heading is an <h1>', async () => {
			await renderDetailPage('planets', '1');
			expect(screen.getByRole('heading', { level: 1, name: 'Tatooine' })).toBeInTheDocument();
		});
	});
});
