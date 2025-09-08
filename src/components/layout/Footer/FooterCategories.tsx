import React from 'react'
import Link from 'next/link'
import styles from './Footer.module.css'

const FooterCategories: React.FC = () => {
  return (
    <div className={styles.footer1Item}>
      <p className={styles.itemTopic}>Categories</p>
      <ul>
        <li>
          <Link href="/blogs/category/breakfast">Breakfast</Link>
        </li>
        <li>
          <Link href="/blogs/category/lunch">Lunch</Link>
        </li>
        <li>
          <Link href="/blogs/category/dinner">Dinner</Link>
        </li>
        <li>
          <Link href="/blogs/category/desserts">Desserts</Link>
        </li>
        <li>
          <Link href="/blogs/category/snacks">Snacks</Link>
        </li>
      </ul>
    </div>
  )
}

export default FooterCategories
