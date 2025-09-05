'use client'

import Link from 'next/link'
import React from 'react'
import { SkeletonCard } from '@/components'
import styles from './FigureContent.module.css'

interface FigureContentProps {
  image: string
  text: string
  tag?: string
  slug?: string
  loading?: boolean
}

export default function FigureContent({
  image,
  text,
  tag,
  slug,
  loading = false,
}: FigureContentProps) {
  if (loading) {
    return (
      <div className={styles.figContent}>
        <SkeletonCard />
      </div>
    )
  }

  const InnerContent = () => (
    <div className={styles.figContent}>
      <div className={styles.figImg}>
        <img src={image} alt={text} loading="lazy" />

        {tag && <div className={styles.figTag}>{tag}</div>}

        <div className={styles.figOverlay}>
          <p>{text}</p>
        </div>
      </div>
    </div>
  )

  return slug ? (
    <Link href={`/blogs/${slug}`} className={styles.linkWrap} scroll={true}>
      <InnerContent />
    </Link>
  ) : (
    <InnerContent />
  )
}
