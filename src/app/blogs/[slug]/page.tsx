import { notFound } from 'next/navigation'
import { getAllContent } from '@/lib/getAllContent'
import { BlogContentViewer } from '@/components'
import type { Metadata } from 'next'
import type { Blog } from '@/types/blog'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const result = await getAllContent({ type: 'blog', slug: params.slug })
  const blog = result.data[0] as Blog | undefined

  return {
    title: blog?.title ?? `Blog: ${params.slug}`,
    description: blog?.description ?? 'Read this blog on Cook with Asimi',
  }
}

export default async function BlogPage({
  params,
}: {
  params: { slug: string }
}) {
  const result = await getAllContent({ type: 'blog', slug: params.slug })
  const blog = result.data[0] as Blog | undefined

  // Guard against missing data
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
      related={blog.related || []} // ✅ now comes from query
    />
  )
}
