import type { Config } from 'tailwindcss';
import { typography } from './typography';

export default {
  theme: {
    extend: {
      typography: () => ({
        sm: typography({ fontSize: 14, lineHeight: 24 }),
        DEFAULT: {
          css: {
            ...typography({ fontSize: 16, lineHeight: 28 }).css,
            '--tw-prose-body': 'var(--color-foreground)',
            '--tw-prose-headings': 'var(--color-foreground)',
            '--tw-prose-lead': 'var(--color-muted-foreground)',
            '--tw-prose-links': 'var(--color-primary)',
            '--tw-prose-bold': 'var(--color-foreground)',
            '--tw-prose-counters': 'var(--color-muted-foreground)',
            '--tw-prose-bullets': 'var(--color-border)',
            '--tw-prose-hr': 'var(--color-border)',
            '--tw-prose-quotes': 'var(--color-foreground)',
            '--tw-prose-quote-borders': 'var(--color-border)',
            '--tw-prose-captions': 'var(--color-muted-foreground)',
            '--tw-prose-kbd': 'var(--color-foreground)',
            '--tw-prose-kbd-shadows': '0 1px 0 var(--color-muted)',
            '--tw-prose-code': 'var(--color-foreground)',
            '--tw-prose-pre-code': 'var(--color-card-foreground)',
            '--tw-prose-pre-bg': 'var(--color-card)',
            '--tw-prose-th-borders': 'var(--color-border)',
            '--tw-prose-td-borders': 'var(--color-border)',
          },
        },
        lg: typography({ fontSize: 18, lineHeight: 32 }),
        xl: typography({ fontSize: 20, lineHeight: 36 }),
        '2xl': typography({ fontSize: 24, lineHeight: 40 }),
      }),
    },
  },
} as Config;
