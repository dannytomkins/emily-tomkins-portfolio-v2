import { client } from '@/sanity/lib/client'
import { WORK_GALLERY_QUERY } from '@/sanity/lib/queries'

export default async function StudentWorkPage() {
  const works = await client.fetch(WORK_GALLERY_QUERY, { section: 'studentWork' })
  return <div>{/* gallery */}</div>
}
