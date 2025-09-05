'use client'

import Link from 'next/link'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import styles from './BlogContentViewer.module.css'

interface BlogContentViewerProps {
  title: string
  date: string
  author: { name: string }
  category: { title: string }
  description: string
  video?: string
  body: PortableTextBlock[]
  tags: string[]
  thumbnail?: { asset: { url: string } }
  related?: { title: string; slug?: { current?: string } }[]
}

function getEmbedUrl(videoUrl: string): string {
  try {
    const url = new URL(videoUrl)
    if (url.hostname.includes('youtube.com') && url.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${url.searchParams.get('v')}`
    }
    if (url.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${url.pathname.slice(1)}`
    }
    return videoUrl
  } catch {
    return videoUrl
  }
}

export default function BlogContentViewer({
  title,
  date,
  author,
  category,
  description,
  video,
  body,
  tags,
  thumbnail,
  related = [],
}: BlogContentViewerProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className={styles.viewer}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.meta}>
        By <strong>{author.name}</strong> in <em>{category.title}</em> | {formattedDate}
      </p>

      {thumbnail?.asset?.url && (
        <Image
          src={thumbnail.asset.url}
          alt={title}
          width={800}
          height={450}
          className={styles.thumbnail}
          priority
        />
      )}

      <p className={styles.description}>{description}</p>

      {video && (
        <div className={styles.videoSection}>
          <iframe
            src={getEmbedUrl(video)}
            title="Video Preview"
            allowFullScreen
          />
        </div>
      )}

      <section className={styles.section}>
        <h3>Content</h3>
        <PortableText value={body} />
      </section>

      {tags.length > 0 && (
        <section className={styles.section}>
          <h4>Tags</h4>
          <div className={styles.contentTags}>
            {tags.map((tag, idx) => (
              <span key={idx} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className={styles.section}>
          <h4>Related Posts</h4>
          <ul className={styles.relatedList}>
            {related.map((rel, idx) =>
              rel?.slug?.current ? (
                <li key={idx}>
                  <Link href={`/blogs/${rel.slug.current}`}>{rel.title}</Link>
                </li>
              ) : null
            )}
          </ul>
        </section>
      )}
    </article>
  )
}
