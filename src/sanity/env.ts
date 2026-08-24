/** Server and public Sanity configuration. Never add credentials to this file. */
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-06-29';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const readToken = process.env.SANITY_API_READ_TOKEN;
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const useCdn = process.env.NODE_ENV === 'production' && !readToken;

export const hasValidSanityConfig = Boolean(projectId && dataset);
