import {sanityFetch} from '@/sanity/lib/live'
import {worksBySectionQuery} from '@/sanity/lib/queries'
import {WorkGallery} from '@/components/WorkGallery'

export default async function PortfolioPage() {
  const {data: works} = await sanityFetch({
    query: worksBySectionQuery,
    params: {section: 'portfolio'},
    perspective: 'published',
  })

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">Portfolio</h1>
      <WorkGallery works={works ?? []} />
    </div>
  )
}
