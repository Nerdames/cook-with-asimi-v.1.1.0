import type { PortableTextBlock } from "@portabletext/types"

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
  related?: Blog[] // ✅ blogs with shared tags
}
