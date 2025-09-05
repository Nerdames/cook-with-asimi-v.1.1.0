import { NextResponse } from 'next/server'
import { getAllContent } from '@/lib/getAllContent'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const type = searchParams.get('type') as 'blog' | 'about'
  const slug = searchParams.get('slug') || undefined
  const search = searchParams.get('search') || undefined
  const category = searchParams.get('category') || undefined
  const tag = searchParams.get('tag') || undefined
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const offset = parseInt(searchParams.get('offset') || '0', 10)
  const sort = searchParams.get('sort') || 'publishedAt desc'

  const data = await getAllContent({ type, slug, search, category, tag, limit, offset, sort })

  return NextResponse.json(data)
}
