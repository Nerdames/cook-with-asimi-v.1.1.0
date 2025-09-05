// lib/queries.ts

// Existing blog queries (no change)
export const blogsQuery = (offset = 0, limit = 6, tag?: string) => {
  const tagFilter = tag && tag !== 'All'
    ? `&& "${tag}" in tags`
    : ''

  return `
    *[_type == "blog" ${tagFilter}]
      | order(date desc)
      [${offset}...${offset + limit}] {
        _id,
        title,
        date,
        author,
        category,
        description,
        thumbnail {
          asset -> {
            url
          }
        },
        tags
      }
  `
}

export const blogsCountQuery = (tag?: string) => {
  const tagFilter = tag && tag !== 'All'
    ? `&& "${tag}" in tags`
    : ''

  return `count(*[_type == "blog" ${tagFilter}])`
}

// ✅ About query
export const aboutQuery = `
  *[_type == "about"][0] {
    _id,
    title,
    description,
    image {
      asset -> {
        url
      }
    }
  }
`
