module.exports = {
  target: "serverless",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/register",
        permanent: true,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['blocommerce-logo.s3.amazonaws.com'],
  },
};
