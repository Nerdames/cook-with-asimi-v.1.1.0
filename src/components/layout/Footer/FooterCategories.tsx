import React from 'react'
import styles from './Footer.module.css'

const FooterCategories: React.FC = () => {
  return (
    <div className={styles.footer1Item}>
      <p className={styles.itemTopic}>Categories</p>
      <ul>
        <li><a href="#">Car Shine Tips</a></li>
        <li><a href="#">Car Wash Tips</a></li>
        <li><a href="#">DIY Car Repair</a></li>
      </ul>
    </div>
  )
}

export default FooterCategories
