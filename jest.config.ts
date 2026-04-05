import type { Config } from 'jest';

const config: Config = {
	testEnvironment: 'jest-fixed-jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	transform: {
		'^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
	},
	moduleNameMapper: {
		// CSS Modules → identity proxy so class lookups don't throw
		'\\.module\\.css$': '<rootDir>/__mocks__/styleMock.ts',
		// Resolve the @ path alias
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	testMatch: ['**/*.test.ts', '**/*.test.tsx'],
};

export default config;
