/**
 * Prettier 配置 - 代码格式化规则
 * 与 ESLint 协同工作，专注于代码格式
 */

module.exports = {
  // 基础设置
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  
  // 语法设置
  semi: false,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  
  // 尾随逗号
  trailingComma: 'es5',
  
  // 括号和空格
  bracketSpacing: true,
  bracketSameLine: false,
  jsxBracketSameLine: false,
  
  // 箭头函数
  arrowParens: 'avoid',
  
  // 换行符
  endOfLine: 'lf',
  
  // HTML 相关
  htmlWhitespaceSensitivity: 'css',
  
  // Vue 相关（虽然不使用，但保留配置）
  vueIndentScriptAndStyle: false,
  
  // 嵌入式语言格式化
  embeddedLanguageFormatting: 'auto',
  
  // 插件配置
  plugins: [
    'prettier-plugin-tailwindcss', // Tailwind CSS 类排序
  ],
  
  // 文件特定配置
  overrides: [
    // JSON 文件
    {
      files: ['*.json', '*.jsonc'],
      options: {
        trailingComma: 'none',
        printWidth: 120,
      },
    },
    
    // Markdown 文件
    {
      files: ['*.md', '*.mdx'],
      options: {
        printWidth: 80,
        proseWrap: 'always',
        tabWidth: 2,
        useTabs: false,
        singleQuote: false,
        bracketSpacing: true,
      },
    },
    
    // YAML 文件
    {
      files: ['*.yml', '*.yaml'],
      options: {
        tabWidth: 2,
        singleQuote: true,
        printWidth: 120,
      },
    },
    
    // HTML 文件
    {
      files: ['*.html'],
      options: {
        printWidth: 120,
        tabWidth: 2,
        htmlWhitespaceSensitivity: 'ignore',
      },
    },
    
    // CSS/SCSS 文件
    {
      files: ['*.css', '*.scss', '*.sass'],
      options: {
        printWidth: 120,
        singleQuote: false,
      },
    },
    
    // 配置文件
    {
      files: [
        '.eslintrc.js',
        '.prettierrc.js',
        'prettier.config.js',
        'tailwind.config.js',
        'next.config.js',
        'jest.config.js',
        'playwright.config.js',
      ],
      options: {
        printWidth: 120,
        semi: false,
        singleQuote: true,
        trailingComma: 'es5',
      },
    },
    
    // Package.json
    {
      files: ['package.json'],
      options: {
        printWidth: 120,
        tabWidth: 2,
        useTabs: false,
        semi: false,
        singleQuote: false,
        trailingComma: 'none',
      },
    },
    
    // TypeScript 类型定义文件
    {
      files: ['*.d.ts'],
      options: {
        printWidth: 120,
        semi: false,
        singleQuote: true,
      },
    },
    
    // 测试文件
    {
      files: [
        '**/__tests__/**/*.{js,jsx,ts,tsx}',
        '**/*.{test,spec}.{js,jsx,ts,tsx}',
        '**/e2e/**/*.{js,ts}',
      ],
      options: {
        printWidth: 120,
        semi: false,
        singleQuote: true,
        trailingComma: 'es5',
      },
    },
  ],
  
  // Tailwind CSS 插件配置
  tailwindConfig: './tailwind.config.js',
  tailwindFunctions: ['clsx', 'cn', 'cva'],
  
  // 忽略文件（通过 .prettierignore 文件处理）
}