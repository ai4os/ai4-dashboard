const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const eslintPluginPrettier = require('eslint-plugin-prettier');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = defineConfig([
    {
        ignores: ['dist/**', 'e2e/**', 'projects/**/*', 'commitlint.config.js'],
    },

    {
        files: ['**/*.ts'],
        extends: [
            eslint.configs.recommended,
            tseslint.configs.recommended,
            tseslint.configs.stylistic,
            angular.configs.tsRecommended,
            eslintConfigPrettier,
        ],
        processor: angular.processInlineTemplates,
        plugins: {
            prettier: eslintPluginPrettier,
        },
        rules: {
            'prettier/prettier': 'warn',

            '@angular-eslint/directive-selector': [
                'error',
                {
                    type: 'attribute',
                    prefix: 'app',
                    style: 'camelCase',
                },
            ],

            '@angular-eslint/component-selector': [
                'error',
                {
                    type: 'element',
                    prefix: 'app',
                    style: 'kebab-case',
                },
            ],

            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '_',
                    varsIgnorePattern: '_',
                },
            ],

            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },

    {
        files: ['**/*.html'],
        extends: [
            angular.configs.templateRecommended,
            angular.configs.templateAccessibility,
        ],
        rules: {},
    },
]);