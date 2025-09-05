'use client'

import { useEffect } from 'react'
import { HeroCarousel, BlogFeed } from '@/components'
import './globals.css'

export default function Home() { 
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <header>
        <HeroCarousel />
      </header>

      <main>
        {/* Unified BlogFeed handles search, tags, categories, pagination */}
        <BlogFeed />
      </main>
    </>
  )
}
