'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { groq } from 'next-sanity'
import { sanityClient } from '@/lib/sanityClient'
import styles from './SearchBar.module.css'

interface BlogPost {
  _id: string
  title: string
  slug?: string | null
  description?: string
  tags?: string[]
}

const RECENT_KEY = 'recent-searches'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<BlogPost[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isFocused, setIsFocused] = useState(false)

  const router = useRouter()

  // Load saved searches on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
    setRecentSearches(stored)
  }, [])

  // Run search when query changes
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
          "slug": slug.current,
          description,
          tags
        }
      `

      sanityClient
        .fetch<BlogPost[]>(searchQuery, { q: `*${query}*` })
        .then((data) => {
          setResults(data || [])
          setActiveIndex(-1)
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false))
    }, 400)

    return () => clearTimeout(delayDebounce)
  }, [query])

  // Save a search term
  const saveSearch = (term: string) => {
    if (!term.trim()) return
    const updated = [term, ...recentSearches.filter((q) => q !== term)].slice(0, 6)
    setRecentSearches(updated)
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
  }

  const deleteSearch = (term: string) => {
    const updated = recentSearches.filter((q) => q !== term)
    setRecentSearches(updated)
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
  }

  const clearAllSearches = () => {
    setRecentSearches([])
    localStorage.removeItem(RECENT_KEY)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      saveSearch(query.trim())
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      resetSearch()
    }
  }

  const resetSearch = () => {
    setQuery('')
    setResults([])
    setActiveIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => (prev + 1) % results.length)
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length)
    }

    if (e.key === 'Enter') {
      if (activeIndex >= 0 && results[activeIndex]) {
        const slug = results[activeIndex].slug
        if (slug) {
          router.push(`/blogs/${slug}`)
          saveSearch(results[activeIndex].title)
        }
        resetSearch()
      } else {
        handleSubmit(e)
      }
    }
  }

  const escapeRegex = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  const highlightMatch = useCallback(
    (text: string) => {
      const q = query.trim()
      if (!q) return text
      const regex = new RegExp(`(${escapeRegex(q)})`, 'gi')
      return text.replace(regex, '<mark>$1</mark>')
    },
    [query]
  )

  return (
    <form onSubmit={handleSubmit} className={styles.searchContainer} role="search">
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        required={false}
        aria-autocomplete="list"
        aria-controls="search-results"
        aria-activedescendant={
          activeIndex >= 0 && results[activeIndex]?._id
            ? `search-item-${results[activeIndex]._id}`
            : undefined
        }
      />

      {query && (
        <button
          type="submit"
          className={`${styles.goButton} ${styles.goVisible}`}
          title="Go"
        >
          <i className="bx bx-search" aria-hidden="true"></i>
        </button>
      )}

      {(isFocused && (results.length > 0 || loading || (!loading && query && results.length === 0) || (!query && recentSearches.length > 0))) && (
        <ul className={`${styles.resultsList} ${styles.fadeIn}`} id="search-results" role="listbox">
          {/* Recent searches */}
          {!query &&
            isFocused &&
            recentSearches.map((term) => (
              <li key={`recent-${term}`} className={styles.recentItem}>
                <div
                  className={styles.recentClick}
                  onClick={() => {
                    setQuery(term)
                    router.push(`/search?q=${encodeURIComponent(term)}`)
                    saveSearch(term)
                    resetSearch()
                  }}
                >
                  <i className="bx bx-history" aria-hidden="true"></i>
                  {term}
                </div>
                <button
                  type="button"
                  className={styles.clearOne}
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteSearch(term)
                  }}
                  aria-label={`Remove ${term}`}
                >
                  <i className="bx bx-x"></i>
                </button>
              </li>
            ))}

          {/* Clear all */}
          {!query && isFocused && recentSearches.length > 0 && (
            <li
              className={styles.clearAll}
              onClick={clearAllSearches}
            >
              <i className="bx bx-trash" aria-hidden="true"></i>
              Clear history
            </li>
          )}

          {loading && (
            <li className={styles.searchStatus} role="option">
              Searching...
            </li>
          )}

          {!loading &&
            results.length > 0 &&
            results.map((post, index) => {
              const slug = post.slug
              if (!slug) return null
              return (
                <li
                  key={post._id}
                  id={`search-item-${post._id}`}
                  role="option"
                  aria-selected={index === activeIndex}
                >
                  <Link
                    href={`/blogs/${slug}`}
                    className={`${styles.resultLink} ${index === activeIndex ? styles.activeItem : ''}`}
                    onClick={() => {
                      saveSearch(post.title)
                      resetSearch()
                    }}
                    dangerouslySetInnerHTML={{
                      __html: highlightMatch(post.title),
                    }}
                  />
                </li>
              )
            })}

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
