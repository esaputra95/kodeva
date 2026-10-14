import "server-only";

import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-03-01";

export const sanityClient =
  projectId && dataset
    ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published" })
    : null;

export const sanityProjectReady = Boolean(projectId && dataset);
