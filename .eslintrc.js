/**
 * ESLint 配置 - Next.js 15.3.5+ & React 19.1.0+ 兼容
 * 基于官方推荐配置和最佳实践
 */

module.exports = {
  root: true,
  
  // 解析器配置
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  
  // 环境配置
  env: {
    browser: true,
    es2024: true,
    node: true,
    jest: true,
  },
  
  // 全局变量
  globals: {
    React: 'readonly',
    JSX: 'readonly',
  },
  
  // 扩展配置
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking',
    'next/core-web-vitals',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier', // 必须放在最后
  ],
  
  // 插件
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
    'unused-imports',
    'prefer-arrow',
  ],
  
  // 设置
  settings: {
    react: {
      version: '19.1.0',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  
  // 规则配置
  rules: {
    // === TypeScript 规则 ===
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/prefer-const': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': 'allow-with-description',
        'ts-nocheck': 'allow-with-description',
        'ts-check': 'allow-with-description',
      },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: false,
      },
    ],
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/array-type': ['error', { default: 'array' }],
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/no-unnecessary-condition': 'warn',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/prefer-readonly': 'error',
    '@typescript-eslint/require-array-sort-compare': 'error',
    
    // === React 规则 ===
    'react/react-in-jsx-scope': 'off', // React 17+ 不需要
    'react/prop-types': 'off', // 使用 TypeScript
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'react/jsx-filename-extension': [
      'error',
      { extensions: ['.tsx', '.jsx'] },
    ],
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/jsx-key': ['error', { checkFragmentShorthand: true }],
    'react/no-array-index-key': 'warn',
    'react/jsx-boolean-value': ['error', 'never'],
    'react/jsx-curly-brace-presence': [
      'error',
      { props: 'never', children: 'never' },
    ],
    'react/self-closing-comp': 'error',
    'react/jsx-sort-props': [
      'error',
      {
        callbacksLast: true,
        shorthandFirst: true,
        multiline: 'last',
        reservedFirst: true,
      },
    ],
    'react/jsx-pascal-case': 'error',
    'react/no-unstable-nested-components': 'error',
    'react/destructuring-assignment': ['error', 'always'],
    
    // === React Hooks 规则 ===
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // === Import 规则 ===
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'next/**',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@/**',
            group: 'internal',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react', 'next'],
      },
    ],
    'import/no-unresolved': 'error',
    'import/no-cycle': 'error',
    'import/no-self-import': 'error',
    'import/no-useless-path-segments': 'error',
    'import/no-duplicates': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-anonymous-default-export': [
      'error',
      {
        allowArray: false,
        allowArrowFunction: false,
        allowAnonymousClass: false,
        allowAnonymousFunction: false,
        allowCallExpression: true,
        allowLiteral: false,
        allowObject: true,
      },
    ],
    
    // === 未使用导入清理 ===
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    
    // === 箭头函数偏好 ===
    'prefer-arrow/prefer-arrow-functions': [
      'error',
      {
        disallowPrototype: true,
        singleReturnOnly: false,
        classPropertiesAllowed: false,
      },
    ],
    
    // === 可访问性规则 ===
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    'jsx-a11y/alt-text': [
      'error',
      {
        elements: ['img', 'object', 'area', 'input[type="image"]'],
        img: ['Image'],
        object: ['Object'],
        area: ['Area'],
        'input[type="image"]': ['InputImage'],
      },
    ],
    'jsx-a11y/no-autofocus': ['error', { ignoreNonDOM: true }],
    
    // === Next.js 特定规则 ===
    '@next/next/no-html-link-for-pages': 'error',
    '@next/next/no-img-element': 'error',
    '@next/next/no-page-custom-font': 'error',
    '@next/next/no-sync-scripts': 'error',
    '@next/next/no-title-in-document-head': 'error',
    '@next/next/no-unwanted-polyfillio': 'error',
    
    // === 通用规则 ===
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-alert': 'warn',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-template': 'error',
    'object-shorthand': 'error',
    'no-duplicate-imports': 'error',
    'no-useless-rename': 'error',
    'no-useless-computed-key': 'error',
    'no-unneeded-ternary': 'error',
    'spaced-comment': ['error', 'always', { markers: ['/'] }],
    'prefer-destructuring': [
      'error',
      {
        array: true,
        object: true,
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'no-nested-ternary': 'error',
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
    'eol-last': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'semi': ['error', 'never'],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'jsx-quotes': ['error', 'prefer-double'],
    
    // === 性能相关规则 ===
    'no-await-in-loop': 'warn',
    'require-atomic-updates': 'error',
    
    // === 安全相关规则 ===
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
  },
  
  // 覆盖配置
  overrides: [
    // TypeScript 文件特定规则
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'no-undef': 'off', // TypeScript 处理
        '@typescript-eslint/explicit-function-return-type': [
          'warn',
          {
            allowExpressions: true,
            allowHigherOrderFunctions: true,
            allowTypedFunctionExpressions: true,
            allowDirectConstAssertionInArrowFunctions: true,
          },
        ],
      },
    },
    
    // 测试文件
    {
      files: [
        '**/__tests__/**/*',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/e2e/**/*',
      ],
      env: {
        jest: true,
        'jest/globals': true,
      },
      extends: ['plugin:jest/recommended', 'plugin:testing-library/react'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        'import/no-extraneous-dependencies': 'off',
        'prefer-arrow/prefer-arrow-functions': 'off',
      },
    },
    
    // 配置文件
    {
      files: [
        '*.config.js',
        '*.config.ts',
        '.eslintrc.js',
        'jest.setup.js',
        'jest.resolver.js',
      ],
      env: {
        node: true,
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'import/no-extraneous-dependencies': 'off',
        'prefer-arrow/prefer-arrow-functions': 'off',
      },
    },
    
    // MDX 文件
    {
      files: ['**/*.mdx'],
      extends: ['plugin:mdx/recommended'],
      rules: {
        'react/jsx-no-undef': 'off',
      },
    },
    
    // 脚本文件
    {
      files: ['scripts/**/*'],
      env: {
        node: true,
      },
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'prefer-arrow/prefer-arrow-functions': 'off',
      },
    },
  ],
  
  // 忽略模式
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'dist/',
    'build/',
    'coverage/',
    'public/',
    '*.min.js',
    '*.bundle.js',
    'test-results/',
    'playwright-report/',
    '.cache/',
    'storybook-static/',
  ],
}