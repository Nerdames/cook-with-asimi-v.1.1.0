import React from 'react'
import styles from './Footer.module.css'

const FooterPages: React.FC = () => {
  return (
    <div className={styles.footer1Item}>
      <p className={styles.itemTopic}>Pages</p>
      <ul>
        <li><a href="#">About Us</a></li>
        <li><a href="#">Disclaimer</a></li>
        <li><a href="#">Privacy Policy</a></li>
      </ul>
    </div>
  )
}

export default FooterPages
