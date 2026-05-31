import { HomeExperience } from '@/features/home/HomeExperience'
import { getArtworks } from '@/server/repositories/artworks'

// Server Component: fetches the catalog (Supabase or seed fallback) and hands
// it to the client island. Revalidated periodically.
export const revalidate = 300

export default async function HomePage() {
  const artworks = await getArtworks()
  return <HomeExperience artworks={artworks} />
}
