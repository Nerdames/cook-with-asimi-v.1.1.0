'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './RelatedTopics.module.css'
import { getAllContent } from '@/lib/getAllContent'
import type { Blog } from '@/types/blog'

export default function RelatedTopics() {
  const [topics, setTopics] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const result = await getAllContent({ type: 'blog', limit: 12 });
        const blogs = (result.data as Blog[]) || [];
        const allTags = blogs.flatMap(blog => blog.tags?.map(t => t.title) || []);
        setTopics(Array.from(new Set(allTags)).slice(0, 6)); // unique + limit
      } catch (err) {
        console.error('Failed to fetch related topics', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTopics()
  }, [])

  return (
    <section className={styles.relatedTopics}>
      <h2 className={styles.title}>Related Topics</h2>
      <ul className={styles.topicList}>
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <li key={idx} className={styles.topicItem}>Loading…</li>
            ))
          : topics.length > 0
          ? topics.map((topic, idx) => (
              <li key={idx} className={styles.topicItem}>
                <Link href={`/blogs?tag=${encodeURIComponent(topic)}`}>{topic}</Link>
              </li>
            ))
          : <li className={styles.topicItem}>No topics available</li>}
      </ul>
    </section>
  )
}
