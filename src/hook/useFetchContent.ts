'use client'

import { useState, useEffect } from 'react'
import { getAllContent } from '@/lib/getAllContent'
import type { Blog, About } from '@/types'

export type ContentType = 'blog' | 'about'

export interface FetchOptions {
  type: ContentType
  slug?: string
  category?: string
  tag?: string
  search?: string
  limit?: number
  offset?: number
  sort?: string
}

export interface FetchResult<T> {
  data: T[]
  loading: boolean
  error: string | null
  total: number
}

export function useFetchContent<T extends Blog | About = Blog>({
  type,
  slug,
  category,
  tag,
  search,
  limit = 10,
  offset = 0,
  sort = 'date desc',
}: FetchOptions): FetchResult<T> {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    let cancelled = false

    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const result = await getAllContent({
          type,
          slug,
          category,
          tag,
          search,
          limit,
          offset,
          sort,
        })

        let mappedData = result.data as T[]

        // ✅ Ensure Blog.slug is always defined
        if (type === 'blog') {
          mappedData = mappedData.map((item: T) => {
            const blog = item as Blog
            return { ...blog, slug: blog.slug || blog._id } as T
          })
        }

        if (!cancelled) {
          setData(mappedData)
          setTotal(result.total)
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err)
          setError('Failed to fetch content')
          setData([])
          setTotal(0)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [type, slug, category, tag, search, limit, offset, sort])

  return { data, loading, error, total }
}
