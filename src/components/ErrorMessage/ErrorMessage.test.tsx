import { render, screen } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage', () => {
	it('renders the message text', () => {
		render(<ErrorMessage message="Something went wrong." />);
		expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
	});

	it('renders different messages correctly', () => {
		render(<ErrorMessage message="Network error: 404" />);
		expect(screen.getByText('Network error: 404')).toBeInTheDocument();
	});

	// Accessibility
	it('has role="alert" so screen readers announce it immediately', () => {
		render(<ErrorMessage message="Oops" />);
		expect(screen.getByRole('alert')).toBeInTheDocument();
	});

	it('contains the message text inside the alert region', () => {
		render(<ErrorMessage message="Failed to load." />);
		const alert = screen.getByRole('alert');
		expect(alert).toHaveTextContent('Failed to load.');
	});
});
