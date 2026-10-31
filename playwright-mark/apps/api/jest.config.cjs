module.exports = {
    testEnvironment: 'node',
    testMatch: ['<rootDir>/src/__tests__/**/*.test.js'],
    setupFiles: ['<rootDir>/jest.setup.cjs'],
    testTimeout: 10000,
}
