import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'
import * as vueParser from 'vue-eslint-parser'

export default [
  // Base ESLint recommended rules
  js.configs.recommended,

  // Global settings for all files
  {
    languageOptions: {
      globals: {
        // Browser globals
        window: false,
        document: false,
        console: false,
        setTimeout: false,
        clearTimeout: false,
        setInterval: false,
        clearInterval: false,
        alert: false,
        // Node.js globals
        process: false,
        __dirname: false,
        __filename: false,
        require: false,
        module: false,
        exports: false,
        URL: false,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },

  // Vue.js rules
  {
    files: ['**/*.vue'],
    plugins: {
      vue,
      '@typescript-eslint': typescript,
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: typescriptParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      ...vue.configs.base.rules,
      ...vue.configs['vue3-recommended'].rules,
      'vue/multi-word-component-names': 'off',
      'vue/comment-directive': 'off', // Disable comment directive errors
      'vue/attributes-order': 'warn',
      'no-unused-vars': 'off', // Use TypeScript's version instead
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // TypeScript rules (for all .ts files)
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': typescript,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...typescript.configs['recommended'].rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/prefer-as-const': 'error',
      'no-undef': 'off', // TypeScript handles this
    },
  },

  // Additional rules for TypeScript files (excluding *.config.ts)
  {
    files: ['**/*.ts', '**/*.vue'],
    ignores: ['**/*.config.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['./', '../'],
              message: 'Relative imports are not allowed.',
            },
          ],
        },
      ],
    },
  },

  // Ignore patterns
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/.git/**', '**/coverage/**'],
  },
]
