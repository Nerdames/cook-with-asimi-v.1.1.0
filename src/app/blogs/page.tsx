// app/blogs/page.tsx
'use client'

import '../globals.css'
import { useEffect } from 'react'
import { BlogFeed } from '@/components'

export default function BlogsPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <>
      <header>
        <div className="headerTopic">
          <h1>Blogs</h1>
        </div>
      </header>

      <main>
        <BlogFeed />
      </main>
    </>
  )
}
