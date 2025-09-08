import { notFound } from 'next/navigation'
import { sanityClient } from '@/lib/sanityClient'
import { groq } from 'next-sanity'
import { BlogContentViewer } from '@/components'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

// ---- GROQ Query ----
const blogQuery = groq`
  *[_type == "blog" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    description,
    date,
    author->{ name },
    category->{ title },
    body,
    video,
    thumbnail{ asset->{ url } },
    tags,
    "related": *[
      _type == "blog" &&
      slug.current != ^.slug.current &&
      count(tags[@._ref in ^.tags[]._ref]) > 0
    ][0..4]{
      title,
      "slug": slug.current
    }
  }
`

// ---- Metadata ----
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params // ✅ destructure first
  const blog = await sanityClient.fetch(blogQuery, { slug })

  return {
    title: blog?.title ?? `Blog: ${slug}`,
    description: blog?.description ?? 'Read this blog on Cook with Asimi',
  }
}

// ---- Page Component ----
export default async function BlogPage({ params }: { params: { slug: string } }) {
  const { slug } = params // ✅ destructure before using
  const blog = await sanityClient.fetch(blogQuery, { slug })

  if (!blog || !blog.title || !blog.slug || !blog.body) {
    notFound()
  }

  return (
    <BlogContentViewer
      title={blog.title}
      date={blog.date}
      author={{ name: blog.author?.name || 'Unknown Author' }}
      category={{ title: blog.category?.title || 'Uncategorized' }}
      description={blog.description}
      tags={blog.tags || []}
      thumbnail={blog.thumbnail}
      video={blog.video}
      body={blog.body}
      related={blog.related || []}
    />
  )
}
