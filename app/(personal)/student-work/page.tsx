import { client } from '@/sanity/lib/client'

const query = /* groq */ `
  *[_type == "project" && "student-work" in tags[]]
  | order(_createdAt desc) {
    _id,
    title,
    slug,
    tags,
    mainImage,
    coverImage,
  }
`

export default async function StudentWorkPage() {
  const projects = await client.fetch(query)

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Student Work</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* render cards */}
      </div>
    </main>
  )
}
