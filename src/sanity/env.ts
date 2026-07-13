export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-06-29';

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'u09gju27';

export const readToken =
  'skiXDCHljy88ILkOAw8Fg7PovDSqmhLTTRWWRjj5jdtgxETv1y3NmUz4s8gxTkFNjuyQamlr6myAA9R2O9MDx90khCsZ5MfaxV7keh60htNdK1sLVaukEOYQHZZmbHkOgdANlZmTXYuOuzo6fa1d5r3JudtRKXC6MpGiG2B4J22CS2YAXIth';
export const useCdn = process.env.NODE_ENV === 'production' && !readToken;

export const hasValidSanityConfig = Boolean(projectId);
