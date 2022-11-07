const dev = process.env.NODE_ENV !== 'production';

export const server = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : dev
  ? 'http://localhost:3000'
  : 'https://stuco-surveys.vercel.app';
