const dev = process.env.NODE_ENV !== 'production';

export const server = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : dev
  ? 'http://localhost:3000'
  : 'https://stuco-surveys.vercel.app';
