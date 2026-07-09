import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId, readToken, useCdn } from './env';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: readToken,
  useCdn,
  perspective: 'published',
});
