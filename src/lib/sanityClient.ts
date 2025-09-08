import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.SANITY_API_VERSION || '2023-01-01',
  useCdn: false, // or true depending on your use-case
  token: process.env.SANITY_TOKEN || undefined,
})
