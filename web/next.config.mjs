import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config, { isServer, webpack }) {
    if (!isServer) {
      // MapLibre 6 uses a module worker with a relative shared-module import.
      // Emit both installed-version files together; no CDN or checked-in vendor copy.
      config.plugins.push({
        apply(compiler) {
          compiler.hooks.thisCompilation.tap("MapLibreWorkerAssets", compilation => {
            compilation.hooks.processAssets.tap(
              { name: "MapLibreWorkerAssets", stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL },
              () => {
                const packagePath = require.resolve("maplibre-gl/package.json");
                const version = JSON.parse(readFileSync(packagePath, "utf8")).version;
                const dist = join(dirname(packagePath), "dist");
                for (const name of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
                  compilation.emitAsset(`static/maplibre/${version}/${name}`, new webpack.sources.RawSource(readFileSync(join(dist, name))));
                }
              },
            );
          });
        },
      });
    }
    return config;
  },
  devIndicators: false,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  transpilePackages: ["lucide-react"],
  outputFileTracingIncludes: {
    "/*": [
      "./content/data/**/*.csv",
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            value: "geolocation=(self)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
