'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Navbar.module.css'
import { Logo, SearchBar } from '@/components'
import clsx from 'clsx'
import 'boxicons/css/boxicons.min.css'

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/blogs', label: 'Blogs' },
  { path: '/about', label: 'About' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [isFixed, setIsFixed] = useState(false)
  const [showNavbar, setShowNavbar] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    setIsMounted(true)

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsFixed(currentScrollY > 150)
      setShowNavbar(currentScrollY < lastScrollY.current || currentScrollY < 50)
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev)

  const isActive = (path: string) => {
    if (!isMounted) return false
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  return (
    <div
      className={clsx(
        styles.nav,
        isFixed ? styles.fixed : styles.sticky,
        showNavbar ? styles.visible : styles.hidden
      )}
    >
      {/* Left: Logo */}
      <div className={styles.navLeft}>
        <Logo />
      </div>

      {/* Center: Nav links */}
      <div className={clsx(styles.navCenter, isMobileMenuOpen && styles.mobileOpen)}>
        <ul className={clsx(styles.pages, isMobileMenuOpen && styles.mobileOpen)}>
          {navItems.map(({ path, label }) => (
            <li key={path}>
              <Link
                href={path}
                className={clsx(styles.link, isActive(path) && styles.active)}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: SearchBar + Mobile toggle */}
      <div className={styles.navRight}>
        {/* Desktop SearchBar */}
        <div className={styles.searchWrapper}>
          <SearchBar />
        </div>

        {/* Mobile toggle button */}
        <button
          className={styles.mobileToggle}
          onClick={toggleMobileMenu}
          aria-label="Toggle Menu"
          aria-expanded={isMobileMenuOpen}
        >
          <i
            className={`bx ${isMobileMenuOpen ? 'bx-x' : 'bx-menu'}`}
            style={{ fontSize: '24px' }}
          />
        </button>
      </div>
    </div>
  )
}
