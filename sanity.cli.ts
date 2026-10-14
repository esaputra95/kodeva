import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "77o8k6wz",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
});
