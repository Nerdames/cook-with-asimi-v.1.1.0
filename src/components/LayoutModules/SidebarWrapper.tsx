'use client'

import { usePathname } from 'next/navigation'
import LayoutSidebar from './LayoutSidebar'

export default function SidebarWrapper() {
  const pathname = usePathname()
  let modules: Array<'recommended' | 'newsletter' | 'related'> = []

  if (pathname === '/' || pathname === '/blogs') {
    modules = ['recommended', 'newsletter']
  } else if (pathname.startsWith('/blogs/') && pathname !== '/blogs') {
    modules = ['related']
  }

  if (modules.length === 0) return null

  return <LayoutSidebar modules={modules} />
}
