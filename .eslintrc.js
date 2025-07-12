/**
 * ESLint 配置 - 简化版本，专注于核心规则
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
  },
  
  // 环境配置
  env: {
    browser: true,
    es2024: true,
    node: true,
  },
  
  // 扩展配置 (简化)
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
  ],
  
  // 插件
  plugins: [
    '@typescript-eslint',
  ],
  
  // 设置
  settings: {
    react: {
      version: '19.1.0',
    },
  },
  
  // 简化的规则配置
  rules: {
    // TypeScript 基本规则
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/ban-types': 'warn',
    
    // React 基本规则
    'react/react-in-jsx-scope': 'off', // React 17+ 不需要
    'react/prop-types': 'off', // 使用 TypeScript
    
    // 通用规则 (放宽生产环境要求)
    'no-console': 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-var': 'error',
    'prefer-const': 'error',
  },
  
  // 覆盖配置
  overrides: [
    // 配置文件
    {
      files: [
        '*.config.js',
        '*.config.ts',
        '.eslintrc.js',
      ],
      env: {
        node: true,
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'no-console': 'off',
      },
    },
    // 库文件 - 放宽限制
    {
      files: [
        'lib/**/*.ts',
        'lib/**/*.js',
      ],
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-var-requires': 'off',
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
  ],
}