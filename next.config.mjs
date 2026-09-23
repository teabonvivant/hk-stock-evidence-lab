const nextConfig = {
  reactStrictMode: true,
  ...(process.env.GITHUB_PAGES === "true" ? {
    output: "export",
    basePath: "/hk-stock-evidence-lab",
    trailingSlash: true,
    images: { unoptimized: true },
  } : {}),
};

export default nextConfig;
