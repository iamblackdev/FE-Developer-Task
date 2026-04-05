import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from './page';
import * as swapi from '@/lib/swapi';

// ── Next.js navigation mocks ──────────────────────────────────────────────────

const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockSearchParams = new Map<string, string>();

jest.mock('next/navigation', () => ({
	useRouter: () => ({ replace: mockReplace, push: mockPush }),
	useSearchParams: () => ({
		get: (key: string) => mockSearchParams.get(key) ?? null,
	}),
}));

// ── swapi mock ────────────────────────────────────────────────────────────────

jest.mock('@/lib/swapi', () => ({
	...jest.requireActual('@/lib/swapi'),
	fetchPage: jest.fn(),
}));

const mockFetchPage = swapi.fetchPage as jest.MockedFunction<typeof swapi.fetchPage>;

// ── fixtures ──────────────────────────────────────────────────────────────────

const PLANET_PAGE = {
	count: 2,
	results: [
		{ name: 'Tatooine', climate: 'arid', terrain: 'desert', population: '200000', diameter: '10465', url: 'https://swapi.dev/api/planets/1/' },
		{ name: 'Alderaan', climate: 'temperate', terrain: 'grasslands', population: '2000000000', diameter: '12500', url: 'https://swapi.dev/api/planets/2/' },
	],
};

// ── helpers ───────────────────────────────────────────────────────────────────

function setup() {
	const user = userEvent.setup();
	render(<Home />);
	return { user };
}

// ── tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
	mockSearchParams.clear();
	mockReplace.mockClear();
	mockPush.mockClear();
	mockFetchPage.mockResolvedValue(PLANET_PAGE);
});

describe('Landing page — Home', () => {
	describe('initial render', () => {
		it('shows a loading spinner while the first fetch is in flight', () => {
			// fetchPage never resolves during this test
			mockFetchPage.mockReturnValue(new Promise(() => {}));
			setup();
			expect(screen.getByRole('status')).toBeInTheDocument();
		});

		it('renders the data table once the fetch resolves', async () => {
			setup();
			await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());
		});

		it('fetches planets by default when no URL params are present', async () => {
			setup();
			await waitFor(() => expect(mockFetchPage).toHaveBeenCalledWith('planets', 1, undefined));
		});

		it('rehydrates category from the URL param', async () => {
			mockSearchParams.set('category', 'films');
			mockFetchPage.mockResolvedValue({
				count: 1,
				results: [{ title: 'A New Hope', episode_id: 4, director: 'George Lucas', release_date: '1977-05-25', url: 'https://swapi.dev/api/films/1/' }],
			});
			setup();
			await waitFor(() => expect(mockFetchPage).toHaveBeenCalledWith('films', 1, undefined));
		});

		it('rehydrates the search term from the URL param', async () => {
			mockSearchParams.set('search', 'tat');
			setup();
			await waitFor(() => expect(mockFetchPage).toHaveBeenCalledWith('planets', 1, 'tat'));
		});

		it('rehydrates the page number from the URL param', async () => {
			mockSearchParams.set('page', '3');
			setup();
			await waitFor(() => expect(mockFetchPage).toHaveBeenCalledWith('planets', 3, undefined));
		});
	});

	describe('table content', () => {
		it('renders a row for every result returned', async () => {
			setup();
			await waitFor(() => {
				expect(screen.getByRole('row', { name: /tatooine/i })).toBeInTheDocument();
				expect(screen.getByRole('row', { name: /alderaan/i })).toBeInTheDocument();
			});
		});

		it('displays the correct column headers for planets', async () => {
			setup();
			await waitFor(() => {
				expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
				expect(screen.getByRole('columnheader', { name: /climate/i })).toBeInTheDocument();
			});
		});
	});

	describe('category switching', () => {
		it('updates the URL when the user selects a new category', async () => {
			const { user } = setup();
			await waitFor(() => screen.getByRole('table'));

			await user.selectOptions(screen.getByRole('combobox', { name: /category/i }), 'people');

			expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining('category=people'), expect.anything());
		});

		it('includes the previous category as ?recent= in the URL', async () => {
			const { user } = setup();
			await waitFor(() => screen.getByRole('table'));

			await user.selectOptions(screen.getByRole('combobox', { name: /category/i }), 'films');

			expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining('recent=planets'), expect.anything());
		});
	});

	describe('sorting', () => {
		it('updates the URL when a sort option is chosen', async () => {
			const { user } = setup();
			await waitFor(() => screen.getByRole('table'));

			await user.selectOptions(screen.getByRole('combobox', { name: /sort/i }), 'asc');

			expect(mockReplace).toHaveBeenCalledWith(expect.stringMatching(/order=asc/), expect.anything());
		});

		it('sorts results client-side in ascending order', async () => {
			// Return results in reverse order so sorting is detectable
			mockSearchParams.set('sort', 'name');
			mockSearchParams.set('order', 'asc');
			mockFetchPage.mockResolvedValue({
				count: 2,
				results: [
					{ name: 'Tatooine', climate: 'arid', terrain: 'desert', population: '200000', diameter: '10465', url: 'https://swapi.dev/api/planets/1/' },
					{ name: 'Alderaan', climate: 'temperate', terrain: 'grasslands', population: '2000000000', diameter: '12500', url: 'https://swapi.dev/api/planets/2/' },
				],
			});
			setup();
			await waitFor(() => screen.getByRole('table'));

			const rows = screen.getAllByRole('row').slice(1); // skip header
			expect(rows[0]).toHaveAccessibleName(/alderaan/i);
			expect(rows[1]).toHaveAccessibleName(/tatooine/i);
		});
	});

	describe('pagination', () => {
		it('shows pagination controls when there are multiple pages', async () => {
			mockFetchPage.mockResolvedValue({ count: 25, results: PLANET_PAGE.results });
			setup();
			await waitFor(() => expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument());
		});

		it('does not show pagination when all results fit on one page', async () => {
			setup(); // count: 2, fits in PAGE_SIZE: 10
			await waitFor(() => screen.getByRole('table'));
			expect(screen.queryByRole('navigation', { name: /pagination/i })).not.toBeInTheDocument();
		});

		it('updates the URL when Next is clicked', async () => {
			mockFetchPage.mockResolvedValue({ count: 25, results: PLANET_PAGE.results });
			const { user } = setup();
			await waitFor(() => screen.getByRole('button', { name: /next page/i }));

			await user.click(screen.getByRole('button', { name: /next page/i }));

			expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining('page=2'), expect.anything());
		});
	});

	describe('error state', () => {
		it('shows an error alert when the fetch fails', async () => {
			mockFetchPage.mockRejectedValue(new Error('Network error'));
			setup();
			await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Network error'));
		});

		it('does not render the table after a fetch error', async () => {
			mockFetchPage.mockRejectedValue(new Error('oops'));
			setup();
			await waitFor(() => screen.getByRole('alert'));
			expect(screen.queryByRole('table')).not.toBeInTheDocument();
		});
	});

	describe('row navigation', () => {
		it('navigates to the detail page when a row is clicked', async () => {
			const { user } = setup();
			await waitFor(() => screen.getByRole('row', { name: /tatooine/i }));
			await user.click(screen.getByRole('row', { name: /tatooine/i }));
			expect(mockPush).toHaveBeenCalledWith('/planets/1');
		});
	});
});
