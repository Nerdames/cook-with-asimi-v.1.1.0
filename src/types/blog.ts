import type { PortableTextBlock } from "@portabletext/types"

export interface RelatedBlog {
  _id: string
  title: string
  slug: string
  thumbnail?: string
  date: string
}

export interface Blog {
  _id: string
  title: string
  slug: string
  description?: string
  body: PortableTextBlock[]
  tags?: string[]   // ✅ plain strings
  category?: {
    title: string
    slug: string
  }
  thumbnail?: string
  video?: string
  date: string
  author?: {
    name: string
  }
  related?: RelatedBlog[] // ✅ lightweight type
}
