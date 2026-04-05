import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataTable from './DataTable';

// useRouter is called inside DataTable for row navigation.
// push is declared at module scope so individual tests can assert on it.
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
	useRouter: () => ({ push: mockPush }),
}));

const PLANET_ROWS = [
	{ name: 'Tatooine', climate: 'arid', terrain: 'desert', population: '200000', url: 'https://swapi.dev/api/planets/1/' },
	{ name: 'Alderaan', climate: 'temperate', terrain: 'grasslands', population: '2000000000', url: 'https://swapi.dev/api/planets/2/' },
];

beforeEach(() => mockPush.mockClear());

function renderTable(overrides: Partial<React.ComponentProps<typeof DataTable>> = {}) {
	const props = {
		category: 'planets' as const,
		data: PLANET_ROWS,
		totalItems: PLANET_ROWS.length,
		loading: false,
		error: null,
		...overrides,
	};
	return render(<DataTable {...props} />);
}

describe('DataTable', () => {
	describe('loading state', () => {
		it('shows a loading spinner while fetching', () => {
			renderTable({ loading: true, data: [] });
			expect(screen.getByRole('status')).toBeInTheDocument();
		});

		it('does not render the table while loading', () => {
			renderTable({ loading: true, data: [] });
			expect(screen.queryByRole('table')).not.toBeInTheDocument();
		});
	});

	describe('error state', () => {
		it('shows the error message', () => {
			renderTable({ error: 'Failed to fetch planets', data: [] });
			expect(screen.getByRole('alert')).toHaveTextContent('Failed to fetch planets');
		});
	});

	describe('empty state', () => {
		it('shows a no-results message when data is empty but totalItems > 0 (filtered)', () => {
			renderTable({ data: [], totalItems: 10 });
			expect(screen.getByText(/no results match your search/i)).toBeInTheDocument();
		});

		it('shows a generic no-results message when totalItems is also 0', () => {
			renderTable({ data: [], totalItems: 0 });
			expect(screen.getByText(/no results found/i)).toBeInTheDocument();
		});
	});

	describe('populated table', () => {
		it('renders a row for each data item', () => {
			renderTable();
			expect(screen.getAllByRole('row')).toHaveLength(PLANET_ROWS.length + 1); // +1 for thead
		});

		it('renders the correct cell values', () => {
			renderTable();
			expect(screen.getByText('Tatooine')).toBeInTheDocument();
			expect(screen.getByText('Alderaan')).toBeInTheDocument();
		});

		it('navigates to the detail page when a row is clicked', async () => {
			renderTable();
			await userEvent.click(screen.getByRole('row', { name: /tatooine/i }));
			expect(mockPush).toHaveBeenCalledWith('/planets/1');
		});

		it('navigates when Enter is pressed on a focused row', async () => {
			renderTable();
			const row = screen.getByRole('row', { name: /tatooine/i });
			row.focus();
			await userEvent.keyboard('{Enter}');
			expect(mockPush).toHaveBeenCalledWith('/planets/1');
		});

		it('navigates when Space is pressed on a focused row', async () => {
			renderTable();
			const row = screen.getByRole('row', { name: /tatooine/i });
			row.focus();
			await userEvent.keyboard('{ }');
			expect(mockPush).toHaveBeenCalledWith('/planets/1');
		});
	});

	// Accessibility
	describe('accessibility', () => {
		it('renders a <table> with <thead> and <tbody>', () => {
			renderTable();
			const table = screen.getByRole('table');
			expect(within(table).getAllByRole('columnheader').length).toBeGreaterThan(0);
			expect(within(table).getAllByRole('row').length).toBeGreaterThan(1);
		});

		it('column headers have scope="col"', () => {
			renderTable();
			const headers = screen.getAllByRole('columnheader');
			headers.forEach((th) => expect(th).toHaveAttribute('scope', 'col'));
		});

		it('data rows have tabIndex={0} so they are keyboard-reachable', () => {
			renderTable();
			// getAllByRole('row') returns thead row + tbody rows; skip index 0 (header)
			const dataRows = screen.getAllByRole('row').slice(1);
			dataRows.forEach((row) => expect(row).toHaveAttribute('tabindex', '0'));
		});

		it('each row has an aria-label describing its content', () => {
			renderTable();
			expect(screen.getByRole('row', { name: /view details for tatooine/i })).toBeInTheDocument();
		});
	});
});
