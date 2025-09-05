import React from 'react'
import styles from './Footer.module.css'

const FooterSocials: React.FC = () => {
  return (
    <div className={styles.footer1Item}>
      <p className={styles.itemTopic}>Contact Us</p>
      <ul>
        <li>
          <a href="mailto:example@example.com" target="_blank" rel="noopener noreferrer">
            <i className='bx bx-envelope'></i>
            <span>Email</span>
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
            <i className='bx bxl-linkedin'></i>
            <span>LinkedIn</span>
          </a>
        </li>
        <li>
          <a href="https://wa.me/yourwhatsapplink" target="_blank" rel="noopener noreferrer">
            <i className='bx bxl-whatsapp'></i>
            <span>WhatsApp</span>
          </a>
        </li>
      </ul>
    </div>
  )
}

export default FooterSocials
