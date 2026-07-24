module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',

  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],

  moduleNameMapper: {
    '^~(.*)$': '<rootDir>/src/$1',
    '@app(.*)': '<rootDir>/src/app/$1',
    '@core(.*)': '<rootDir>/src/app/core/$1',
    '@modules(.*)': '<rootDir>/src/app/modules/$1',
    '@shared(.*)': '<rootDir>/src/app/shared/$1',
    '@environments(.*)': '<rootDir>/src/environments/$1',
    '@data(.*)': '<rootDir>/src/app/data/$1',
    '@testing(.*)': '<rootDir>/src/app/shared/testing/$1',
  },

  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$|ol|quickselect|earcut|@petamoriken|pbf|rbush|quick-lru|lodash-es|marked|ngx-markdown|color-(space|parse|rgba|name)|crypto-random-string/)'
  ],
};
