import type { NextConfig } from "next";

/* O destino do proxy para a API: em desenvolvimento o backend roda na 3000;
   em produção basta definir API_URL (ex.: http://127.0.0.1:3001) no build. */
const API_ORIGIN = process.env.API_URL ?? "http://localhost:3000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_ORIGIN}/:path*`,
      },
      {
        /* Uploaded/generated images live on the API disk; the browser
           loads them from the same origin, so proxy them too. */
        source: "/uploads/:path*",
        destination: `${API_ORIGIN}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
