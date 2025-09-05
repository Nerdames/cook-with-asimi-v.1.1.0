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
 * - Blogs: supports slug, search, category, tag, pagination, sorting
 * - About: returns the first (and usually only) entry
 */
export async function getAllContent({
  type,
  slug,
  search,
  category,
  tag,
  limit = 10,
  offset = 0,
  sort = "date desc", // ✅ matches schema field
}: FetchOptions): Promise<{ data: (Blog | About)[]; total: number }> {
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

  // Build blog filters
  let filter = `_type == "blog"`

  if (slug) filter += ` && slug.current == $slug`
  if (category) filter += ` && category->slug.current == $category`
  if (tag) filter += ` && $tag in tags`   // ✅ tags are strings in schema
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
      tags,  // ✅ plain string array
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
