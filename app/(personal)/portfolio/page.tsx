import { client } from '@/sanity/lib/client'

const query = /* groq */ `
  *[_type == "project" && "portfolio" in tags[]]
  | order(_createdAt desc) {
    _id,
    title,
    slug,
    tags,
    mainImage,
    coverImage,
  }
`

export default async function PortfolioPage() {
  const projects = await client.fetch(query)

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Portfolio</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p: any) => (
          <div key={p._id} className="rounded-lg border p-4">
            <div className="font-medium">{p.title}</div>
            {/* swap in your existing ProjectCard component here */}
          </div>
        ))}
      </div>
    </main>
  )
}
