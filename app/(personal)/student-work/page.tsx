import ImageBox from '@/components/ImageBox'
import {sanityFetch} from '@/sanity/lib/live'
import {worksBySectionQuery} from '@/sanity/lib/queries'

export default async function StudentWorkPage() {
  const {data: works} = await sanityFetch({
    query: worksBySectionQuery,
    params: {section: 'studentWork'},
    perspective: 'published',
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Student Work</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {works?.map((work: any) => (
          <div key={work._id} className="overflow-hidden rounded-md border">
            <ImageBox image={work.coverImage} alt="" classesWrapper="relative aspect-[16/9]" />
            <div className="p-4">
              <div className="text-lg font-medium">{work.title}</div>
              {work.year ? <div className="text-sm opacity-70">{work.year}</div> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
