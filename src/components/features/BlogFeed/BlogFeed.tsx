'use client'

import { useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ContentCard, SkeletonCard, Pager, TagFilter } from '@/components'
import { useFetchContent } from '@/hook'
import type { Blog } from '@/types'
import styles from './BlogFeed.module.css'

// --- Helpers ---
const highlightMatch = (text: string, q: string) => {
  if (!q) return text
  const safeQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${safeQ})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

const getExcerpt = (body: Blog['body'], q: string) => {
  if (!Array.isArray(body) || !q) return ''
  const lowerQ = q.toLowerCase()
  for (const block of body) {
    if (!block.children) continue
    for (const child of block.children) {
      if (child.text.toLowerCase().includes(lowerQ)) return child.text
    }
  }
  return ''
}

// --- Component ---
export default function BlogFeed() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const searchQuery = searchParams.get('q') || ''
  const selectedTag = searchParams.get('tag') || 'All'
  const selectedCategory = searchParams.get('category') || ''
  const sortOrder = (searchParams.get('sort') as 'asc' | 'desc') || 'desc'
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const blogsPerPage = 6

  const { data: blogs, loading, error, total } = useFetchContent<Blog>({
    type: 'blog',
    tag: selectedTag !== 'All' ? selectedTag : undefined,
    category: selectedCategory || undefined,
    search: searchQuery || undefined,
    limit: blogsPerPage,
    offset: (currentPage - 1) * blogsPerPage,
    sort: `publishedAt ${sortOrder}`,
  })

  const uniqueTags = useMemo(() => {
    const tags = blogs?.flatMap(b => b.tags || []) ?? []
    return ['All', ...tags.filter((v, i, a) => a.indexOf(v) === i)]
  }, [blogs])

  const updateParam = (key: string, value: string | number | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null || value === '' || value === 'All') {
      params.delete(key)
    } else {
      params.set(key, String(value))
    }
    if (key !== 'page') params.delete('page')
    router.push(`?${params.toString()}`)
  }

  const handleTagSelect = (tag: string) => updateParam('tag', tag)
  const handlePageChange = (page: number) => updateParam('page', page)

  if (!searchQuery && blogs?.length === 0) {
    return <p className="p-8 text-center">No blogs to display.</p>
  }

  return (
    <section className={styles.contentFeed}>
      <TagFilter
        tags={uniqueTags}
        selectedTag={selectedTag}
        onSelectTag={handleTagSelect}
        loading={loading && uniqueTags.length === 0}
      />

      <div className={styles.blogGrid}>
        {loading ? (
          Array.from({ length: blogsPerPage }).map((_, i) => <SkeletonCard key={i} />)
        ) : error ? (
          <p className="text-red-500">Failed to load blogs: {error}</p>
        ) : blogs.length > 0 ? (
          blogs.map(blog => {
            const matchedExcerpt = getExcerpt(blog.body, searchQuery)
            const highlightedDescription = matchedExcerpt
              ? highlightMatch(matchedExcerpt, searchQuery)
              : highlightMatch(blog.description || '', searchQuery)
            const highlightedTitle = highlightMatch(blog.title, searchQuery)

            return (
              <ContentCard
                key={blog._id}
                id={blog._id}
                slug={blog.slug}
                image={blog.thumbnail}
                video={blog.video}
                date={blog.date || 'Unknown Date'}
                title={<span dangerouslySetInnerHTML={{ __html: highlightedTitle }} />}
                description={<span dangerouslySetInnerHTML={{ __html: highlightedDescription }} />}
                category={typeof blog.category === 'string' ? blog.category : blog.category?.title || 'General'}
                author={blog.author?.name || 'Unknown'}
                tags={blog.tags || []}
                primaryAction="Read More"
                onTagClick={handleTagSelect}
              />
            )
          })
        ) : (
          <p>No blogs found for this filter.</p>
        )}
      </div>

      {!loading && total && total > blogsPerPage && (
        <Pager
          currentPage={currentPage}
          totalPages={Math.ceil(total / blogsPerPage)}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  )
}
