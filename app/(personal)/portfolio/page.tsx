import { client } from '@/sanity/lib/client'
import { WORK_GALLERY_QUERY } from '@/sanity/lib/queries'

export default async function PortfolioPage() {
  const works = await client.fetch(WORK_GALLERY_QUERY, { section: 'portfolio' })

  // render grid + lightbox (next steps)
  return <div>{/* gallery */}</div>
}
