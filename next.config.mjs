/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
  // experimental: {
  //   turbo: {
  //     resolveAlias: {
  //       canvas: { browser: './empty.js' },
  //     },
  //   },
  // },
  // webpack: (config) => {
  //   config.externals = [...config.externals, { canvas: 'canvas' }]; // required to make Konva & react-konva work
  //   return config;
  // },
};

export default nextConfig;
