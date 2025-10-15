module.exports = {
    preset: 'ts-jest',
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    transformIgnorePatterns: [
        "node_modules/(?!@faker-js/faker)"
    ],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
        '^tests/(.*)$': '<rootDir>/tests/$1',
    }
};
