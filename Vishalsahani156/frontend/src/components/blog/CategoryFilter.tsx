import { Link } from 'react-router-dom'
import { BLOG_CATEGORIES } from '../../types/blog'

interface CategoryFilterProps {
  activeCategory?: string
  basePath?: string
}

export function CategoryFilter({ activeCategory, basePath = '/blog' }: CategoryFilterProps) {
  return (
    <div className="history-filters">
      <Link
        to={basePath}
        className={`filter-chip${!activeCategory ? ' filter-chip--active' : ''}`}
      >
        All
      </Link>
      {BLOG_CATEGORIES.map((cat) => (
        <Link
          key={cat.slug}
          to={`/blog/category/${cat.slug}`}
          className={`filter-chip${activeCategory === cat.slug ? ' filter-chip--active' : ''}`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  )
}
