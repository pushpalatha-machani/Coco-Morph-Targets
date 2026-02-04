import defaultColors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  safelist: [
    {
      pattern: /bg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
    {
      pattern: /bg-(white|black|transparent)/,
    }
  ],

  theme: {
    extend: {
      colors: {
        // Merge all default Tailwind colors into the theme
        ...defaultColors,
        primary: { DEFAULT: "hsl(var(--primary))" },

        // custom Shadcn / UI variables
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },

  plugins: [
    function ({ addBase, theme }) {
      const allColors = theme('colors');
      const rootVars = {};

      Object.entries(allColors).forEach(([colorName, colorValue]) => {
        if (colorValue && typeof colorValue === 'object') {
          Object.entries(colorValue).forEach(([shade, value]) => {
            rootVars[`--tw-color-${colorName}-${shade}`] = value;
          });
        } else if (typeof colorValue === 'string') {
          rootVars[`--tw-color-${colorName}`] = colorValue;
        }
      });

      addBase({ ':root': rootVars });
    },
  ],
}