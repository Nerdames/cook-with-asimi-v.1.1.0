'use client'

import styles from './Pager.module.css'
import 'boxicons/css/boxicons.min.css'

interface PagerProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pager: React.FC<PagerProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const createPageRange = () => {
    const range: number[] = []
    const delta = 2

    const start = Math.max(1, currentPage - delta)
    const end = Math.min(totalPages, currentPage + delta)

    for (let i = start; i <= end; i++) {
      range.push(i)
    }

    return range
  }

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page)
      // Smooth scroll to top after changing page
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  return (
    <div className={styles.pager}>
      {currentPage > 1 && (
        <button
          className={styles['pager-item']}
          onClick={() => handlePageClick(currentPage - 1)}
        >
          <i className="bx bx-left-arrow-alt" />
          Prev
        </button>
      )}

      {createPageRange().map((page) => (
        <button
          key={page}
          className={`${styles['pager-item']} ${
            currentPage === page ? styles.active : ''
          }`}
          onClick={() => handlePageClick(page)}
        >
          {page}
        </button>
      ))}

      {currentPage < totalPages && (
        <button
          className={styles['pager-item']}
          onClick={() => handlePageClick(currentPage + 1)}
        >
          Next
          <i className="bx bx-right-arrow-alt" />
        </button>
      )}
    </div>
  )
}

export default Pager
