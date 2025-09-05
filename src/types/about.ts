import type { PortableTextBlock } from "@portabletext/types"

export interface About {
  _id: string
  slug: string
  title: string
  description?: string
  body: PortableTextBlock[] // rich text content
  image?: { url: string }
  publishedAt?: string
}
