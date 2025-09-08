import { sanityClient } from "./sanityClient"
import type { Blog } from "@/types/blog"
import type { About } from "@/types/about"

type ContentType = "blog" | "about"

interface FetchOptions {
  type: ContentType
  slug?: string
  search?: string
  category?: string
  tag?: string
  limit?: number
  offset?: number
  sort?: string
}

/**
 * Fetches content from Sanity CMS.
 * - About: returns the first (and usually only) entry
 * - Blogs:
 *    • slug → returns one blog + related blogs by shared tags
 *    • list → supports search, category, tag, pagination, sorting
 */
export async function getAllContent({
  type,
  slug,
  search,
  category,
  tag,
  limit = 10,
  offset = 0,
  sort = "date desc",
}: FetchOptions): Promise<{ data: (Blog | About)[]; total: number }> {
  // --------------------
  // About page
  // --------------------
  if (type === "about") {
    const query = `*[_type == "about"][0] {
      _id,
      title,
      description,
      "image": image.asset->url
    }`
    const data = await sanityClient.fetch<About | null>(query)
    return { data: data ? [data] : [], total: data ? 1 : 0 }
  }

  // --------------------
  // Single blog by slug (with related blogs)
  // --------------------
  if (type === "blog" && slug) {
    const query = `*[_type == "blog" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      description,
      body,
      tags, // ✅ plain string array in schema
      "category": category->{ title, "slug": slug.current },
      "author": author->{ name },
      "thumbnail": thumbnail.asset->url,
      video,
      date,
      // Related blogs: share at least 1 tag, exclude self
      "related": *[_type == "blog" && slug.current != $slug && count(tags[@ in ^.tags]) > 0][0...4] {
        _id,
        title,
        "slug": slug.current,
        "thumbnail": thumbnail.asset->url,
        date
      }
    }`

    const blog = await sanityClient.fetch<Blog | null>(query, { slug })
    return { data: blog ? [blog] : [], total: blog ? 1 : 0 }
  }

  // --------------------
  // Blog list (with filters, pagination, sorting)
  // --------------------
  let filter = `_type == "blog"`

  if (category) filter += ` && category->slug.current == $category`
  if (tag) filter += ` && $tag in tags` // ✅ works if tags are plain strings
  if (search) {
    filter += ` && (title match $search || description match $search)`
  }

  const query = `{
    "data": *[${filter}] | order(${sort}) [${offset}...${offset + limit}] {
      _id,
      title,
      "slug": slug.current,
      description,
      body,
      tags,
      "category": category->{ title, "slug": slug.current },
      "author": author->{ name },
      "thumbnail": thumbnail.asset->url,
      video,
      date
    },
    "total": count(*[${filter}])
  }`

  const params: Record<string, string | undefined> = {
    slug,
    category,
    tag,
    search: search ? `*${search}*` : undefined,
  }

  return sanityClient.fetch(query, params)
}
