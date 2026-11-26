import type { NextConfig } from "next";

// ELAMS là ứng dụng nội bộ, mọi trang phụ thuộc người đăng nhập: không dùng Cache Components.
const nextConfig: NextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: "11mb" }, // tệp đính kèm tối đa 10 MB (FR-GEN-13)
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
