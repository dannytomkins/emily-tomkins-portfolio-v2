import {sanityFetch} from '@/sanity/lib/live'
import {worksBySectionQuery} from '@/sanity/lib/queries'
import {WorkGallery} from '@/components/WorkGallery'

export default async function StudentWorkPage() {
  const {data: works} = await sanityFetch({
    query: worksBySectionQuery,
    params: {section: 'studentWork'},
    perspective: 'published',
  })

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">Student Work</h1>
      <WorkGallery works={works ?? []} />
    </div>
  )
}
