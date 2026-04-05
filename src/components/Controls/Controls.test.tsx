import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Controls from './Controls';
import type { SwapiCategory } from '@/types';

// userEvent must know about fake timers so its internal pointer delays don't deadlock.
jest.useFakeTimers();
const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime.bind(jest) });

const defaultProps = {
	category: 'planets' as SwapiCategory,
	search: '',
	sort: '',
	order: '',
	recent: '',
	onCategoryChange: jest.fn(),
	onSearchChange: jest.fn(),
	onSortChange: jest.fn(),
};

function renderControls(overrides: Partial<typeof defaultProps> = {}) {
	return render(<Controls {...defaultProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());
afterEach(() => jest.clearAllTimers());

describe('Controls', () => {
	describe('category select', () => {
		it('renders all six category options', () => {
			renderControls();
			const select = screen.getByRole('combobox', { name: /category/i }) as HTMLSelectElement;
			const values = Array.from(select.options).map((o) => o.value);
			expect(values).toEqual(['films', 'people', 'planets', 'species', 'starships', 'vehicles']);
		});

		it('reflects the active category as the selected option', () => {
			renderControls({ category: 'starships' });
			expect(screen.getByRole('combobox', { name: /category/i })).toHaveValue('starships');
		});

		it('calls onCategoryChange with the chosen value', async () => {
			const onCategoryChange = jest.fn();
			renderControls({ onCategoryChange });
			await user.selectOptions(screen.getByRole('combobox', { name: /category/i }), 'films');
			expect(onCategoryChange).toHaveBeenCalledWith('films');
		});
	});

	describe('search input', () => {
		it('displays the current search value', () => {
			renderControls({ search: 'tatooine' });
			expect(screen.getByRole('searchbox', { name: /search/i })).toHaveValue('tatooine');
		});

		it('does not call onSearchChange before the debounce delay has elapsed', async () => {
			const onSearchChange = jest.fn();
			renderControls({ onSearchChange });
			await user.type(screen.getByRole('searchbox', { name: /search/i }), 'a');
			act(() => jest.advanceTimersByTime(299));
			expect(onSearchChange).not.toHaveBeenCalledWith('a');
		});

		it('calls onSearchChange with the typed value after the 300ms debounce', async () => {
			const onSearchChange = jest.fn();
			renderControls({ onSearchChange });
			await user.type(screen.getByRole('searchbox', { name: /search/i }), 'luke');
			act(() => jest.advanceTimersByTime(300));
			expect(onSearchChange).toHaveBeenLastCalledWith('luke');
		});

		it('debounces rapid keystrokes and only fires with the final value', async () => {
			const onSearchChange = jest.fn();
			renderControls({ onSearchChange });
			const input = screen.getByRole('searchbox', { name: /search/i });

			// Type fast — each character arrives before the previous timer fires
			await user.type(input, 'l');
			act(() => jest.advanceTimersByTime(100));
			await user.type(input, 'u');
			act(() => jest.advanceTimersByTime(100));
			await user.type(input, 'k');
			act(() => jest.advanceTimersByTime(300));

			const calls = onSearchChange.mock.calls.map(([v]: [string]) => v);
			// The intermediate value 'l' must never have been committed
			expect(calls).not.toContain('l');
			// The settled value 'luk' must have been committed exactly once
			expect(calls.filter((v) => v === 'luk')).toHaveLength(1);
		});
	});

	describe('sort select', () => {
		it('shows "Default" as selected when sort and order are empty', () => {
			renderControls({ sort: '', order: '' });
			expect(screen.getByRole('combobox', { name: /sort/i })).toHaveValue('default');
		});

		it('reflects an active sort+order pair as the selected option', () => {
			renderControls({ sort: 'name', order: 'asc' });
			expect(screen.getByRole('combobox', { name: /sort/i })).toHaveValue('name-asc');
		});

		it('calls onSortChange with the split field and direction', async () => {
			const onSortChange = jest.fn();
			renderControls({ onSortChange });
			await user.selectOptions(screen.getByRole('combobox', { name: /sort/i }), 'name-desc');
			expect(onSortChange).toHaveBeenCalledWith('name', 'desc');
		});

		it('calls onSortChange with empty strings when reset to Default', async () => {
			const onSortChange = jest.fn();
			renderControls({ sort: 'name', order: 'asc', onSortChange });
			await user.selectOptions(screen.getByRole('combobox', { name: /sort/i }), 'default');
			expect(onSortChange).toHaveBeenCalledWith('', '');
		});

		it('shows Title-based options for the films category', () => {
			renderControls({ category: 'films' });
			const select = screen.getByRole('combobox', { name: /sort/i }) as HTMLSelectElement;
			const values = Array.from(select.options).map((o) => o.value);
			expect(values).toContain('title-asc');
			expect(values).toContain('title-desc');
			expect(values).not.toContain('name-asc');
		});
	});

	describe('recent category badge', () => {
		it('is not rendered when recent is empty', () => {
			renderControls({ recent: '' });
			expect(screen.queryByText(/recent/i)).not.toBeInTheDocument();
		});

		it('displays the recent category name when set', () => {
			renderControls({ recent: 'starships' });
			expect(screen.getByText('starships')).toBeInTheDocument();
		});
	});

	// Accessibility
	describe('accessibility', () => {
		it('category and sort selects each have an associated <label>', () => {
			renderControls();
			expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();
			expect(screen.getByRole('combobox', { name: /sort/i })).toBeInTheDocument();
		});

		it('the search input has an associated <label>', () => {
			renderControls();
			expect(screen.getByRole('searchbox', { name: /search/i })).toBeInTheDocument();
		});

		it('all interactive controls are in the natural tab order', () => {
			renderControls();
			[
				screen.getByRole('combobox', { name: /category/i }),
				screen.getByRole('searchbox', { name: /search/i }),
				screen.getByRole('combobox', { name: /sort/i }),
			].forEach((el) => expect(el).not.toHaveAttribute('tabindex', '-1'));
		});
	});
});
