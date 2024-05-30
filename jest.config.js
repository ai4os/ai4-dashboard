module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    globalSetup: 'jest-preset-angular/global-setup',
    modulePaths: ['<rootDir>', '/home/some/other/path'],
    moduleNameMapper: {
        "^~(.*)$": "<rootDir>/src/$1",
        "@app(.*)": "<rootDir>/src/app/$1",
        "@core(.*)": "<rootDir>/src/app/core/$1",
        "@modules(.*)": "<rootDir>/src/app/modules/$1",
        "@shared(.*)": "<rootDir>/src/app/shared/$1",
        "@environments(.*)": "<rootDir>/src/environments/$1",
        "@data(.*)": "<rootDir>/src/app/data/$1",
        '^@grycap/oscar-js$':
            '<rootDir>/src/app/modules/marketplace/services/modules-service/oscar-module.mock.ts',
      },
      transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|ol|quick-lru|lodash-es|color-(space|parse|rgba|name)|crypto-random-string/)']};
