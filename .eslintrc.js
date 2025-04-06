module.exports = {
  parser: '@typescript-eslint/parser', // Specify the ESLint parser for TypeScript
  parserOptions: {
    project: 'tsconfig.json', // Path to your TypeScript configuration
    tsconfigRootDir: __dirname, // Set the root directory for tsconfig
    sourceType: 'module', // Ensure modules are handled correctly
  },
  plugins: ['@typescript-eslint/eslint-plugin'], // Enable the TypeScript ESLint plugin
  extends: [
    'eslint:recommended', // Basic ESLint rules
    'plugin:@typescript-eslint/recommended', // Recommended rules from @typescript-eslint
    'plugin:prettier/recommended', // Prettier integration (if you're using Prettier for code formatting)
    'plugin:node/recommended', // Node.js specific rules (optional, if you're building a Node app)
    'plugin:jest/recommended', // Jest-specific linting rules for testing (if you're using Jest)
  ],
  root: true, // Mark the current directory as the root for the ESLint configuration
  env: {
    node: true, // Node.js environment
    jest: true, // Jest environment for testing
    es6: true, // Enable ES6 features
  },
  ignorePatterns: ['.eslintrc.js'], // Ignore the ESLint config file itself
  rules: {
    // TypeScript specific rules
    '@typescript-eslint/interface-name-prefix': 'off', // Disable the rule for interface naming prefixes (e.g., IInterface)
    '@typescript-eslint/explicit-function-return-type': 'warn', // Warn if function return types are not explicitly defined
    '@typescript-eslint/explicit-module-boundary-types': 'warn', // Warn for missing module boundaries (e.g., return types for exported functions)
    '@typescript-eslint/no-explicit-any': 'warn', // Warn about usage of 'any' type, encouraging better type safety

    // Code style rules
    'no-console': 'warn', // Warn about console statements (you can turn this off if you want to allow it)
    'no-debugger': 'warn', // Warn about debugger statements
    'no-trailing-spaces': 'error', // Disallow trailing spaces
    'semi': ['error', 'always'], // Enforce semicolons at the end of statements
    'quotes': ['error', 'single'], // Enforce the use of single quotes
    'eol-last': ['error', 'always'], // Ensure files end with a newline
    'indent': ['error', 2], // Enforce 2-space indentation
    'brace-style': ['error', '1tbs'], // Use the "one true brace style" for blocks
    'camelcase': 'error', // Enforce camelCase naming convention for variables and functions

    // Best practices
    'consistent-return': 'error', // Ensure functions either always or never return a value
    'curly': ['error', 'all'], // Enforce curly braces for all control structures
    'no-undef': 'error', // Disallow the use of undefined variables
    'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }], // Warn about unused variables except when prefixed with '_'
    'no-var': 'error', // Disallow the use of 'var', prefer 'let' or 'const'
    'prefer-const': 'error', // Enforce 'const' when variables are not reassigned

    // Node.js specific rules (if you're working with Node.js)
    'node/no-missing-import': 'error', // Ensure proper imports in Node.js modules
    'node/no-unpublished-import': 'error', // Ensure imports are from published packages

    // Jest specific rules (if you're using Jest for testing)
    'jest/no-disabled-tests': 'warn', // Warn about disabled tests (e.g., test.skip)
    'jest/no-focused-tests': 'error', // Error if there are focused tests (e.g., test.only)
    'jest/no-identical-title': 'error', // Error if there are tests with identical titles
    'jest/prefer-to-have-length': 'warn', // Prefer assertions like toHaveLength over explicit length checks
    'jest/valid-expect': 'error', // Ensure expect statements are valid in tests

    // Formatting rules (if using Prettier)
    'prettier/prettier': 'error', // Ensure that Prettier formatting rules are followed (optional if you're using Prettier)

    // Override rules for certain file types
    'import/no-unresolved': 'error', // Ensure imports are resolved
    'import/named': 'error', // Ensure named imports are correct
  },
};
