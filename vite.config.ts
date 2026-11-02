import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  build: {
    // The app intentionally ships several heavy libraries (gsap, motion,
    // react-three-fiber, leaflet, supabase-js); a single-chunk bundle in the
    // 1-2 MB range is expected here, not a regression to chase.
    chunkSizeWarningLimit: 2600,
  },
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "favicon.svg",
      ],

      manifest: {
        name: "Scribes Global",
        short_name: "Scribes",
        description:
          "Scribes Global - Creative Arts Ministry",
        theme_color: "#4E0D85",
        background_color: "#F6F6F6",
        display: "standalone",
        orientation: "portrait-primary",

        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },

      workbox: {
        navigateFallback: "/index.html",

        // The app bundle (gsap + motion + three/R3F + leaflet + supabase-js)
        // exceeds Workbox's 2 MiB default precache limit; raise it instead of
        // silently dropping the main bundle from the precache manifest.
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,

        runtimeCaching: [
          {
            urlPattern:
              /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-stylesheets",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds:
                  60 * 60 * 24 * 365,
              },
            },
          },
          {
            urlPattern:
              /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds:
                  60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
    }),
  ],
});