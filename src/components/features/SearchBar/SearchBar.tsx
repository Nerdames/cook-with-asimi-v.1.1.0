'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { groq } from 'next-sanity'
import { sanityClient } from '@/lib/sanityClient'
import styles from './SearchBar.module.css'

interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  tags?: string[]
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const router = useRouter()

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setActiveIndex(-1)
      return
    }

    const delayDebounce = setTimeout(() => {
      setLoading(true)

      const searchQuery = groq`
        *[_type == "blog" && (
          title match $q ||
          description match $q ||
          $q in tags[]
        )][0...5] {
          _id,
          title,
          slug,
          description,
          tags
        }
      `

      sanityClient
        .fetch(searchQuery, { q: `*${query}*` })
        .then((data: BlogPost[]) => {
          setResults(data)
          setActiveIndex(-1)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }, 400)

    return () => clearTimeout(delayDebounce)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
      setResults([])
      setActiveIndex(-1)
    }
  }

  const handleResultClick = () => {
    setQuery('')
    setResults([])
    setActiveIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(prev => (prev + 1) % results.length)
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(prev => (prev - 1 + results.length) % results.length)
    }

    if (e.key === 'Enter') {
      if (activeIndex >= 0 && results[activeIndex]) {
        router.push(`/blogs/${results[activeIndex].slug.current}`)
        handleResultClick()
      } else {
        handleSubmit(e)
      }
    }
  }

  const highlightMatch = (text: string) => {
    const q = query.trim()
    if (!q) return text
    const regex = new RegExp(`(${q})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }

  return (
    <form onSubmit={handleSubmit} className={styles.searchContainer} role="search">
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        required
        aria-autocomplete="list"
        aria-controls="search-results"
        aria-activedescendant={
          activeIndex >= 0 && results[activeIndex]?._id
            ? `search-item-${results[activeIndex]._id}`
            : undefined
        }
      />

      {query && (
        <button type="submit" className={`${styles.goButton} ${styles.goVisible}`} title="Go">
          <i className="bx bx-search"></i>
        </button>
      )}

      {(results.length > 0 || loading || (!loading && query && results.length === 0)) && (
        <ul
          className={`${styles.resultsList} ${styles.fadeIn}`}
          id="search-results"
          role="listbox"
        >
          {loading && (
            <li className={styles.searchStatus} role="option">
              Searching...
            </li>
          )}

          {!loading && results.length > 0 &&
            results.map((post, index) => (
              <li
                key={post._id}
                id={`search-item-${post._id}`}
                role="option"
                aria-selected={index === activeIndex}
              >
                <Link
                  href={`/blogs/${post.slug.current}`}
                  className={`${styles.resultLink} ${index === activeIndex ? styles.activeItem : ''}`}
                  onClick={handleResultClick}
                  dangerouslySetInnerHTML={{ __html: highlightMatch(post.title) }}
                />
              </li>
            ))}

          {!loading && query && results.length === 0 && (
            <li className={styles.searchStatus} role="option">
              No results found.
            </li>
          )}
        </ul>
      )}
    </form>
  )
}
