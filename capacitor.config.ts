import type { CapacitorConfig } from "@capacitor/cli";

// Native shell config for the Provider app. Providers are working people on
// their phones, not at a laptop -- this app is native-first, not a "web
// dashboard opened in a browser" (see docs/ARCHITECTURE.md). webDir points
// at the Vite production build; VITE_BASE_PATH must be unset for native
// builds (that env var only applies to the GitHub Pages web staging build,
// which still exists separately -- see .github/workflows/deploy-pages.yml).
const config: CapacitorConfig = {
  appId: "app.mombestie.provider",
  appName: "MomBestie Provider",
  webDir: "dist",
  android: {
    // Real device network calls (Supabase) must never be cleartext.
    allowMixedContent: false,
  },
};

export default config;
