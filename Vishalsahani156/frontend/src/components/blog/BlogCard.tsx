import { Link } from 'react-router-dom'
import type { BlogPost } from '../../types/blog'
import { blogApi } from '../../services/blogApi'

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  const categoryName = blogApi.getCategoryName(post.category)

  return (
    <Link to={`/blog/${post.slug}`} className="blog-card">
      <span className="blog-category-pill">{categoryName}</span>
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
      <div className="blog-card-meta">
        <span>{post.author}</span>
        <span>{post.readMinutes} min read</span>
        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
      </div>
    </Link>
  )
}
