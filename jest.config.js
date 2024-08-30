const config = {
    verbose: true,
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    collectCoverageFrom: ['src/components/**/*.jsx'],
    transformIgnorePatterns: [
        'node_modules/(?!(react-leaflet|@react-leaflet/core)/)',
    ]
};

module.exports = config;
