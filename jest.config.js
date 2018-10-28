module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globalTeardown: "./jestMockScreepsServerTeardown.js"
};