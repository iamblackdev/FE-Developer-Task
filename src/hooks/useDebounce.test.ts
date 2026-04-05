import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
	afterEach(() => jest.clearAllTimers());

	it('returns the initial value immediately without waiting', () => {
		const { result } = renderHook(() => useDebounce('hello', 300));
		expect(result.current).toBe('hello');
	});

	it('does not propagate a new value before the delay has elapsed', () => {
		const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
			initialProps: { value: 'a' },
		});

		rerender({ value: 'ab' });
		act(() => jest.advanceTimersByTime(299));

		expect(result.current).toBe('a');
	});

	it('propagates the new value after the delay has elapsed', () => {
		const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
			initialProps: { value: 'a' },
		});

		rerender({ value: 'ab' });
		act(() => jest.advanceTimersByTime(300));

		expect(result.current).toBe('ab');
	});

	it('only applies the final value when inputs arrive faster than the delay', () => {
		const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
			initialProps: { value: 'a' },
		});

		rerender({ value: 'ab' });
		act(() => jest.advanceTimersByTime(100));
		rerender({ value: 'abc' });
		act(() => jest.advanceTimersByTime(100));
		rerender({ value: 'abcd' });
		act(() => jest.advanceTimersByTime(300));

		expect(result.current).toBe('abcd');
	});
});
