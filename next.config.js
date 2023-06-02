/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
        port: "",
        pathname: "/coins/images/**"
      }
      
      // coins/images/279/large/ethereum.png?1595348880

    ],
  },
}

module.exports = nextConfig
