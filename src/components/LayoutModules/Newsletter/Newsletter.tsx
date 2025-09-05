'use client'

import { useState } from 'react'
import styles from './Newsletter.module.css'

export default function Newsletter() {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)

  const isFormValid = firstName.trim() !== '' && email.trim() !== '' && consent

  return (
    <div className={styles.newsletter}>
      <div className={styles.contentWrapper}>
        <h3>Join My Exclusive Cooking Newsletter</h3>
        <p>
          Get a taste of delicious updates! Join thousands of food lovers on my free email list.
          Be the first to receive new recipes, cooking tips, and exclusive kitchen hacks straight to your inbox.
        </p>

        <form
          className={styles.newsletterForm}
          onSubmit={(e) => {
            e.preventDefault()
            // submission logic here if needed
          }}
        >
          <input
            type="text"
            placeholder="Your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className={styles.checkbox} htmlFor="consent">
            <input
              id="consent"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
            />
            <span>I agree to receive emails from Cook With Asimi.</span>
          </label>

          <button
            type="submit"
            disabled={!isFormValid}
            className={styles.submitButton}
          >
            Yes, Sign Me Up
          </button>
        </form>

        <small className={styles.privacyNote}>
          We respect your privacy. You can unsubscribe anytime.
        </small>
      </div>
    </div>
  )
}
