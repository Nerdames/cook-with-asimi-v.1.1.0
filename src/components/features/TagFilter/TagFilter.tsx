'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import { SkeletonButton } from '@/components'
import styles from "./TagFilter.module.css"

interface TagFilterProps {
  tags: string[]
  selectedTag: string
  onSelectTag: (tag: string) => void
  loading?: boolean
}

const TagFilter: React.FC<TagFilterProps> = ({
  tags = [],
  selectedTag,
  onSelectTag,
  loading = false
}) => {
  const selectedTagRef = useRef<HTMLButtonElement | null>(null)

  // Set ref only to the selected button
  const setTagRef = useCallback(
    (el: HTMLButtonElement | null, tag: string) => {
      if (tag === selectedTag) {
        selectedTagRef.current = el
      }
    },
    [selectedTag]
  )

  useEffect(() => {
    selectedTagRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    })
  }, [selectedTag])

  return (
    <div className={styles.tagFilterContainer}>
      {loading
        ? Array.from({ length: 8 }).map((_, idx) => (
            <SkeletonButton key={idx} />
          ))
        : tags.map((tag) => (
            <button
              key={tag}
              type="button"
              ref={(el) => setTagRef(el, tag)}
              className={selectedTag === tag ? styles.active : ""}
              onClick={() => onSelectTag(tag)}
              aria-pressed={selectedTag === tag}
            >
              {tag}
            </button>
          ))
      }
    </div>
  )
}

export default TagFilter
