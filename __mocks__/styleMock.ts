// Return the class name string itself so tests can query by role/label
// rather than by implementation-specific class names.
export default new Proxy({} as Record<string, string>, {
	get: (_target, prop) => String(prop),
});
