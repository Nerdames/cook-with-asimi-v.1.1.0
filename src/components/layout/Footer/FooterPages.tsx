import React from 'react'
import Link from 'next/link'
import styles from './Footer.module.css'

const FooterPages: React.FC = () => {
  return (
    <div className={styles.footer1Item}>
      <p className={styles.itemTopic}>Pages</p>
      <ul>
        <li>
          <Link href="/about">About Us</Link>
        </li>
        <li>
          <Link href="/disclaimer">Disclaimer</Link>
        </li>
        <li>
          <Link href="/privacy">Privacy Policy</Link>
        </li>
      </ul>
    </div>
  )
}

export default FooterPages
