/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    relay: {
      src: './',
      language: 'typescript',
      artifactDirectory: './src/__generated__',
    },
  },
};

module.exports = nextConfig;
