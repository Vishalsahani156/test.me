import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DashboardNav } from '../components/layout/DashboardNav'
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
      <div className="app-shell">
        <DashboardNav />
        <main className="manager-main">
          <p className="loading-text">Loading article…</p>
        </main>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="app-shell">
        <DashboardNav />
        <main className="manager-main">
          <p className="empty-note">Article not found.</p>
          <Link to="/blog">Back to blog</Link>
        </main>
      </div>
    )
  }

  const categoryName = blogApi.getCategoryName(post.category)

  return (
    <div className="app-shell">
      <DashboardNav />

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
    </div>
  )
}
