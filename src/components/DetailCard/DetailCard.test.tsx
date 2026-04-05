import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DetailCard from './DetailCard';

// UrlChip uses useRouter for navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
	useRouter: () => ({ push: mockPush }),
}));

beforeEach(() => mockPush.mockClear());

describe('DetailCard', () => {
	describe('field label', () => {
		it('renders snake_case keys as space-separated words', () => {
			render(<DetailCard fieldKey="birth_year" value="19BBY" />);
			expect(screen.getByText('birth year')).toBeInTheDocument();
		});

		it('renders a single-word key as-is', () => {
			render(<DetailCard fieldKey="climate" value="arid" />);
			expect(screen.getByText('climate')).toBeInTheDocument();
		});
	});

	describe('plain value rendering', () => {
		it('renders a plain string value', () => {
			render(<DetailCard fieldKey="name" value="Luke Skywalker" />);
			expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
		});

		it('renders a numeric value as a string', () => {
			render(<DetailCard fieldKey="episode_id" value={4} />);
			expect(screen.getByText('4')).toBeInTheDocument();
		});

		it('renders "—" for null values', () => {
			render(<DetailCard fieldKey="homeworld" value={null} />);
			expect(screen.getByText('—')).toBeInTheDocument();
		});

		it('renders "—" for empty string values', () => {
			render(<DetailCard fieldKey="homeworld" value="" />);
			expect(screen.getByText('—')).toBeInTheDocument();
		});
	});

	describe('date field formatting', () => {
		it('formats the "created" field as a human-readable date', () => {
			render(<DetailCard fieldKey="created" value="2014-12-09T13:50:51.644000Z" />);
			// formatDate uses toLocaleDateString; just assert the raw ISO string is gone
			expect(screen.queryByText('2014-12-09T13:50:51.644000Z')).not.toBeInTheDocument();
			expect(screen.getByText(/2014/)).toBeInTheDocument();
		});

		it('formats the "edited" field the same way', () => {
			render(<DetailCard fieldKey="edited" value="2014-12-20T21:17:56.891000Z" />);
			expect(screen.queryByText('2014-12-20T21:17:56.891000Z')).not.toBeInTheDocument();
			expect(screen.getByText(/2014/)).toBeInTheDocument();
		});
	});

	describe('opening crawl', () => {
		it('renders the opening_crawl field inside a <pre> element', () => {
			render(<DetailCard fieldKey="opening_crawl" value="It is a period of civil war..." />);
			const pre = screen.getByText(/civil war/);
			expect(pre.tagName).toBe('PRE');
		});
	});

	describe('SWAPI URL value', () => {
		it('renders a single SWAPI URL as a clickable UrlChip button', () => {
			render(<DetailCard fieldKey="homeworld" value="https://swapi.dev/api/planets/1/" />);
			expect(screen.getByRole('button', { name: /planet 1/i })).toBeInTheDocument();
		});

		it('navigates to the correct path when the UrlChip is clicked', async () => {
			render(<DetailCard fieldKey="homeworld" value="https://swapi.dev/api/planets/1/" />);
			await userEvent.click(screen.getByRole('button', { name: /planet 1/i }));
			expect(mockPush).toHaveBeenCalledWith('/planets/1');
		});
	});

	describe('SWAPI URL array value', () => {
		const urls = [
			'https://swapi.dev/api/films/1/',
			'https://swapi.dev/api/films/2/',
		];

		it('renders one UrlChip button per URL', () => {
			render(<DetailCard fieldKey="films" value={urls} />);
			expect(screen.getAllByRole('button')).toHaveLength(2);
		});

		it('each chip navigates to the correct path on click', async () => {
			render(<DetailCard fieldKey="films" value={urls} />);
			await userEvent.click(screen.getByRole('button', { name: /film 1/i }));
			expect(mockPush).toHaveBeenCalledWith('/films/1');
		});
	});

	// Accessibility
	describe('accessibility', () => {
		it('uses a <dt> for the field label inside a <dl>', () => {
			const { container } = render(<DetailCard fieldKey="gender" value="male" />);
			expect(container.querySelector('dt')).toBeInTheDocument();
		});

		it('uses a <dd> for the field value inside a <dl>', () => {
			const { container } = render(<DetailCard fieldKey="gender" value="male" />);
			expect(container.querySelector('dd')).toBeInTheDocument();
		});

		it('UrlChip buttons have an accessible aria-label', () => {
			render(<DetailCard fieldKey="homeworld" value="https://swapi.dev/api/planets/1/" />);
			const btn = screen.getByRole('button');
			expect(btn).toHaveAttribute('aria-label');
			expect(btn.getAttribute('aria-label')).toMatch(/planet 1/i);
		});
	});
});
