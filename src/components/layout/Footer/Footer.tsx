import FooterCategories from './FooterCategories'
import FooterPages from './FooterPages'
import FooterSocials from './FooterSocials'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer1}>
        <FooterCategories />
        <FooterPages />
        <FooterSocials />
      </div>
      <div className={styles.footer2}>
        <p>&copy; {new Date().getFullYear()} Foodie Vlogs. All rights reserved.</p>
        <p>Built by James Orjiene</p>
      </div>
    </footer>
  )
}
