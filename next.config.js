if (process.env.BREAK_BUILD === "true") {
  throw new Error("Intentional build failure: BREAK_BUILD=true");
}

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;
