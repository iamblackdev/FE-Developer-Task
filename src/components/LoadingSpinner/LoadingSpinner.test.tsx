import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
	it('renders the default label when no prop is given', () => {
		render(<LoadingSpinner />);
		expect(screen.getByText('Loading…')).toBeInTheDocument();
	});

	it('renders a custom label', () => {
		render(<LoadingSpinner label="Fetching planets…" />);
		expect(screen.getByText('Fetching planets…')).toBeInTheDocument();
	});

	// Accessibility
	it('has role="status" so screen readers announce it politely', () => {
		render(<LoadingSpinner />);
		expect(screen.getByRole('status')).toBeInTheDocument();
	});

	it('has aria-live="polite" on the status container', () => {
		render(<LoadingSpinner />);
		expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
	});
});
