// const withSass = require('@zeit/next-sass')
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});
module.exports = withBundleAnalyzer({});
