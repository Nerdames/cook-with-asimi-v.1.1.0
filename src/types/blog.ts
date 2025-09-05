// C:\Users\chibu\Desktop\Next\cook-with-asimi\types\blog.ts
import type { PortableTextBlock } from "@portabletext/types"

export interface Blog {
  _id: string
  title: string
  slug: string
  description?: string
  body: PortableTextBlock[]
  tags?: {
    title: string
    slug: string
  }[]
  category?: {
    title: string
    slug: string
  }
  thumbnail?: string
  video?: string
  date: string // ✅ matches schema "date"
}
