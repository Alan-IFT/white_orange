/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // 颜色系统
      colors: {
        // 主色调 - 橙色系
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // 背景色
        background: {
          DEFAULT: '#ffffff',
          secondary: '#f8fafc',
          tertiary: '#f1f5f9',
        },
        // 文字色
        foreground: {
          DEFAULT: '#0f172a',
          secondary: '#475569',
          tertiary: '#64748b',
          muted: '#94a3b8',
        },
        // 边框色
        border: {
          DEFAULT: '#e2e8f0',
          secondary: '#cbd5e1',
        },
        // 卡片色
        card: {
          DEFAULT: '#ffffff',
          secondary: '#f8fafc',
        },
        // 输入框色
        input: {
          DEFAULT: '#ffffff',
          border: '#d1d5db',
        },
        // 状态色
        success: {
          DEFAULT: '#10b981',
          light: '#d1fae5',
          dark: '#047857',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fef3c7',
          dark: '#d97706',
        },
        error: {
          DEFAULT: '#ef4444',
          light: '#fee2e2',
          dark: '#dc2626',
        },
        info: {
          DEFAULT: '#3b82f6',
          light: '#dbeafe',
          dark: '#1d4ed8',
        },
        // 暗黑模式色彩
        dark: {
          background: '#0f172a',
          'background-secondary': '#1e293b',
          'background-tertiary': '#334155',
          foreground: '#f1f5f9',
          'foreground-secondary': '#cbd5e1',
          'foreground-tertiary': '#64748b',
          border: '#334155',
          card: '#1e293b',
          input: '#334155',
        },
      },
      
      // 字体系统
      fontFamily: {
        sans: [
          'Inter',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Source Code Pro',
          'ui-monospace',
          'SFMono-Regular',
          'monospace',
        ],
        heading: [
          'Inter',
          'PingFang SC',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
      
      // 字体大小
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      
      // 行高
      lineHeight: {
        3: '.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.5rem',
      },
      
      // 间距系统
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
        144: '36rem',
      },
      
      // 最大宽度
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      
      // 断点
      screens: {
        xs: '475px',
        '3xl': '1600px',
      },
      
      // 阴影
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'glow': '0 0 20px rgb(249 115 22 / 0.15)',
        'glow-lg': '0 0 40px rgb(249 115 22 / 0.2)',
      },
      
      // 圆角
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      
      // 动画
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      
      // 关键帧
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      
      // 过渡
      transitionDuration: {
        400: '400ms',
        600: '600ms',
        800: '800ms',
        900: '900ms',
      },
      
      // 缓动函数
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ease-in-out-back': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      
      // 背景渐变
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      
      // 版式
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#374151',
            lineHeight: '1.7',
            fontSize: '1rem',
            h1: {
              fontSize: '2.25rem',
              fontWeight: '800',
              lineHeight: '1.1',
              marginBottom: '1rem',
            },
            h2: {
              fontSize: '1.875rem',
              fontWeight: '700',
              lineHeight: '1.2',
              marginTop: '2rem',
              marginBottom: '1rem',
            },
            h3: {
              fontSize: '1.5rem',
              fontWeight: '600',
              lineHeight: '1.3',
              marginTop: '1.5rem',
              marginBottom: '0.5rem',
            },
            h4: {
              fontSize: '1.25rem',
              fontWeight: '600',
              lineHeight: '1.4',
              marginTop: '1.5rem',
              marginBottom: '0.5rem',
            },
            p: {
              marginBottom: '1rem',
            },
            ul: {
              marginBottom: '1rem',
            },
            ol: {
              marginBottom: '1rem',
            },
            li: {
              marginBottom: '0.5rem',
            },
            blockquote: {
              fontStyle: 'italic',
              borderLeftWidth: '4px',
              borderLeftColor: '#f97316',
              paddingLeft: '1rem',
              marginBottom: '1rem',
            },
            code: {
              backgroundColor: '#f1f5f9',
              padding: '0.125rem 0.25rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              fontWeight: '600',
            },
            pre: {
              backgroundColor: '#0f172a',
              color: '#f1f5f9',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflow: 'auto',
              marginBottom: '1rem',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
              borderRadius: '0',
              fontSize: '0.875rem',
              fontWeight: '400',
            },
          },
        },
        dark: {
          css: {
            color: '#cbd5e1',
            h1: { color: '#f1f5f9' },
            h2: { color: '#f1f5f9' },
            h3: { color: '#f1f5f9' },
            h4: { color: '#f1f5f9' },
            code: {
              backgroundColor: '#334155',
              color: '#f1f5f9',
            },
            blockquote: {
              color: '#94a3b8',
            },
          },
        },
      },
    },
  },
  plugins: [
    // 官方插件
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
    
    // 自定义插件
    function ({ addUtilities, addComponents, addBase, theme }) {
      // 添加基础样式
      addBase({
        'html': {
          fontFamily: theme('fontFamily.sans'),
        },
        'body': {
          backgroundColor: theme('colors.background.DEFAULT'),
          color: theme('colors.foreground.DEFAULT'),
        },
        '.dark body': {
          backgroundColor: theme('colors.dark.background'),
          color: theme('colors.dark.foreground'),
        },
      });
      
      // 添加组件样式
      addComponents({
        '.btn': {
          padding: theme('spacing.2') + ' ' + theme('spacing.4'),
          borderRadius: theme('borderRadius.md'),
          fontWeight: theme('fontWeight.medium'),
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        '.btn-primary': {
          backgroundColor: theme('colors.primary.500'),
          color: theme('colors.white'),
          '&:hover': {
            backgroundColor: theme('colors.primary.600'),
          },
        },
        '.btn-secondary': {
          backgroundColor: theme('colors.gray.200'),
          color: theme('colors.gray.800'),
          '&:hover': {
            backgroundColor: theme('colors.gray.300'),
          },
        },
        '.card': {
          backgroundColor: theme('colors.card.DEFAULT'),
          borderRadius: theme('borderRadius.lg'),
          boxShadow: theme('boxShadow.md'),
          padding: theme('spacing.6'),
        },
        '.dark .card': {
          backgroundColor: theme('colors.dark.card'),
        },
      });
      
      // 添加工具类
      addUtilities({
        '.text-gradient': {
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
        '.glass': {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        '.dark .glass': {
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        },
      });
    },
  ],
};