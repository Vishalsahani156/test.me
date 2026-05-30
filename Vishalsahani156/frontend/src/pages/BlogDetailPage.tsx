import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { RelatedArticles } from '../components/blog/RelatedArticles'
import { blogApi } from '../services/blogApi'
import type { BlogPost } from '../types/blog'

export function BlogDetailPage() {
  const { slug = '' } = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [related, setRelated] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([blogApi.getPostBySlug(slug), blogApi.getRelatedPosts(slug)])
      .then(([found, relatedPosts]) => {
        setPost(found)
        setRelated(relatedPosts)
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <main className="manager-main">
        <p className="loading-text">Loading article…</p>
      </main>
    )
  }

  if (!post) {
    return (
      <main className="manager-main">
        <p className="empty-note">Article not found.</p>
        <Link to="/blog">Back to blog</Link>
      </main>
    )
  }

  const categoryName = blogApi.getCategoryName(post.category)

  return (
    <main className="manager-main">
      <Link to="/blog" className="back-link">← Back to blog</Link>

      <article className="resume-card blog-article">
        <span className="blog-category-pill">{categoryName}</span>
        <h1>{post.title}</h1>
        <div className="blog-card-meta blog-article-meta">
          <span>{post.author}</span>
          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
          <span>{post.readMinutes} min read</span>
        </div>

        <div className="tag-list blog-tags">
          {post.tags.map((tag) => (
            <span key={tag} className="tag tag--found">
              {tag}
            </span>
          ))}
        </div>

        <div className="blog-content">
          {post.content.split('\n\n').map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </article>

      <RelatedArticles posts={related} />
    </main>
  )
}
