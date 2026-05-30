import { Link } from 'react-router-dom'

interface PaginationProps {
  page: number
  totalPages: number
  basePath: string
  query?: string
}

export function Pagination({ page, totalPages, basePath, query }: PaginationProps) {
  if (totalPages <= 1) return null

  function href(targetPage: number) {
    const params = new URLSearchParams()
    if (targetPage > 1) params.set('page', String(targetPage))
    if (query) params.set('q', query)
    const qs = params.toString()
    return qs ? `${basePath}?${qs}` : basePath
  }

  return (
    <nav className="pagination" aria-label="Blog pagination">
      <Link
        to={href(page - 1)}
        className={`btn-secondary btn-sm${page <= 1 ? ' disabled-link' : ''}`}
        aria-disabled={page <= 1}
        onClick={(e) => page <= 1 && e.preventDefault()}
      >
        Previous
      </Link>
      <span className="pagination-info">
        Page {page} of {totalPages}
      </span>
      <Link
        to={href(page + 1)}
        className={`btn-secondary btn-sm${page >= totalPages ? ' disabled-link' : ''}`}
        aria-disabled={page >= totalPages}
        onClick={(e) => page >= totalPages && e.preventDefault()}
      >
        Next
      </Link>
    </nav>
  )
}
