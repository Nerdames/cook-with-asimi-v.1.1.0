'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './RelatedTopics.module.css'
import { getAllContent } from '@/lib/getAllContent'
import type { Blog } from '@/types/blog'

type TagLike = string | { title?: string; slug?: string; name?: string }

interface TagCount {
  tag: string
  count: number
}

export default function RelatedTopics() {
  const [topics, setTopics] = useState<TagCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchTopics() {
      try {
        setLoading(true)
        setError(null)

        // fetch a reasonably large sample so counts are meaningful
        const result = await getAllContent({ type: 'blog', limit: 200 })
        const blogs = (result.data as Blog[]) || []

        const tagMap: Record<string, number> = {}

        for (const blog of blogs) {
          const rawTags: unknown = blog.tags

          if (!Array.isArray(rawTags)) continue

          for (const t of rawTags as TagLike[]) {
            let key: string | undefined

            if (typeof t === 'string') {
              key = t
            } else if (t && typeof t === 'object') {
              key = t.title ?? t.slug ?? t.name
            }

            if (!key) continue
            const trimmed = key.trim()
            if (!trimmed) continue

            tagMap[trimmed] = (tagMap[trimmed] || 0) + 1
          }
        }

        const tagCounts: TagCount[] = Object.entries(tagMap)
          .map(([tag, count]) => ({ tag, count }))
          .sort((a, b) => {
            if (b.count !== a.count) return b.count - a.count
            return a.tag.localeCompare(b.tag, undefined, { sensitivity: 'base' })
          })
          .slice(0, 6)

        if (!cancelled) setTopics(tagCounts)
      } catch (err) {
        console.error('RelatedTopics fetch error', err)
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load topics')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchTopics()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className={styles.relatedTopics}>
      <h2 className={styles.title}>Related Topics</h2>

      {error ? (
        <div className={styles.error}>Failed to load topics: {error}</div>
      ) : (
        <ul className={styles.topicList}>
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <li key={idx} className={styles.topicItem}>
                  Loading…
                </li>
              ))
            : topics.length > 0
            ? topics.map(({ tag, count }) => (
                <li key={tag} className={styles.topicItem}>
                  <Link href={`/blogs?tag=${encodeURIComponent(tag)}`}>
                    <span className={styles.tagLabel}>{tag}</span>
                    <span className={styles.tagCount}> ({count})</span>
                  </Link>
                </li>
              ))
            : (
              <li className={styles.topicItem}>No topics available</li>
            )}
        </ul>
      )}
    </section>
  )
}
