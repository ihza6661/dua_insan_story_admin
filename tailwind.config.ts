import { Lato } from 'next/font/google';

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
});

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        lato: ['var(--font-lato)'],
      },
    },
  },
  plugins: [],
};
