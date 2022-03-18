module.exports = {
    roots: ['<rootDir>'],
    transform: {
        '^.+\\.ts?$': 'ts-jest'
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    collectCoverage: true,
    clearMocks: true,
    transformIgnorePatterns: [
        '<rootDir>/node_modules/'
    ],
    coverageDirectory: 'coverage',
    moduleNameMapper: {
        '^lodash-es$': 'lodash',
        '^@/(.*)$': '<rootDir>/src/$1'
    },

    // js slow
    // s-tip : https://stackoverflow.com/questions/45087018/jest-simple-tests-are-slow
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            isolatedModules: true
        }
    }
};